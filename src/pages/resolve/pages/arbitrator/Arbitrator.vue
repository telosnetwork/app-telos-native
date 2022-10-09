<template>
  <div v-if="isResolveStoresAvailable" class="container">
    <div class="q-pa-md stepper-wrap">
      <q-btn-toggle
        :model-value="status"
        no-caps
        toggle-color="primary"
        color="white"
        text-color="black"
        :options="[
          { label: 'Available', value: 1 },
          { label: 'Unavailable', value: 2 },
          { label: 'Removed', value: 3 },
          { label: 'Expired', value: 4 },
        ]"
        @update:model-value="changeArbStatus"
      />
    </div>
    <div>
      <assigned-cases />
    </div>
    <div class="form-wrapper">
      <q-dialog v-model="form">
        <init-election-modal
          v-if="formType === 'initelection'"
          :close="closeModal"
        />
        <begin-voting-modal
          v-if="formType === 'beginvoting'"
          :close="closeModal"
        />
      </q-dialog>
    </div>
  </div>
</template>

<script>
import InitElectionModal from "../../components/InitElectionModal.vue";
import BeginVotingModal from "../../components/BeginVotingModal.vue";
import AssignedCases from "./AssignedCases.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    InitElectionModal,
    BeginVotingModal,
    AssignedCases,
  },
  data() {
    return {
      form: null,
      formType: null,
      status: null,
    };
  },
  methods: {
    closeModal() {
      this.form = null;
    },
    async changeArbStatus(new_status) {
      const newArbStatusActions = [
        {
          account: "testtelosarb",
          name: "newarbstatus",
          data: {
            arbitrator: this.account,
            new_status,
          },
        },
      ];
      try {
        await this.$store.$api.signTransaction(newArbStatusActions);
      } catch (err) {
        console.log("changeArbStatus error: ", err);
      }
    },
  },
  computed: {
    ...mapGetters({
      arbSeatsAvailable: "resolve/arbSeatsAvailable",
      isResolveStoresAvailable: "resolve/isResolveStoresAvailable",
      selfArbitrator: "resolve/isArbitrator",
      account: "accounts/account",
    }),
    electionStatus() {
      const resolve = this.$store.state.resolve;
      if (resolve && resolve.config && resolve.elections) {
        const { current_election_id } = resolve;
        const currentElection = resolve.elections.find(
          (e) => e.id === current_election_id
        );
        if (!currentElection) return null;
        const { status, end_voting_ts, end_add_candidates_ts } =
          currentElection;
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
  updated() {
    const selfArbitrator = this.selfArbitrator;
    if (!selfArbitrator) this.status = null;
    const { arb_status } = selfArbitrator;
    this.status = arb_status;
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;

  .stepper-wrap {
    flex: 1;
  }
  .form-wrapper {
    flex: 1;
  }
}
</style>
