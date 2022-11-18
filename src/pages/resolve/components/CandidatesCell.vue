<template>
  <q-td key="candidates">
    <p class="header">Candidates</p>
    <div v-for="candidate of election.candidates" v-bind:key="candidate.name">
      <div class="candidate-item">
        <div class="data">
          <telos-profile-avatar
            :account_name="candidate.name"
            class="avatar-wrap"
            size="24px"
          ></telos-profile-avatar>
          <div class="info">
            <div class="text candidate-item">
              {{ candidate.name }}&nbsp; (<a
                :href="getCandidateIpfsLink(candidate.name)"
                target="_blank"
                >more info</a
              >)
              <!--<q-icon
                v-if="isRemoveCandidateButtonVisible(candidate.name)"
                name="remove"
                color="white"
                size="1rem"
                class="remove-icon"
              />-->
            </div>
            <div class="text">({{ getCandidateVotes(candidate.name) }})</div>
          </div>
        </div>
        <div class="bar-wrap">
          <q-linear-progress
            :value="getPercentage(candidate.name)"
            class="q-mt-md"
          />
        </div>
      </div>
    </div>
  </q-td>
</template>

<script>
import { mapGetters } from "vuex";
import { getBallot, getSymbolInfo } from "../util";
import TelosProfileAvatar from "src/components/common/TelosProfileAvatar.vue";

export default {
  props: ["election"],
  components: {
    TelosProfileAvatar,
  },
  data() {
    return {
      results: [],
      interval: null,
    };
  },
  methods: {
    totalVotes() {
      if (!this.results.length) return 0;
      const sum = this.results.reduce((previous, current) => {
        const { amount } = getSymbolInfo(current.value);
        return previous + parseFloat(amount);
      }, 0);
      return sum;
    },
    getCandidateVotes(account_name) {
      if (this.election.status < 2) return "0.0000 VOTE";
      else {
        const option = this.results.find(
          (result) => result.key === account_name
        );
        if (!option) return "0.0000 VOTE";
        return option.value;
      }
    },
    getCandidateIpfsLink(account_name) {
      const nominees = this.$store.state.resolve.nominees;
      const nominee = nominees.find(
        (item) => item.nominee_name === account_name
      );
      const hash = nominee?.credentials_link;
      const url = `https://api.dstor.cloud/ipfs/${hash}`;
      return url;
    },
    async getBallotResults() {
      if (this.election.status < 2) return;
      try {
        const ballot = await getBallot(this, this.election.ballot_name);
        if (!ballot) return;
        this.results = ballot.options;
      } catch (err) {
        console.log("getBallotResults error: ", err);
      }
    },
    isRemoveCandidateButtonVisible(account_name) {
      if (
        this.currentElection.status === 1 &&
        account_name === this.account &&
        !this.isPastAddCandidates
      ) {
        return true;
      }
      return false;
    },
    getPercentage(searchName) {
      if (!this.results.length) return 0;
      const candidateData = this.results.find(({ key }) => key === searchName);
      if (!candidateData) return 0;
      const { value } = candidateData;
      const { amount } = getSymbolInfo(value);
      const voteAmount = parseFloat(amount);
      const totalVotes = this.totalVotes();
      const percentage = voteAmount / totalVotes;
      return percentage;
    },
  },
  computed: {
    ...mapGetters({
      account: "accounts/account",
      currentElection: "resolve/getCurrentElection",
      isPastAddCandidates: "resolve/isPastAddCandidates",
    }),
  },
  mounted() {
    this.getBallotResults();
    this.interval = setInterval(this.getBallotResults, 10000);
  },
  unmounted() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped lang="scss">
.header {
  font-family: Roboto;
}

td.text-left {
  text-align: left;
}

.candidate-item {
  padding: 4px;
  display: flex;
  flex: 1;
  align-self: center;
  margin-right: 12px;

  a {
    color: inherit;
  }

  .remove-icon {
    background-color: red;
    border-radius: 50%;

    &:hover {
      cursor: pointer;
    }
  }

  .data {
    display: flex;
    flex-direction: row;
    margin-right: 24px;

    .avatar-wrap {
      margin-right: 8px;
    }
    .info {
      width: 330px;
      height: 24px;
      display: flex;
      justify-content: space-between;
      flex-direction: row;

      .text {
        line-height: 24px;
      }
    }
  }

  .bar-wrap {
    flex: 1;
    height: 24px;
  }
}
</style>
