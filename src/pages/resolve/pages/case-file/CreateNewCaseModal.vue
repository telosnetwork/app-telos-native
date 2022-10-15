import { DECISION_CLASS_LIST } from '../../constants/claim';
<template>
  <q-card style="min-width: 450px">
    <q-card-section>
      <div class="text-h6">Create New Case</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input
        v-model="account"
        disable
        filled
        label="Claimant"
        bottom-slots
        hint="Telos account name"
        error-message="Must be valid Telos account name"
        dense
      />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input
        v-model="respondant"
        autofocus
        filled
        label="Respondant"
        bottom-slots
        hint="Telos account name"
        error-message="Must be valid Telos account name"
        dense
      />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <file-upload-input @update:hash="setClaimLink" />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-select
        filled
        v-model="category"
        :options="categories"
        label="Category"
      />
    </q-card-section>

    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Submit" @click="submit" />
      <q-btn flat label="Cancel" @click="close" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { ref } from "vue";
import { mapGetters } from "vuex";
import { DECISION_CLASS_LIST } from "../../constants";
import { validateIpfsHash } from "../../util";
import FileUploadInput from "../../components/FileUploadInput.vue";

// claimant, claim_link, respondant, claim_category
export default {
  components: {
    FileUploadInput,
  },
  data() {
    const options = DECISION_CLASS_LIST.map((item, index) => ({
      label: item,
      value: index,
    }));
    return {
      category: null,
      respondant: "",
      claimLink: "",
      categories: options,
    };
  },
  computed: {
    ...mapGetters({
      account: "accounts/account",
    }),
  },
  methods: {
    setClaimLink(link) {
      this.claimLink = link;
    },
    isLinkValid() {
      console.log("isLinkValid: ", this.claimLink);
      const isValid = validateIpfsHash(this.claimLink);
      return isValid;
    },
    async submit() {
      console.log(
        "submit: ",
        this.category.value,
        this.respondant,
        this.claimLink
      );
    },
  },
  updated() {
    console.log("updated, this: ", this);
  },
  beforeUpdate() {
    console.log("beforeUpdate, this: ", this);
  },
};
</script>

<style lang="scss" scoped></style>
