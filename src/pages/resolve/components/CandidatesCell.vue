<template>
  <q-td key="candidates">
    <p class="header">Candidates</p>
    <div v-for="candidate of election.candidates" v-bind:key="candidate.name">
      <div class="candidate-item">
        <div class="data">
          <profile-avatar
            v-bind:account_name="candidate.name"
            class="avatar-wrap"
            size="24px"
          ></profile-avatar>
          <div class="info">
            <div class="text">{{ candidate.name }}</div>
            <div class="text">({{ candidate.votes }})</div>
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
import ProfileAvatar from "../../../components/common/ProfileAvatar.vue";
import { getBallot, getSymbolInfo } from "../util";

export default {
  props: ["election", "totalVotes"],
  components: {
    ProfileAvatar
  },
  data() {
    return {
      results: null,
      interval: null
    };
  },
  methods: {
    async getBallotResults() {
      if (this.election.status !== 2) return;
      try {
        const ballot = await getBallot(this.election.ballot_name);
        if (!ballot) return;
        this.results = ballot.options;
        console.log("this.ballotResults: ", this.ballotResults);
      } catch (err) {
        console.log("getBallotResults error: ", err);
      }
    },
    getPercentage(searchName) {
      if (!this.totalVotes) return 0;
      const candidateData = this.election.candidates.find(
        ({ name }) => name === searchName
      );
      if (!candidateData) return 0;
      const { votes } = candidateData;
      const { whole } = getSymbolInfo(votes);
      return (100 * whole) / this.totalVotes;
    },
    mounted() {
      this.getBallotResults();
      this.interval = setInterval(this.getBallotResults, 10000);
    },
    unmounted() {
      clearInterval(this.interval);
    }
  }
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

  .data {
    display: flex;
    flex-direction: row;
    margin-right: 24px;

    .avatar-wrap {
      margin-right: 8px;
    }
    .info {
      width: 230px;
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
