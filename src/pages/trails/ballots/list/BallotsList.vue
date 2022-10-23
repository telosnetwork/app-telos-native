<script>
import { mapActions, mapGetters } from 'vuex';
import BallotForm from '~/pages/trails/ballots/components/BallotForm';
import BallotListItem from '~/pages/trails/ballots/components/BallotListItem';
import BallotView from '~/pages/trails/ballots/view/BallotView';
import WelcomeCard from '~/components/WelcomeCard';
import ActionBar from '~/components/ActionBar';

export default {
  name: 'BallotsList',
  components: {
    BallotForm,
    BallotListItem,
    BallotView,
    WelcomeCard,
    ActionBar,
  },
  props: {
    activeFilter: {
      type: String,
    },
  },
  data() {
    return {
      renderComponent: false,
      show: false,
      showBallot: false,
      statusChange: false,
      timeAtMount: undefined,
      openedBallot: {},
      voting: false,
      treasury: 'VOTE',
      statuses: [],
      categories: [],
      isBallotListRowDirection: true,
      sortMode: '',
      timerAction: null,
      loading: false,
    };
  },
  async mounted() {
    this.timeAtMount = Date.now();
    this.statusChange = false;
    if (this.$route.params.id) {
      this.showBallot = true;
    }
    if (this.$route.query && this.$route.query.treasury) {
      this.treasury = this.$route.query.treasury;
      this.$refs.actionBar
        ? this.$refs.actionBar.setTreasuryBar(this.treasury)
        : '';
    }
    await this.fetchFees();
    this.fetchUserVotes();
  },
  methods: {
    ...mapActions('trails', [
      'fetchFees',
      'fetchMoreBallots',
      'castVote',
      'fetchTreasuries',
      'fetchBallotsByStatus',
      'fetchUserVotesForThisBallot',
      'resetUserVotes',
    ]),
    async onLoad(_, done) {
      let isFirstFetch = this.ballots.length == 0;
      this.loading = true;
      await this.fetchMoreBallots();
      this.loading = false;
      setTimeout(() => {
        this.fetchUserVotes();
        done(isFirstFetch || !this.ballotsPagination.more);
      }, 1000);
    },
    async fetchUserVotes() {
      if (this.isAuthenticated) {
        this.filterBallots(this.ballots).forEach((b) =>
          this.fetchUserVotesForThisBallot(b.ballot_name)
        );
      } else {
        this.resetUserVotes();
      }
    },
    openBallotForm() {
      this.show = true;
    },
    closeBallot() {
      this.$router.go(-1);
    },
    openBallot(ballot) {
      this.timeAtMount = Date.now();
      this.$router.push(
        `/trails/${
          this.$route.path.indexOf('election') > 0 ? 'elections' : 'ballot'
        }/${ballot.ballot_name}/${this.timeAtMount}`
      );
      // the timestamp prevents scroll glitches on the infinite list
    },
    getLocalTime(isoDate) {
      const msOffset = new Date().getTimezoneOffset() * 60 * 1000;
      return new Date(isoDate).getTime() - msOffset;
    },
    isBallotOpened(ballot) {
      let endTime = this.getLocalTime(ballot.end_time);
      let notExpired = endTime > Date.now();
      let startTime = this.getLocalTime(ballot.begin_time);
      let isStarted = startTime < Date.now();
      return notExpired && isStarted;
    },
    isBallotNotStarted(ballot) {
      const startTime = this.getLocalTime(ballot.begin_time);
      return startTime > Date.now();
    },

    displayWinner(ballot) {
      if (!ballot.total_voters) return false;
      let winnerValue = -1;
      let winner;
      ballot.options.forEach((option) => {
        if (parseFloat(option.value) > winnerValue) {
          winnerValue = parseFloat(option.value);
          winner = option.key;
        }
      });
      return winner;
    },
    votingHasBegun(ballot) {
      let startTime = new Date(ballot.begin_time).getTime();
      let isStarted = startTime < Date.now();
      return isStarted;
    },
    getStartTime(ballot) {
      return this.getLocalTime(ballot.begin_time);
    },
    getEndTime(ballot) {
      return this.getLocalTime(ballot.end_time);
    },
    isNewUser() {
      return localStorage.isNewUser;
    },
    updateTreasury(newTreasury) {
      this.treasury = newTreasury;
      this.$refs.infiniteScroll.resume();
    },
    updateStatuses(newStatuses) {
      this.statuses = newStatuses;
      this.$refs.infiniteScroll.resume();
    },
    updateCategories(newCategories) {
      this.categories = newCategories;
      this.$refs.infiniteScroll.resume();
    },
    filterBallots(ballots) {
      const ballotFilteredByStatuses = ballots.filter((b) => {
        if (this.statuses) {
          if (this.statuses.length === 0) {
            return true;
          } else if (
            this.statuses.includes('active') &&
            this.statuses.includes('expired')
          ) {
            return this.statuses.includes(b.status) || b.status === 'voting';
          } else if (this.statuses.includes('active')) {
            return Date.now() < Date.parse(b.end_time);
          } else if (this.statuses.includes('expired')) {
            return (
              this.statuses.includes(b.status) ||
              (!this.isBallotOpened(b) &&
                this.votingHasBegun(b) &&
                b.status === 'voting')
            );
          } else if (this.statuses.includes('not started')) {
            return (
              this.statuses.includes(b.status) ||
              (this.isBallotNotStarted(b) && b.status === 'voting')
            );
          }
          return this.statuses.includes(b.status);
        }
      });
      const ballotFilteredByCategory = ballotFilteredByStatuses.filter((b) => {
        if (this.categories.length > 0) {
          return this.categories.includes(b.category);
        } else {
          if (this.$route.path.indexOf('election') > 0) {
            return ['election', 'referendum', 'leaderboard'].includes(
              b.category
            );
          } else {
            return ['poll', 'proposal'].includes(b.category);
          }
        }
      });
      const ballotFilteredByTreasury = ballotFilteredByCategory.filter((b) => {
        if (!this.treasury) return true;
        try {
          return b.treasury_symbol.split(',')[1] == this.treasury;
        } catch (e) {
          console.log('Problematic ballot: ', b);
          console.error(e);
        }
        return false;
      });
      return ballotFilteredByTreasury;
    },
    changeDirection(isBallotListRowDirection) {
      this.limit = 100;
      this.isBallotListRowDirection = isBallotListRowDirection;
    },
    getLoser() {
      if (!this.ballot.total_voters || this.ballot.options.length !== 2)
        return false;
      return this.ballot.options.find((x) => x.key !== this.getWinner.key);
    },
    sortBallots(ballots, method) {
      if (method === 'A-Z') {
        return ballots.sort((a, b) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        );
      } else if (method === 'Z-A') {
        return ballots.sort((a, b) =>
          a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1
        );
      } else if (method === 'Most popular') {
        return ballots.sort((a, b) =>
          a.total_voters < b.total_voters ? 1 : -1
        );
      } else if (method === 'Least popular') {
        return ballots.sort((a, b) =>
          a.total_voters > b.total_voters ? 1 : -1
        );
      } else if (method === '') {
        return ballots;
      }
    },

    changeSortOption(option) {
      this.limit = 100;
      this.sortMode = option;
    },
    ballotContentImg(ballot) {
      try {
        return JSON.parse(ballot.content).imageUrl;
      } catch (error) {
        return null;
      }
    },
    updateCards(params) {
      this.treasury = params.treasury;
      this.statuses = params.tatus;
      this.categories = params.type;
    },
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account']),
    ...mapGetters('trails', [
      'ballots',
      'ballotsPagination',
      'treasuriesOptions',
    ]),
  },
  watch: {
    $route(to) {
      this.showBallot = !!to.params.id;
    },
    account() {
      this.fetchUserVotes();
    },
  },
};
</script>

<template lang="pug">
q-page(v-if="!renderComponent")
  welcome-card(v-if="!isNewUser() && isAuthenticated")
  action-bar(
    ref="actionBar"
    @update-treasury="updateTreasury"
    @update-statuses="updateStatuses"
    @update-categories="updateCategories"
    @change-diraction="changeDirection"
    @open-ballot-form="openBallotForm"
    @change-sort-option="changeSortOption"
    @update-cards="updateCards"
    :treasuriesOptions="treasuriesOptions"
    :activeFilter="activeFilter"
    :election="$route.path.indexOf('election') > 0")
  ballot-form(
    :show.sync="show"
    @close="show = false"
  )
  .ballots(ref="ballotsRef")
    q-infinite-scroll(
      ref="infiniteScroll"
      @load="onLoad"
      :offset="50"
    )
      div(:class="isBallotListRowDirection ? 'row-direction' : 'column-direction'")
        ballot-list-item(
          @click.native="openBallot(ballot)"
          v-for="(ballot, index) in sortBallots(filterBallots(ballots),sortMode)"
          :key="index"
          :ballot="ballot"
          :displayWinner="displayWinner"
          :isBallotOpened="isBallotOpened(ballot)"
          :votingHasBegun="votingHasBegun(ballot)"
          :getStartTime="getStartTime(ballot)"
          :getEndTime="getEndTime(ballot)"
          :getLoser="getLoser"
          :ballotContentImg="ballotContentImg"
        )
      p.text-weight-bold(
        style="text-align: center"
        v-if="!sortBallots(filterBallots(ballots),sortMode).length && !loading") There is no data for the corresponding request

      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
  q-dialog(v-model="showBallot" :key="$route.params.id + timeAtMount" transition-show="slide-up" transition-hide="slide-down" @hide="closeBallot")
    //- div(style="width: 80vw").bg-white
      //- p test
    ballot-view(
      :isBallotOpened="isBallotOpened"
      :displayWinner="displayWinner"
      :votingHasBegun="votingHasBegun"
      :getStartTime="getStartTime"
      :getEndTime="getEndTime"
      :getLoser="getLoser"
      :ballotContentImg="ballotContentImg"
    )
      //- q-btn(v-close-popup color="secondary").float-right Close
</template>
<style lang="sass" scoped>
.link
  text-decoration: none
.banner
  background: #571aff99
.banner .banner-grey-bar
  background-color: #0000001a
  height: 46%
  width: 100%
.row-direction
  display: flex
  flex-wrap: wrap
  gap: 32px 20px
  margin-top: 32px
.column-direction
  display: flex
  flex-direction: column
.pagination-wrapper
  margin: 24px 0
@media (max-width: 1366px)
  .row-direction
    justify-content: space-between
    max-width: 800px
    margin: 0 auto
    margin-top: 32px
@media (max-width: 768px)
    .row-direction
      justify-content: center
@media (max-width: 600px)
    .row-direction
      margin-top: 0
    .pagination-wrapper
      margin-bottom: 100px
      font-size: 12px
@media (max-width: 400px)
    .row-direction
      gap: 24px 20px
</style>
