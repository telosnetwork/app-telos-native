<template>
  <q-card style="min-width: 450px">
    <q-card-section>
      <div class="text-h6">Finalize Case</div>
    </q-card-section>

    <q-card-section>
      <p>Upload a document specifying your ruling on this particular case</p>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <file-upload-input @update:hash="setDecisionLink" />
    </q-card-section>

    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Submit" @click="submit" :disable="!decisionLink" />
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
      const setRulingActions = [
        {
          account: "testtelosarb",
          name: "setruling",
          data: {
            case_id: this.caseId,
            assigned_arb: this.account,
            case_ruling: this.decisionLink,
          },
        },
      ];
      try {
        await this.$store.$api.signTransaction(setRulingActions);
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
