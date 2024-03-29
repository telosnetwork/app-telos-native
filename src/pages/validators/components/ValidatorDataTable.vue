<template lang="pug">
.q-pa-md
  .row.items-start.q-gutter-md(v-if='account')
    q-card( v-for='(prod,i) in currentVote').producer-card
      .q-card-section {{ prod }}
          q-icon(
            name="fas fa-times"
            size="xs"
            color='primary'
            @click='removeVote(prod)'
          )
  q-card.voting-stats(v-if='account')
    .count-field Selected Validators:
      span( :class="{'full-selection' : maxSelected }") {{ currentVote.length }} of 30
    .count-field Projected Vote Weight:
      span( :class="{'full-selection' : maxSelected }")  {{ projectedVoteWeight }}
    .count-field Last Vote Weight:
      span  {{ lastWeight }}
    .count-field Vote Weight Change:
      span  {{ weightChange }}
  q-table(
    :title= 'tableHeader'
    :pagination.sync="pagination"
    :rows="producerData"
    :columns="producerColumns"
    row-key="__index"
  )
    template(
      v-slot:top-right
      class='testnet-indicator'
    )
      | * = testnet, LPB = lifetime produced blocks, LMB = lifetime missed blocks
    template( v-slot:body="props")
      q-tr( slot="body" slot-scope="props" :props="props")
        q-td( key="selected" v-if='account')
          q-checkbox(  v-model='currentVote' :val='props.cols[2].value' )
        q-td( key="number" class='vote-indicator') {{props.cols[1].value}}
        q-td( key="owner" ) {{props.cols[2].value }}
        q-td( key="country" ).flag-column
          span(:class='getFlag(props.cols[3].value)').flag-icon
        q-td(v-if='props.cols[4].value' key="social" align="center").no-decoration
          a(v-if="props.cols[4].value.website" :href="props.cols[4].value.website")
            q-icon(
              name="fas fa-globe"
              size="xs"
              color='primary'
            )
          a(v-if="props.cols[4].value.social.twitter" :href="getLink('twitter.com',props.cols[4].value.social.twitter)")
            q-icon(
              name="fab fa-twitter"
              size="xs"
              color='primary'
            )
          a(v-if="props.cols[4].value.social.github" :href="getLink('github.com',props.cols[4].value.social.github)")
            q-icon(
              name="fab fa-github"
              size="xs"
              color='primary'
            )
          a(v-if="props.cols[4].value.social.telegram" :href="getLink('t.me',props.cols[4].value.social.telegram)")
            q-icon(
              name="fab fa-telegram"
              size="xs"
              color='primary'
            )
        q-td(v-else key="social-none")
        q-td( key="votes" align="right") {{props.cols[5].value }}
        q-td( key="sslVerified" align='left')
          q-icon(
            v-if="props.cols[6].value === true"
            name="fas fa-check"
            size="xs"
            color='green'
          )
          q-icon(
            v-else
            name="fas fa-times"
            size="xs"
            color='red'
          )
        q-td( key="apiVerified" align='left')
          q-icon(
            v-if="props.cols[7].value === true"
            name="fas fa-check"
            size="xs"
            color='green'
          )
          q-icon(
            v-else
            name="fas fa-times"
            size="xs"
            color='red'
          )
        q-td( key="sslVerifiedTestNet" align='left')
          q-icon(
            v-if="props.cols[8].value === true"
            name="fas fa-check"
            size="xs"
            color='green'
          )
          q-icon(
            v-else
            name="fas fa-times"
            size="xs"
            color='red'
          )
        q-td( key="apiVerifiedTestNet" align='left')
          q-icon(
            v-if="props.cols[9].value === true"
            name="fas fa-check"
            size="xs"
            color='green'
          )
          q-icon(
            v-else
            name="fas fa-times"
            size="xs"
            color='red'
          )
        q-td( key="lifetimeProducedBlocks" align='right' ) {{props.cols[10].value }}
        q-td( key="lifetimeMissedBlocks" align='right') {{props.cols[11].value }}
        q-td( key='missedBlocksPer' align='left') {{props.cols[12].value }}
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

const MAX_VOTE_PRODUCERS = 30;

export default {
    name: 'ValidatorDataTable',
    props: {
        producerVotes: { type: Array, required: true },
        producerData: { type: Array, required: true },
        lastWeight: { type: String, required: true },
        lastStaked: { type: Number, required: true },
        stakedAmount: { type: Number, required: true },
        lastUpdated: { type: String, required: true },
    },
    data() {
        return {
            currentVote: [],
            pagination: {
                rowsPerPage: 21,
            },
            producerColumns: [
                {
                    name: 'selected',
                    label: '',
                    align: 'left',
                    sortable: false,
                    headerClasses: 'selected-column',
                },
                {
                    name: 'number',
                    label: '#',
                    field: (row) => this.producerData.indexOf(row) + 1,
                    align: 'left',
                    sortable: true,
                },
                {
                    name: 'owner',
                    label: 'Block Producer',
                    field: 'owner',
                    align: 'left',
                    sortable: true,
                },
                {
                    name: 'country',
                    label: 'Country',
                    field: (row) => row.org?.location?.country,
                    align: 'center',
                    sortable: true,
                },
                {
                    name: 'social',
                    label: 'Links',
                    field: (row) => row.org,
                    align: 'center',
                },
                {
                    name: 'votes',
                    label: 'Total Votes',
                    field: (row) => (row.total_votes / 10000).toFixed(0),
                    align: 'right',
                    sortable: true,
                    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
                },
                {
                    name: 'sslVerified',
                    label: 'SSL',
                    field: (row) => row.sslVerified === true,
                    align: 'left',
                    sortable: true,
                },
                {
                    name: 'apiVerified',
                    label: 'API',
                    field: (row) => row.apiVerified === true,
                    align: 'left',
                    sortable: true,
                },
                {
                    name: 'sslVerifiedTestNet',
                    label: 'SSL*',
                    field: (row) => row.sslVerifiedTestNet === true,
                    align: 'left',
                    sortable: true,
                },
                {
                    name: 'apiVerifiedTestNet',
                    label: 'API*',
                    field: (row) => row.apiVerifiedTestNet === true,
                    align: 'left',
                    sortable: true,
                },
                {
                    name: 'lifetimeProducedBlocks',
                    label: 'LPB',
                    field: 'lifetime_produced_blocks',
                    align: 'center',
                    sortable: true,
                    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
                },
                {
                    name: 'lifetimeMissedBlocks',
                    label: 'LMB',
                    field: 'lifetime_missed_blocks',
                    align: 'center',
                    sortable: true,
                    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
                },
                {
                    name: 'missedBlocksPer',
                    label: 'LMB(%)',
                    field: (row) =>
                        row.lifetime_produced_blocks === 0
                            ? row.lifetime_missed_blocks === 0
                                ? 'N/A'
                                : 100
                            : (
                                parseFloat(
                                    row.lifetime_missed_blocks / row.lifetime_produced_blocks
                                ) * 100
                            ).toFixed(3),
                    align: 'left',
                    sortable: true,
                    sort: (a, b) => parseFloat(a, 10) - parseFloat(b, 10),
                },
            ],
        };
    },
    watch: {
        producerVotes(val) {
            this.$emit('vote-changed', false);
            if (this.currentVote.length === 0) {
                this.currentVote = [...val];
            }
        },
        currentVote(val) {
            if (val.length > MAX_VOTE_PRODUCERS) {
                this.currentVote.pop();
                alert('You can only vote for 30 validators.');
                return;
            }
            if (this.areEqualArrays(val, this.producerVotes)) {
                this.$emit('vote-changed', false);
            } else {
                this.$emit('vote-changed', true);
            }
        },
        account() {
            this.checkHeader();
        },
    },
    mounted() {
        this.checkHeader();
        this.resetVotes();
    },
    computed: {
        ...mapGetters('accounts', ['account']),
        tableHeader() {
            const localTime = moment
                .utc(this.lastUpdated)
                .local()
                .format('YYYY-MM-DD HH:mm');
            return `Mainnet Validators (${localTime})`;
        },
        maxSelected() {
            return this.currentVote.length === MAX_VOTE_PRODUCERS;
        },
        projectedVoteWeight() {
            if (this.currentVote.length === 0) {
                return 0;
            }
            const percentVoted = this.currentVote.length / MAX_VOTE_PRODUCERS;
            const voteWeight =
        (Math.sin(Math.PI * percentVoted - Math.PI / 2.0) + 1) / 2.0;
            return parseFloat(voteWeight * this.stakedAmount).toFixed(2);
        },
        weightChange() {
            const difference = (this.projectedVoteWeight - this.lastWeight).toFixed(
                2
            );
            const symbol = difference > 0 ? '+' : '';
            const percentage =
        this.lastWeight > 0.001
            ? ((this.projectedVoteWeight / this.lastWeight) * 100).toFixed(2)
            : (this.projectedVoteWeight * 100).toFixed(2);

            return `${symbol}${difference} (${percentage}%)`;
        },
    },
    methods: {
        removeVote(index) {
            this.currentVote.splice(index, 1);
        },
        getLink(domain, username) {
            return `https://${domain}/${username}`;
        },
        getFlag(alpha2) {
            if (alpha2) {
                return `flag-icon-${alpha2.toLowerCase()}`;
            }
            return '';
        },
        checkHeader() {
            const checkHeader = document.getElementsByClassName('selected-column')[0];
            checkHeader.style.height = '48px';
            if (!this.account) {
                checkHeader.style.display = 'none';
            } else {
                checkHeader.style.display = 'block';
            }
        },
        areEqualArrays(firstArray, secondArray) {
            if (
                !Array.isArray(firstArray) ||
        !Array.isArray(secondArray) ||
        firstArray.length !== secondArray.length
            ) {
                return false;
            }
            var tempFirstArray = firstArray.concat().sort();
            var tempSecondArray = secondArray.concat().sort();
            for (var i = 0; i < tempFirstArray.length; i++) {
                if (tempFirstArray[i] !== tempSecondArray[i]) {
                    return false;
                }
            }
            return true;
        },
        resetVotes() {
            this.currentVote = [...this.producerVotes];
        },
        async sendVoteTransaction() {
            this.currentVote.sort();
            const voteActions = [
                {
                    account: 'eosio',
                    name: 'voteproducer',
                    data: {
                        voter: this.account,
                        proxy: '',
                        producers: [...this.currentVote],
                    },
                },
            ];
            try {
                await this.$store.$api.signTransaction(voteActions);
                this.$emit('get-votes');
            } catch (e) {
                console.error(e);
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import url("../../../../node_modules/flag-icon-css/sass/flag-icons.scss");

.testnet-indicator {
  font-size: 12px;
  margin-right: 0.5rem;
}
.flag-column {
  text-align: center;
}
.producer-card {
  padding: 0.2rem 0.2rem 0.2rem 0.5rem;
  height: 2rem;
  line-height: 1.6rem;
  i {
    cursor: pointer;
    padding-bottom: 0.4rem;
    padding-left: 0.2rem;
  }
}
.voting-stats {
  display: flex;
  justify-content: space-between;
  min-height: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  line-height: 2rem;
  padding-left: 1rem;
  span {
    margin-left: 0.25rem;
    &.full-selection {
      margin-left: 0.25rem;
      font-weight: 600;
    }
  }
}
.count-field {
  display: inline-block;
  margin-right: 2rem;
}
</style>
