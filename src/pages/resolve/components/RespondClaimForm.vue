<template>
  <q-card style="min-width: 450px">
    <q-card-section>
      <div class="text-h6">Respond to Claim</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <file-upload-input @update:hash="setResponseLink" />
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
      responseLink: "",
    };
  },
  computed: {
    ...mapGetters({
      account: "accounts/account",
    }),
  },
  methods: {
    validateId,
    setResponseLink(link) {
      this.responseLink = link;
    },
    isLinkValid() {
      console.log("isLinkValid: ", this.responseLink);
      const isValid = validateIpfsHash(this.responseLink);
      return isValid;
    },
    async submit() {
      const addClaimActions = [
        {
          account: "testtelosarb",
          name: "respond",
          data: {
            respondant: this.account,
            response_link: this.responseLink,
            claim_id: this.claimId,
            case_id: this.caseId,
          },
        },
      ];
      try {
        await this.$store.$api.signTransaction(addClaimActions);
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
