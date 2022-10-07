<template>
  <div class="container">
    <div class="q-pa-md stepper-wrap">
      <q-stepper v-model="caseStatus" vertical color="primary" animated>
        <q-step :name="0" title="Case Setup" icon="settings">
          Case Setup description
          <br /><br />
          <q-btn
            v-if="isClaimant"
            @click="
              form = true;
              formType = 'add-claim';
            "
            color="primary"
            label="Add Claim"
          />
          <q-btn
            v-if="isRespondant"
            @click="
              form = true;
              formType = 'respond-claim';
            "
            color="primary"
            label="Respond to Claim"
          />
        </q-step>

        <q-step :name="1" title="Awaiting Arbitrators" icon="assignment">
          Awaiting Arbs description
          <br /><br />
          <q-btn
            v-if="isRegisterCandidateButtonVisible"
            @click="registerSelfCandidate"
            color="primary"
            label="Register as Candidate"
          />
        </q-step>

        <q-step :name="2" title="Arbitrators Assigned" icon="assignment">
          Awaiting arbs description
        </q-step>

        <q-step :name="3" title="Case Investigation" icon="add_comment">
          Case Investigation description
        </q-step>

        <q-step :name="4" title="Decision" icon="add_comment">
          Admin will validate the case, which is meant to ensure that the
          arbitrator performed their job appropiately. If the case is considered
          valid, the case fee will be added to the smart contract funds and the
          arbitrator will be paid for their service. On the other hand, if the
          case is invalidated both the fee and the arbitrator rate cost will be
          returned to the claimant and the case will be considered
          <strong>dismissed</strong> <br /><br />
          <q-btn
            v-if="isResolveAdmin"
            @click="validateCase(true)"
            color="primary"
            label="Approve"
          />&nbsp;
          <q-btn
            v-if="isResolveAdmin"
            @click="validateCase(false)"
            color="red"
            label="Reject"
          />
        </q-step>

        <q-step :name="5" title="Enforcement" icon="add_comment">
          In this stage, the network validators will apply the ruling that has
          been set by the arbitrator. Once the actions have been executed, the
          admin can close the case.<br /><br />
          <q-btn
            v-if="isResolveAdmin"
            @click="closeCase"
            color="primary"
            label="Close Case"
          />
        </q-step>

        <q-step :name="6" title="Case Closed" icon="add_comment"> </q-step>
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
  props: ["caseFile"],
  components: {
    NominateSelfModal,
  },
  data() {
    return {
      form: null,
      formType: null,
    };
  },
  computed: {
    ...mapGetters({
      isResolveAdmin: "resolve/isResolveAdmin",
    }),
    caseStatus() {
      if (!this.caseFile) return null;
      return this.caseFile.case_status;
    },
    isClaimant() {
      return this.$store.state.accounts.account === this.caseFile.claimant;
    },
    isRespondant() {
      return this.$store.state.accounts.account === this.caseFile.respondant;
    },
    isArbitrator() {
      return false;
    },
  },
  methods: {
    closeModal() {
      this.form = null;
    },
    async validateCase(isProceed) {
      const validateCaseActions = [
        {
          account: "testtelosarb",
          name: "validatecase",
          data: {
            case_id: this.caseFile.case_id,
            proceed: isProceed,
          },
        },
      ];
      try {
        await this.$store.$api.signTransaction(validateCaseActions);
      } catch (err) {
        console.log("endElection error: ", err);
      }
    },
    async closeCase() {
      const validateCaseActions = [
        {
          account: "testtelosarb",
          name: "closecase",
          data: {
            case_id: this.caseFile.case_id,
          },
        },
      ];
      try {
        await this.$store.$api.signTransaction(validateCaseActions);
      } catch (err) {
        console.log("endElection error: ", err);
      }
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
  },
  updated() {
    console.log("CaseSteps this.caseFile: ", this.caseFile);
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
