<script>
import { mapActions, mapGetters } from 'vuex';
import BallotStatus           from '~/pages/trails/ballots/components/BallotStatus';
import BallotChip             from '~/pages/trails/ballots/components/BallotChip';
import BallotOpenVotingDialog from '~/pages/trails/ballots/components/BallotOpenVotingDialog';
import Btn                    from '~/components/CustomButton';
import { supplyToSymbol }     from '~/utils/assets';

const FROM_BOTH = 'both';
const FROM_LIQUID = 'liquid';
const FROM_STAKE = 'stake';

// ipfs hash detection, detects CIDv0 46 character strings starting with 'Qm'
const regex = new RegExp(/Qm[1-9A-HJ-NP-Za-km-z]{44}(\/.*)?/, 'm');

export default {
    name: 'BallotView',
    components: { BallotStatus, BallotChip, Btn, BallotOpenVotingDialog },
    props: {
        isBallotOpened: { type: Function, required: true },
        displayWinner: { type: Function, required: true },
        startTimeHasPassed: { type: Function, required: true },
        getStartTime: { type: Function, required: true },
        getEndTime: { type: Function, required: true },
        getLoser: { type: Function, required: true },
    },
    data() {
        return {
            openBallotDialog: false,
            userCanVote: false,
            loading: true,
            voting: false,
            votes: [],
            defaultSlide: 0,
            scrollPosition: null,
            notice: false,
            showDetails: false,
        };
    },
    async mounted() {
        this.getLoggedUserVotes(this.$route.params.id);
        this.fetchTreasuriesForUser(this.account);
        let ballot_ok = await this.fetchBallot(this.$route.params.id);
        if (!ballot_ok) {
            this.showAlert(this.$t('notifications.trails.noBallot'));
            if (this.$route.fullPath.includes('/trails/ballot')) {
                this.$router.push({ path: '/trails/ballots' });
            } else {
                this.$router.push({ path: '/trails/elections' });
            }
            return;
        }
        window.addEventListener('scroll', this.updateScroll);
        this.loading = false;
    },

    computed: {
        ...mapGetters('notifications', ['notifications']),
        ...mapGetters('accounts', ['isAuthenticated', 'account', 'accountData']),
        ...mapGetters('trails', ['ballot', 'userVotes', 'voters', 'userTreasury']),
        daysSinceStarted() {
            const oneDay = 24 * 60 * 60 * 1000;
            const today = Date.now();
            const startDate = new Date(this.ballot.begin_time).getTime();
            const diffDays = Math.round(Math.abs((today - startDate) / oneDay));
            return diffDays;
        },
        getWinner() {
            if (!this.ballot.total_voters) return 'No votes';
            let winnerValue = -1;
            let winner;
            this.ballot.options.forEach((option, index) => {
                if (parseFloat(option.value) > winnerValue) {
                    winnerValue = parseFloat(option.value);
                    winner = index;
                }
            });
            return this.ballot.options[winner];
        },
        optionData() {
            try {
                const data = Object.values(JSON.parse(this.ballot.content).optionData);
                return data;
            } catch (error) {
                return null;
            }
        },
        iframeUrl() {
            let content = this.ballot.content;
            let file_path = null;

            // catch parse possible errors
            try {
                content = JSON.parse(this.ballot.content);
            } catch (e) {
                console.error(e);
            }
            try {
                file_path = regex.exec(this.ballot.description);
            } catch (e) {
                console.error(e);
            }

            if (Array.isArray(file_path)) {
                const r = 'https://ipfs.io/ipfs/' + file_path[0];
                return r;
            } else if (typeof content === 'object') {
                // prioritize content urls over image urls
                const r =
          content.contentUrl ||
          (content.contentUrls || [])[0] ||
          content.imageUrl ||
          (content.imageUrls || [])[0];
                return r;
            } else {
                return false;
            }
        },
        getVariants() {
            let newArr = [];
            for (let i of this.ballot.options) {
                if (this.onlyNumbers(i.value) > 0) {
                    newArr.push(i);
                }
            }
            return newArr;
        },
        isUserRegisteredInTreasury() {
            if (!this.ballot) return false;
            return this.userTreasury.some(t => t.liquid.split(' ')[1] === this.ballot.treasury.supply.split(' ')[1]);
        },
        isOfficialSymbol() {
            return supplyToSymbol(this.ballot.treasury_symbol) === 'VOTE';
        },
        votingPowerComesFrom() {
            let voteliquid = this.ballot.settings.some(op => op.key === 'voteliquid' && op.value > 0);
            let votestake = this.ballot.settings.some(op => op.key === 'votestake' && op.value > 0);
            if (voteliquid && votestake) {
                return FROM_BOTH;
            } else if (voteliquid) {
                return FROM_LIQUID;
            } else if (votestake) {
                return FROM_STAKE;
            } else {
                return null;
            }
        },
        isPositiveVotePower() {
            let symbol = supplyToSymbol(this.ballot.treasury_symbol);
            let power = 0;
            if (this.isOfficialSymbol) {
                if (!this.accountData) return false;
                if (!this.accountData.self_delegated_bandwidth) return false;

                let cpu_weight = this.accountData.self_delegated_bandwidth.cpu_weight || '0.0000 TLOS';
                let net_weight = this.accountData.self_delegated_bandwidth.net_weight || '0.0000 TLOS';
                power = parseFloat(cpu_weight.split(' ')[0]) + parseFloat(net_weight.split(' ')[0]);
            } else {
                let userTreas = this.userTreasury.find(t => supplyToSymbol(t.liquid) === symbol);
                if (!userTreas) return false;

                let powerComes = this.votingPowerComesFrom;

                if (powerComes === FROM_BOTH || powerComes === FROM_LIQUID) {
                    let liquid = userTreas.liquid;
                    power += parseFloat(liquid.split(' ')[0]);
                }

                if (powerComes === FROM_BOTH || powerComes === FROM_STAKE) {
                    let staked = userTreas.staked;
                    power += parseFloat(staked.split(' ')[0]);
                }
            }

            return power > 0;
        },
        voteButtonText() {
            if (this.isPositiveVotePower) {
                if (this.isUserRegisteredInTreasury) {
                    return 'pages.trails.ballots.vote';
                } else {
                    if (this.ballot.treasury.access === 'public') {
                        return 'pages.trails.ballots.joinAndVote';
                    } else {
                        return 'pages.trails.ballots.joinDAO';
                    }
                }
            } else {
                if (this.isOfficialSymbol) {
                    return 'pages.trails.ballots.stakeBeforeVoting';
                } else {
                    return 'pages.trails.ballots.needPositiveVote';
                }
            }
        },
    },
    watch: {
        account: async function (account) {
            this.fetchTreasuriesForUser(account);
        },
    },
    methods: {
        ...mapActions('trails', [
            'fetchBallot',
            'castVote',
            'cancelBallot',
            'fetchVotesForBallot',
            'fetchUserVotesForThisBallot',
            'fetchTreasuriesForUser',
            'resetUserVotes'
        ]),
        optionCheckboxClass(ballot, option) {
            return this.displayWinner(ballot) ?
                this.displayWinner(ballot) === option.key ? 'visible-checkbox' : '' : '';
        },
        optionItemClass(ballot, option) {
            return this.displayWinner(ballot) ?
                this.displayWinner(ballot) === option.key ? 'option-winner' : '' : 'option-clear';
        },
        debug() {
            console.log(this.ballot);
        },
        onBallotOpenedForVoting() {
            this.openBallotDialog = false;
            this.fetchBallot(this.ballot.ballot_name);
        },
        async showOpenBallotDialog() {
            this.openBallotDialog = true;
        },
        openUrl(url) {
            window.open(`${process.env.BLOCKCHAIN_EXPLORER}/account/${url}`);
        },
        getPercentofTotal(option) {
            const total =
        (Number(option.value.split(' ')[0]) /
          Number(this.ballot.total_raw_weight.split(' ')[0])) *
        100;
            return Number.isInteger(total) ? total : +total.toFixed(2);
        },
        async onCastVote({ options, option, ballotName, register }) {
            this.voting = true;
            await this.castVote({
                register,
                ballotName,
                options: options || [option],
            });
            this.voting = false;
        },
        showAlert(message) {
            this.$q.notify({
                icon: 'warning',
                message: this.$t(message),
                color: 'warning',
            });
        },
        showNotification() {
            this.$q.notify({
                icon: this.notifications[0].icon,
                message:
          this.notifications[0].status === 'success'
              ? this.$t('notifications.trails.successSigning')
              : this.$t('notifications.trails.errorSigning'),
                color:
          this.notifications[0].status === 'success' ? 'positive' : 'negative',
            });
        },
        async showVoters() {
            await this.fetchVotesForBallot({ name: this.ballot.ballot_name, limit: this.ballot.total_voters });
            this.voters.length > 0
                ? (this.showDetails = true)
                : (this.showDetails = false);
        },
        getVoters(variant) {
            let newArr = [];
            const voter = JSON.stringify(this.voters);
            for (let i of JSON.parse(voter)) {
                for (let j of i.weighted_votes) {
                    if (j.key === variant) {
                        i.value = j.value;
                        newArr.push(i);
                    }
                }
            }
            return newArr;
        },
        async getLoggedUserVotes(ballot_name) {
            await this.fetchUserVotesForThisBallot(ballot_name);
            if (!this.userVotes) return;
            if (!this.userVotes[ballot_name]) return;
            let votes = this.userVotes[ballot_name].weighted_votes.map(v => v.key);
            this.votes = this.votes.concat(votes);
        },
        async vote() {
            let register = false;

            if (this.isPositiveVotePower) {
                if (this.isUserRegisteredInTreasury) {
                    register = false;
                } else {
                    if (this.ballot.treasury.access === 'public') {
                        register = true;
                    } else {
                    // redirect to treasuties page with filter
                        this.$router.push({
                            path: '/trails/treasuries',
                            query: { treasury: this.ballot.treasury.supply.split(' ')[1] },
                        });
                        return; // Do not Cast Vote
                    }
                }
            } else {
                if (this.isOfficialSymbol) {
                    this.showAlert('pages.trails.ballots.stakeBeforeVotingLong');
                } else {
                    this.showAlert('pages.trails.ballots.needPositiveVoteLong.' + this.votingPowerComesFrom );
                }
                return;
            }

            await this.onCastVote({
                register,
                options: this.votes,
                ballotName: this.ballot.ballot_name,
            });
            await this.fetchBallot(this.$route.params.id);
            await this.resetUserVotes();

            this.showNotification();
        },
        async cancel() {
            await this.cancelBallot(this.ballot);
            this.showNotification();
        },
        nextSlide() {
            if (this.optionData.length - 1 > this.defaultSlide) {
                this.defaultSlide++;
            }
        },
        prevSlide() {
            if (this.defaultSlide > 0) {
                this.defaultSlide--;
            }
        },
        updatePopupScroll(e) {
            this.scrollPosition = e.target.scrollTop;
        },
        getPartOfTotalPercent(option) {
            return this.trunc(this.getPartOfTotal(option) * 100, 2);
        },
        getPartOfTotal(option) {
            if (option) {
                return !isNaN(this.getPercentofTotal(option))
                    ? this.getPercentofTotal(option) / 100
                    : 0;
            }
        },
        openNotice() {
            this.notice = true;
        },

        toggleOption(key) {
            if (this.ballot.max_options === 1) {
                this.votes = this.votes.includes(key) ? [key] : [];
            }
            this.userCanVote = this.votes.length > 0;
        },
        findLinks(text) {
            const urlRegex =
        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
            return text.replace(urlRegex, (url) => `<a href="${url}">${url}</a>`);
        },
        getRequestAmountRounded(requestAmount) {
            const amountArr = requestAmount.split(' ');
            const amount = parseInt(amountArr[0]);
            const tokenSymbol = amountArr[1];

            return `${amount} ${tokenSymbol}`;
        },
    },
};
</script>

<template lang="pug">
.row.bg-white.justify-between.popup-wrapper(@scroll="updatePopupScroll" @click="debug")
        ballot-open-voting-dialog(
            :show.sync="openBallotDialog"
            :ballot="ballot"
            @close="openBallotDialog = false"
            @done="onBallotOpenedForVoting")
        template(v-if="!loading && ballot")
            .col-xs.col-sm-auto.popup-left-col-wrapper(style="min-width: 268px;" v-if="showDetails")
                q-card(
                :class="ballot.status === 'voting' && isBallotOpened(ballot) ? '' : 'view-poll-ended'"
                id="ballot-card"
                flat
                square
                )
                    q-card-section.header-nav
                        div(@click="showDetails = false")
                            img.poll-icon(src="statics/app-icons/back.svg")
                            span Go Back
                    q-card-section.body-info
                        div(v-for="option in getVariants")
                            div.text-weight-bold.variant-name {{ option.displayText }}
                            div.list-voters(v-for="(i, idx) in getVoters(option.key)" :key="idx")
                                span {{ i.voter }}
                                span.text-weight-bold {{ getPercentOfNumber(i.value, option.value) }}
            .col-xs.col-sm-auto(style="min-width: 240px;" v-else).popup-left-col-wrapper
                q-card.popup-left-col.poll-item(
                :class="ballot.status === 'voting' && isBallotOpened(ballot) ? '' : 'view-poll-ended'"
                id="ballot-card"
                flat
                square
                bordered
                )
                    q-card-section.card-img-section
                        div.card-img-wrapper
                            template(v-if="ballot.imageUrl")
                                q-img(:src="ballot.imageUrl").poll-item-image-wrapper
                                    template(v-slot:error)
                                        q-icon(size="lg" name="far fa-image")
                            template(v-else)
                                template(v-if="isBallotOpened(ballot) && ballot.status === 'voting'")
                                    img.bgr-icon1(
                                        :src="`statics/app-icons/${ballot.category.toLowerCase()}-bgr-icon1.png`"
                                    )
                                    img.bgr-icon2(
                                        :src="`statics/app-icons/${ballot.category.toLowerCase()}-bgr-icon2.png`"
                                    )
                                template(v-else)
                                    img(:src="`statics/app-icons/inactive-bgr-icon1.png`").bgr-icon1
                                    img(:src="`statics/app-icons/inactive-bgr-icon2.png`").bgr-icon2
                            div.column.items-start.absolute-top-left
                                ballot-chip(:type="ballot.category", :isBallotOpened="isBallotOpened(ballot)")
                                ballot-chip(:type="'voted'",
                                    :isBallotOpened="isBallotOpened(ballot)",
                                    :class="userVotes[ballot.ballot_name] ? '' : 'hidden'")
                            ballot-status(
                            :ballot="ballot"
                            :isBallotOpened="isBallotOpened(ballot)"
                            :getEndTime="getEndTime(ballot)"
                            :startTimeHasPassed="startTimeHasPassed(ballot)"
                            :getStartTime="getStartTime(ballot)"
                            )

                        q-list(dense).options-list.list-620
                            div.options-wrapper
                                q-item.ballot-view-option(
                                v-for="option in ballot.options"
                                :key="option.key"
                                :class="optionItemClass(ballot, option)"
                                ).no-padding.capitalize.column
                                    div.row.option-item
                                        q-item-section()
                                            q-checkbox(
                                            size="sm"
                                            v-model="votes"
                                            :disable="ballot.status !== 'cancelled' && !isBallotOpened"
                                            keep-color
                                            :class="optionCheckboxClass(ballot, option)"
                                            :color="isBallotOpened(ballot)?'primary':'grey-8'"
                                            :val="option.key"
                                            @click.native="toggleOption(option.key)"
                                            )
                                                div.checkbox-text.row.space-between
                                                    div {{ option.displayText }}
                                                    div(v-if="getPartOfTotal(option)")
                                                        | {{ getPartOfTotalPercent(option) }}%&nbsp
                                    div.linear-progress(v-if="displayWinner(ballot)")
                                        q-linear-progress(
                                            rounded size="6px" :value="getPartOfTotal(option)" color="$primary"
                                        )
                            q-item(v-if="ballot.status !== 'cancelled' && isBallotOpened(ballot)").options-btn
                                q-btn(
                                    no-caps
                                    :color="userCanVote ? 'primary' : 'info'"
                                    class="col"
                                    v-if="isAuthenticated"
                                    :disable="!userCanVote"
                                    :label="$t(voteButtonText)"
                                    @click="vote()"
                                )
                                q-btn(
                                    no-caps
                                    outline
                                    color="primary"
                                    class="col"
                                    v-if="isAuthenticated && ballot.publisher === account"
                                    :label="$t('common.buttons.cancel')"
                                    @click="cancel()"
                                )
                            q-item(v-if="ballot.status === 'setup' && !isBallotOpened(ballot)").options-btn
                                q-btn(
                                    no-caps
                                    outline
                                    disable
                                    color="primary"
                                    class="col"
                                    v-if="!isAuthenticated || ballot.publisher != account"
                                    :label="$t('pages.trails.ballots.notOpened')"
                                    @click="showOpenBallotDialog()"
                                )
                                q-btn(
                                    no-caps
                                    outline
                                    color="primary"
                                    class="col"
                                    v-if="isAuthenticated && ballot.publisher === account"
                                    :label="$t('pages.trails.ballots.openBallotHeader')"
                                    @click="showOpenBallotDialog()"
                                )
                    q-card-section().q-pb-none.cursor-pointer.statics-section.statics-section-620
                        div.text-section.column
                            div(v-if="ballot.total_voters > 0")
                                span.statistics-title Most voted
                        div.statistics-body(v-if="getWinner.displayText")
                            span.text-weight-bold  {{ getWinner.displayText }}
                            span.text-weight-bold {{ getPercentofTotal(getWinner) }}%&nbsp
                        div(v-if="ballot.total_voters > 0")
                            span.statistics-title Number of accounts
                            div.statistics-body(@click="showVoters()")
                                span.text-weight-bold  {{ ballot.total_voters }}
                                div.poll-icon.details
                        div.statics-section-item(v-else)
                            span  {{ getWinner }}
                        div
                            span.statistics-title Number of tokens
                        div.statistics-body
                            span.text-weight-bold {{ onlyNumbers(ballot.total_raw_weight) }}&nbsp
                            span.text-weight-bold {{ ballot.total_raw_weight.split(" ")[1]  }}&nbsp
                        div(v-if="ballot.proposal_info")
                            span.statistics-title Request amount
                        div.statistics-body(v-if="ballot.proposal_info")
                            span.text-weight-bold
                                | {{ getRequestAmountRounded(ballot.proposal_info.total_requested) }}&nbsp
            .col-xs-12.col-sm.popup-right-col-wrapper
                q-card(
                flat
                square
                ).popup-right-col
                    q-card-section.description-section-title
                        q-btn(icon="close" flat v-close-popup).absolute-top-right.gt-xs.close-popup-btn
                        div.text-section.row.ballot-card-title-wrapper
                            span.ballot-card-title {{ ballot.title || "Untitled Ballot" }}
                        div.ballot-card-sub-title-wrapper.row
                            template(
                                v-if="ballot.treasury.icon && ballot.treasury.icon !== 'null'")
                                div.sub-title-card-img-wrapper
                                    q-img(:src="ballot.treasury.icon")
                                div
                                    div
                                        span.opacity04 By&nbsp
                                        a(@click="openUrl(ballot.publisher)").link.cursor-pointer {{ ballot.publisher }}
                                    div.sub-title-group-wrapper
                                        span.opacity04 in&nbsp
                                        span.opacity06 {{ ballot.treasury.title || "No treasury" }}
                            template(v-else)
                                span.opacity04 By&nbsp
                                a(@click="openUrl(ballot.publisher)").link.cursor-pointer  {{ ballot.publisher }}
                                span.opacity04 &nbspin&nbsp
                                span.opacity06 {{ ballot.treasury.title || "No treasury" }}
                        q-btn(icon="close" flat v-close-popup).absolute-top-right.lt-sm
                    q-separator.popup-separator
                    q-card-section.description-section-wrapper
                        div.description-section
                            div.description-section-title(:class="iframeUrl ? `q-pb-md` : `q-pb-xl q-mb-lg`")
                                p(v-html="ballot.readableDescription")
                            div(
                            v-if="optionData && optionData[0] && optionData[0].hasOwnProperty('imageUrl')"
                            ).q-pb-md.ballot-content-carousel
                                q-carousel(
                                swipeable
                                animated
                                v-model="defaultSlide"
                                infinite
                                ref="carousel"
                                )
                                    q-carousel-slide(
                                    v-for="(slide, index) in optionData"
                                    :key="index"
                                    :name="index"
                                    :img-src="slide.imageUrl"
                                    )
                                        div.absolute-bottom.custom-caption(v-if="slide.displayText")
                                            div.caption-text {{ slide.displayText }}
                                    template(v-slot:control)
                                        q-carousel-control(
                                        position="bottom-left"
                                        :offset="[18, 18]"
                                        class="q-gutter-md"
                                        )
                                            q-btn.round-btn(
                                            color="white"
                                            text-color="black"
                                            icon="fas fa-chevron-left"
                                            @click="prevSlide()"
                                            )
                                            q-btn.round-btn(
                                            color="white"
                                            text-color="black"
                                            icon="fas fa-chevron-right"
                                            @click="nextSlide()"
                                            )
                            iframe(
                            height="100%"
                            width="100%"
                            v-if="ballot.iframeUrl"
                            :src="ballot.iframeUrl"
                            ).kv-preview-data.file-preview-pdf.file-zoom-detail.shadow-1
                            div(v-else).text-center
                                img(src="/statics/app-icons/no-pdf.svg" style="width: 60px;")
                                p(style="color: #a1c1ff").text-caption No PDF found
                            q-list(dense).options-list.list-320
                                div.options-wrapper
                                    q-item.ballot-view-option(
                                    v-for="option in ballot.options"
                                    :key="option.key"
                                    :class="optionItemClass(ballot, option)"
                                    ).no-padding.capitalize.column
                                        div.row.option-item
                                            q-item-section()
                                                q-checkbox(
                                                size="sm"
                                                v-model="votes"
                                                :disable="ballot.status !== 'cancelled' && !isBallotOpened"
                                                keep-color
                                                :class="optionCheckboxClass(ballot, option)"
                                                :color="isBallotOpened(ballot)?'primary':'grey-8'"
                                                :val="option.key"
                                                @click.native="toggleOption(option.key)"
                                                )
                                                    div.checkbox-text.row.space-between
                                                        div {{ option.displayText }}
                                                        div(v-if="getPartOfTotal(option)")
                                                            | {{ getPartOfTotalPercent(option) }}%&nbsp
                                        div.linear-progress(v-if="displayWinner(ballot)")
                                            q-linear-progress(
                                                rounded size="6px" :value="getPartOfTotal(option)" color="$primary")
                                q-item(
                                    v-if="ballot.status !== 'cancelled' && isBallotOpened(ballot)").column.options-btn
                                    q-btn(
                                        no-caps
                                        :color="userCanVote ? 'primary' : 'info'"
                                        v-if="isAuthenticated"
                                        :disable="!userCanVote"
                                        :label="$t(voteButtonText)"
                                        @click="isAuthenticated ? vote() : openNotice()"
                                    )
                                    q-btn(
                                        no-caps
                                        outline
                                        color="primary"
                                        v-if="isAuthenticated && ballot.publisher === account"
                                        :label="$t('common.buttons.cancel')"
                                        @click="cancel()"
                                    )
                            q-card-section().q-pb-none.cursor-pointer.statics-section.statics-section-320
                                div.text-section.column
                                    div.statics-section-item(v-if="ballot.total_voters > 0")
                                        span.text-weight-bold {{ getPercentofTotal(getWinner) }}%&nbsp
                                        span.opacity06
                                            | {{ getWinner.displayText }} lead over
                                            | {{ getLoser.displayText ? ` ${getLoser.displayText}` : ` others` }}
                                    div.statics-section-item(v-else)
                                        span  {{ getWinner }}
                                    div.statics-section-item
                                        span.text-weight-bold
                                            | {{ `${ballot.total_voters} Accounts` }}
                                        span.opacity06 &nbspvoted
                                    div.statics-section-item
                                        span.text-weight-bold
                                            | {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }}&nbsp
                                        span.opacity06 {{ ballot.total_raw_weight.split(' ')[1]  }}&nbsp
                                        span.opacity06 tokens
                                    div.statics-section-item(v-if="ballot.proposal_info")
                                        span.text-weight-bold
                                            | {{ getRequestAmountRounded(ballot.proposal_info.total_requested) }}&nbsp
                                        span.opacity06 {{ $t('pages.trails.ballots.requestAmount') }}
                div.back-btn.row(v-close-popup :class="{scrolled: scrollPosition > 50}")
                    q-icon(name="fas fa-chevron-left")
                    div Go back
            q-dialog(v-model="notice")
                q-card.notice
                    q-card-section.row.no-wrap
                        div You have to be logged in to vote. If you don't have account please register
                            q-btn(
                                flat size="14px" color="primary" label="here" to="/accounts/add" no-caps).register-link
                    q-card-actions(align="right" class="bg-white")
                        q-btn(flat label="OK" v-close-popup)
        q-inner-loading(v-else)
            q-spinner(size="3em")
</template>
<style lang="sass">

$shadow-1: 0px 20px 48px rgba(0, 9, 26, 0.08)
$shadow-2: 0px 7px 15px rgba(0, 9, 26, 0.05)
$shadow-3: 0px 3px 6px rgba(0, 9, 26, 0.04)
$shadow-4: 0px 1px 2.25px rgba(0, 9, 26, 0.0383252)

.body-info
   overflow: scroll
   overflow-x: hidden
   height: 550px

.variant-name
    margin-top: 24px
    margin-bottom: 8px

.statistics-title
    font-weight: 300
    font-size: 12px
    line-height: 14px
    color: rgba(0, 0, 0, 0.5)

.statistics-body
    display: flex
    font-size: 16px
    line-height: 19px
    justify-content: space-between
    margin-bottom: 8px

.details
    background: url("../../../../statics/app-icons/back.svg")
    background-repeat: no-repeat
    height: 15px
    width: 9px
    rotate: 180deg
    &:hover
        background: url("../../../../statics/app-icons/back-active.svg")
        background-repeat: no-repeat
        height: 15px
        width: 9px
        rotate: 0deg

.header-nav
    cursor: pointer
    padding: 23px 19px 0
    span
        margin-left: 7px
        font-size: 12px
        position: relative
        bottom: 3px

.list-voters
    width: 100%
    display: flex
    justify-content: space-between
    margin-bottom: 5px

embed
    width: 90%
    height: 100%
    min-height: 480px

.open-sans
    font-family: open sans, arial, sans-serif

.link
    color: $primary

.ballot-status
    right: 0
    top: 0

.winner
    color: green
    font-size: 15px
    font-weight: 600

.dashed-bottom
    border-bottom: 1px dashed rgba(0, 0, 0, 0.12)

.card-img-section
    padding: 0

.popup-wrapper
    max-height: unset !important
    max-width: unset !important
    width: calc(100vw - 100px)
    height: calc(100vh - 100px)
    box-shadow: $shadow-1, $shadow-2, $shadow-3, $shadow-4 !important
    border-radius: 12px !important
    overflow: hidden !important
    & .poll-item
        border: none
    & .ballot-card-title-wrapper
        height: auto
    & .bgr-icon1
        top: -2px
        right: 70px
    & .bgr-icon2
        top: 74px
        right: 15px
    & .card-img-wrapper
        overflow: visible
    & .absolute-top-left
        top: -6px
        left: -12px
    & .left-tag
        top: 90px
        left: -12px

.popup-right-col-wrapper
    border-left: 1px solid #F2F3F4
    display: flex

.popup-left-col
    width: 268px
    & .card-img-wrapper
        margin: 12px
        padding: 16px
        height: 176px
        width: 244px

.description-section-wrapper
    flex-grow: 1
    display: flex
    flex-direction: column
    overflow: auto
    scrollbar-color: #caccce #EFEFF0
    scrollbar-width: thin
    &::-webkit-scrollbar
        width: 6px
        background-color: #EFEFF0
    &::-webkit-scrollbar-thumb
        background-color: #caccce
        border-radius: 5px

.description-section
    flex-grow: 1
    display: flex
    flex-direction: column

.popup-right-col
    flex-grow: 1
    max-width: unset
    display: flex
    flex-direction: column

.popup-separator
    background: #F2F3F4

.options-list
    padding: 0 24px

.options-wrapper
    max-height: 200px !important
    overflow: auto
    scrollbar-color: #caccce #EFEFF0
    scrollbar-width: thin
    &::-webkit-scrollbar
        width: 6px
        background-color: #EFEFF0
    &::-webkit-scrollbar-thumb
        background-color: #caccce
        border-radius: 5px

.popup-wrapper .statics-section .text-section
    width: 220px
    & .statics-section-item
        width: 220px
        & > span
            line-height: 130%

.options-btn
    gap: 10px
    width: 100%
    padding: 0 !important
    margin: 6px 0 0

.round-btn
    width: 48px
    height: 48px
    border-radius: 50%
    font-size: 10px

.ballot-content-carousel
    border-radius: 12px
    & > div
        border-radius: 12px

.custom-caption
    width: 100%
    display: flex
    justify-content: flex-end
    text-align: right
    padding: 24px
    color: white
    background-color: rgba(0, 0, 0, .3)
    & > .caption-text
        max-width: 300px
        font-size: 24px

.back-btn
    position: fixed
    top: 0
    left: 0
    display: none
    align-items: center
    height: 70px
    width: 100%
    padding-left: 24px
    cursor: pointer
    background: #FFF
    z-index: 10
    & > div
        margin-left: 10px
        font-size: 16px

.scrolled
    box-shadow: $shadow-1, $shadow-2, $shadow-3, $shadow-4


.list-320,
.statics-section-320
    display: none

.ballot-view-option
    max-width: 220px
    height: 55px
    overflow: hidden
    flex-wrap: nowrap
    border: 2px solid #F2F3F4
    border-radius: 8px
    margin: 8px 0
    &.option-winner
        border: none
        background: #F4F7FF
    & .option-item
        width: 100%
        padding: 6px 12px 0 12px
        & > div
            width: 100%
            & > div
                width: 100%
                & > .q-checkbox__label
                    width: 100%
                    & > .checkbox-text
                        width: 100%
                        justify-content: space-between
    & .linear-progress
        padding: 0 12px 10px 12px
    &:hover
        border: none
        background: #FFFFFF
        box-shadow: 0px 7px 15px rgba(21, 0, 77, 0.05), 0px 3px 6px rgba(21, 0, 77, 0.04)

.invisible-checkbox .q-checkbox__inner
    display: none

.invisible-checkbox .checkbox-text
    margin: 0 0 4px 4px

.checkbox-text
    flex-wrap: nowrap
    max-width: 220px
    font-size: 16px
    font-weight: 600
    line-height: 24px

.option-clear > .option-item
    padding: 6px 12px 0 12px

.notice
    border-radius: 12px !important

.register-link > .q-btn__wrapper
    padding: 0 6px

.sub-title-card-img-wrapper
    margin-right: 8px
    width: 50px
    height: 50px
    border-radius: 6px
    overflow: hidden

.sub-title-group-wrapper
    margin-top: 6px

@media screen and (max-width: 1200px), screen and (max-height: 640px)
    .q-dialog__inner
        overflow-y: auto
    .no-pointer-events
        pointer-events: auto !important

@media (max-width: 1000px)
    .custom-caption
        & > .caption-text
            max-width: 230px
            font-size: 18px

@media (max-width: 768px)
    .back-btn
        display: flex
    .popup-wrapper
        position: relative
        padding-top: 70px
        position: fixed
        overflow-y: auto !important
        top: 0
        right: 0
        bottom: 0
        left: 0
        height: 100vh
        width: 100vw
        border-radius: 0
    .close-popup-btn,
    .popup-separator
        display: none
    @media (max-width: 620px)
        .popup-wrapper
            & > .popup-left-col-wrapper,
            & > .popup-right-col-wrapper
                width: 100%
                display: flex
                justify-content: center
            & > .popup-right-col-wrapper
                flex: auto !important
        .description-section-wrapper
            padding: 0
        .ballot-content-carousel
            border-radius: 0
            & > div
                border-radius: 0
        .description-section-title
            padding: 12px
        .card-img-section,
        .popup-left-col,
        .statics-section .text-section,
        .statics-section-item
            width: 100%
        .popup-left-col .card-img-wrapper
            width: auto
        .options-list
            display: flex
            flex-direction: column
            align-items: center
            padding: 0 12px
        .list-320,
        .statics-section-320
            display: flex
        .statics-section-320
            padding-top: 24px
        .list-620,
        .statics-section-620,
        .popup-right-col > .q-card__section > .q-btn-item
            display: none
        .custom-caption > .caption-text
            font-size: 16px
        .options-wrapper
            max-height: none !important
            overflow: visible
        .ballot-view-option,
        .options-wrapper
            width: 100%
        .ballot-view-option,
        .checkbox-text
            max-width: none
    @media (max-width: 400px)
        .custom-caption > .caption-text
            max-width: 150px
</style>