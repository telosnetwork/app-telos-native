<template>
  <div class="container">
    <div class="q-pa-md stepper-wrap">
      <q-stepper v-model="caseStatus" vertical color="primary" animated>
        <q-step :name="0" title="Case Setup" icon="settings">
          Case has been set up, and the claimant is able to submit additional
          claims. Arbitrators have not yet been assigned, and the respondant is
          not yet allowed to respond to the individual claims.
          <br /><br />
          <q-btn
            v-if="isClaimant"
            @click="
              form = true;
              formType = 'readycase';
            "
            color="primary"
            label="Ready Case"
          />&nbsp;
        </q-step>

        <q-step :name="1" title="Awaiting Arbitrators" icon="assignment">
          After a case file has been built and is ready for review, the case
          enters the "Awaiting Arbitrators" stage where any arbitrator can send
          an offer to the claimant with their hourly rate and the estimated
          number of hours to judge the case. To accept an offer the claimant
          will need to pay the whole cost upfront. However, the funds will not
          be transferred to the arbitrator until the case is resolved, and can
          be returned in case of mistrial.
          <br /><br />
          <q-btn
            v-if="
              canArbitratorSubmitOffer() &&
              (!existingArbOffer || existingArbOffer.status === 1)
            "
            @click="
              form = true;
              formType = 'makeoffer';
            "
            color="primary"
            :label="
              canArbitratorSubmitOffer() === 'new'
                ? 'Submit Offer'
                : 'Update Offer'
            "
          />&nbsp;
          <q-btn
            v-if="existingArbOffer && existingArbOffer.status === 1"
            @click="
              form = true;
              formType = 'dismissoffer';
            "
            color="red"
            label="Dismiss Offer"
          />
          <br /><br />
          <offers-table :caseId="caseFile.case_id" :caseFile="caseFile" />
        </q-step>

        <q-step :name="2" title="Arbitrators Assigned" icon="assignment">
          Now that the arbitrator(s) has been assigned, case waits for the
          arbitrator to begin the case investigation.
          <br /><br />
          <q-btn
            v-if="isCaseArbitrator()"
            @click="startCase()"
            color="primary"
            label="Start Case"
          />
        </q-step>

        <q-step :name="3" title="Case Investigation" icon="add_comment">
          Arbitrator begins to investigate the individual claims. Claimant can
          update their claims, especially if more info is required by the
          arbitrator. Respondant will also be able to respond to claims made by
          the claimant.
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
        <ready-case-form
          v-if="formType === 'readycase'"
          :caseId="caseFile.case_id"
          :close="closeModal"
        />
        <make-offer-form
          v-if="formType === 'makeoffer'"
          :caseId="caseFile.case_id"
          :close="closeModal"
        />
        <dismiss-offer-form
          v-if="formType === 'dismissoffer'"
          :caseId="caseFile.case_id"
          :close="closeModal"
        />
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ReadyCaseForm from "../../components/ReadyCaseForm.vue";
import MakeOfferForm from "../../components/MakeOfferForm.vue";
import OffersTable from "../../components/OffersTable.vue";
import DismissOfferForm from "../../components/DismissOfferForm.vue";

export default {
  props: ["caseFile"],
  components: {
    ReadyCaseForm,
    MakeOfferForm,
    OffersTable,
    DismissOfferForm,
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
      isArbitrator: "resolve/isArbitrator",
      account: "accounts/account",
    }),
    caseStatus() {
      return this.caseFile.case_status;
    },
    isClaimant() {
      return this.account === this.caseFile.claimant;
    },
    existingArbOffer() {
      return this.$store.state.resolve.offers.find(
        (offer) =>
          offer.case_id === this.caseFile.case_id &&
          offer.arbitrator === this.account
      );
    },
  },
  methods: {
    closeModal() {
      this.form = null;
    },
    isCaseArbitrator() {
      return this.caseFile.arbitrators.includes(this.account);
    },
    canArbitratorSubmitOffer() {
      // is arbitrator available
      if (!this.isArbitrator) return false;
      if (this.caseFile.case_status !== 1) return false;
      const arbitrators = this.$store.state.resolve.arbitrators;
      const foundArbitrator = arbitrators.find(
        (arb) => arb.arb === this.account
      );
      if (foundArbitrator.arb_status !== 1) return false;
      if (
        this.caseFile.claimant === this.account ||
        this.caseFile.respondant === this.account
      )
        return false;
      if (this.existingArbOffer) {
        return "update";
      }
      return "new";
    },
    async startCase() {
      const startCaseActions = [
        {
          account: "testtelosarb",
          name: "startcase",
          data: {
            case_id: this.caseFile.case_id,
            assigned_arb: this.account,
          },
        },
      ];
      try {
        await this.$store.$api.signTransaction(startCaseActions);
      } catch (err) {
        console.log("endElection error: ", err);
      }
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
