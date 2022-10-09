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
      <q-input
        v-model="infoLink"
        filled
        label="Info Link"
        bottom-slots
        hint="46 or 49 character IPFS hash"
        error-message=""
        :rules="[
          isLinkValid() || 'Must be valid IPFS hash (ie \'Qmdn7bZ8z25b...\')',
        ]"
        dense
        autofocus
      />
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
// claimant, claim_link, respondant, claim_category
export default {
  data() {
    const options = DECISION_CLASS_LIST.map((item, index) => ({
      label: item,
      value: index,
    }));
    return {
      category: null,
      respondant: "",
      infoLink: "",
      categories: options,
    };
  },
  computed: {
    ...mapGetters({
      account: "accounts/account",
    }),
  },
  methods: {
    isLinkValid() {
      console.log("isLinkValid: ", this.infoLink);
      const isValid = validateIpfsHash(this.infoLink);
      return isValid;
    },
    async submit() {
      console.log(
        "submit: ",
        this.category.value,
        this.respondant,
        this.infoLink
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
