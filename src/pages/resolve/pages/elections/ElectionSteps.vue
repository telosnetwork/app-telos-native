<template>
  <div class="container">
    <div class="q-pa-md stepper-wrap">
      <q-stepper v-model="electionStatus" vertical color="primary" animated>
        <q-step :name="3" title="Nominee Registration" icon="settings">
          Admin is able to set the configuration parameters for the smart
          contract, including election duration, arbitration term length, and
          number of arbitration seats to be filled.
          <br /><br />
          <q-btn
            v-if="isAddNomineeButtonVisible"
            @click="
              form = true;
              formType = 'nominate-self';
            "
            color="primary"
            label="Nominate Self"
          />
          <q-btn
            v-if="isRemoveNomineeButtonVisible"
            color="secondary"
            label="Remove Nomination"
          />
        </q-step>

        <q-step
          :name="'candidate-registration'"
          title="Candidate Registration"
          icon="assignment"
        >
          Nominees are able to add and remove themselves as an official
          candidate to the upcoming election.
          <br /><br />
          <q-btn
            v-if="isRegisterCandidateButtonVisible"
            @click="registerSelfCandidate"
            color="primary"
            label="Register as Candidate"
          />
        </q-step>

        <q-step
          :name="'election-ready'"
          title="Election Ready to Start"
          icon="assignment"
        >
          Election is ready to start pending administration launch
        </q-step>

        <q-step :name="'voting'" title="Voting" icon="add_comment">
          Users are able to vote for the candidate(s) of choice.
        </q-step>
        <q-step
          :name="'election-finalization'"
          title="Arbitration"
          icon="add_comment"
        >
          Voting has completed and admin needs to execute
          <strong>endelection</strong>
          action to process the vote results and begin the arbitration term for
          the winning candidates. Users will also be able to start nominating
          themselves for the next election, whenever that may happen to be.
          <br /><br />
          <q-btn @click="endElection" color="primary" label="View Cases" />
        </q-step>
      </q-stepper>
    </div>
    <div class="form-wrapper" persistent>
      <q-dialog v-model="form">
        <nominate-self-modal
          v-if="formType === 'nominate-self'"
          :close="closeModal"
        />
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import NominateSelfModal from "../../components/NominateSelfModal.vue";

export default {
  components: {
    NominateSelfModal,
  },
  data() {
    return {
      form: null,
      formType: null,
    };
  },
  methods: {
    closeModal() {
      this.form = null;
    },
    async endElection() {
      const endElectionActions = [
        {
          account: "testtelosarb",
          name: "endelection",
        },
      ];
      try {
        await this.$store.$api.signTransaction(endElectionActions);
      } catch (err) {
        console.log("endElection error: ", err);
      }
    },
    async registerSelfCandidate() {
      const { account } = this.$store.state.accounts;
      const endElectionActions = [
        {
          account: "testtelosarb",
          name: "candaddlead",
          data: {
            nominee: account,
          },
        },
      ];
      try {
        await this.$store.$api.signTransaction(endElectionActions);
      } catch (err) {
        console.log("endElection error: ", err);
      }
    },
  },
  computed: {
    ...mapGetters({
      currentElection: "resolve/getCurrentElection",
      account: "accounts/account",
    }),
    isAddNomineeButtonVisible() {
      // already nominee
      const {
        resolve: { nominees },
      } = this.$store.state;
      const foundNominee = nominees.find(
        (nominee) => nominee.nominee_name === this.account
      );
      return !foundNominee;
    },
    isRemoveNomineeButtonVisible() {
      // needs to be in nominees table but not elections candidate
      const {
        resolve: { nominees },
      } = this.$store.state;
      const foundNominee = nominees.find(
        (nominee) => nominee.nominee_name === this.account
      );
      const foundCandidate = this.currentElection.candidates.find(
        (candidate) => candidate.name === this.account
      );
      if (foundNominee && foundCandidate) return true;
      return false;
    },
    isRegisterCandidateButtonVisible() {
      const { resolve, accounts } = this.$store.state;
      const { account } = accounts;
      const { config, elections, nominees } = resolve;
      const { candidates } = this.currentElection;
      const foundNominee = nominees.find(
        (nominee) => nominee.nominee_name === this.account
      );
      const foundCandidate = candidates.find(
        (candidate) => candidate.name === this.account
      );
      return !!this.account && foundNominee && !foundCandidate;
    },
    electionStatus() {
      const { resolve } = this.$store.state;
      if (resolve && resolve.config && resolve.elections) {
        const { status, end_voting_ts, end_add_candidates_ts } =
          this.currentElection;
        if (status === 1) {
          const endAddCandidateUnixTimestamp = new Date(
            `${end_add_candidates_ts}Z`
          ).getTime();
          const rightNow = new Date().getTime();
          if (endAddCandidateUnixTimestamp > rightNow) {
            return "candidate-registration";
          } else {
            return "election-ready";
          }
        }
        if (status === 2) {
          // see if voting period has ended
          const endVotingUnixTimestamp = new Date(
            `${end_voting_ts}Z`
          ).getTime();
          const rightNow = new Date().getTime();
          if (endVotingUnixTimestamp > rightNow) {
            return "voting";
          } else {
            return "election-finalization";
          }
        }
        return status;
      }
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;

  .stepper-wrap {
    flex: 1;
  }
}
</style>
