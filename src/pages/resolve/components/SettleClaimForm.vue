<template>
  <q-card style="min-width: 450px">
    <q-card-section>
      <div class="text-h6">Submit Decision</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <file-upload-input @update:hash="setDecisionLink" />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-checkbox v-model="isAccepted" label="Accept Claim" color="primary" />
    </q-card-section>

    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Submit" @click="submit" />
      <q-btn flat label="Cancel" @click="close" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
import { validateIpfsHash, validateId } from "../util";
import FileUploadInput from "./FileUploadInput.vue";

// claimant, claim_link, respondant, claim_category
export default {
  props: ["close", "caseId", "claimId"],
  components: {
    FileUploadInput,
  },
  data() {
    return {
      decisionLink: "",
      isAccepted: false,
    };
  },
  computed: {
    ...mapGetters({
      account: "accounts/account",
    }),
  },
  methods: {
    validateId,
    setDecisionLink(link) {
      this.decisionLink = link;
    },
    isLinkValid() {
      const isValid = validateIpfsHash(this.decisionLink);
      return isValid;
    },
    async submit() {
      const settleClaimActions = [
        {
          account: "testtelosarb",
          name: "settleclaim",
          data: {
            respondant: this.account,
            decision_link: this.decisionLink,
            claim_id: this.claimId,
            case_id: this.caseId,
            assigned_arb: this.account,
          },
        },
      ];
      try {
        await this.$store.$api.signTransaction(settleClaimActions);
        this.close();
        // setTimeout(this.onSubmit, 5000);
      } catch (err) {
        console.log("submit error: ", err);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
