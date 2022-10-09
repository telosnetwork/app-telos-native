<template>
  <div class="cases-page">
    <div class="top-row">
      <intro-card
        heading="Create a new case"
        text="Do you have an asset related issue that you’d like the network’s arbitration system to resolve? We believe that a transparent process benefits everyone."
      >
        <template v-slot:buttons>
          <q-btn
            color="primary"
            @click="isModalVisible = !isModalVisible"
            v-if="isAuthenticated"
            >Create a New Case</q-btn
          >
        </template>
      </intro-card>
      <meet-arbitrators v-if="isResolveStoresAvailable" />
    </div>
    <div class="form-wrapper">
      <q-dialog v-model="isModalVisible">
        <create-new-case-modal />
      </q-dialog>
    </div>
    <case-files-table />
  </div>
</template>

<script>
import IntroCard from "../../components/IntroCard.vue";
import CaseFilesTable from "../../components/CaseFilesTable.vue";
import MeetArbitrators from "./MeetArbitrators.vue";
import { mapGetters } from "vuex";
import CreateNewCaseModal from "../case-file/CreateNewCaseModal.vue";

export default {
  components: {
    IntroCard,
    CaseFilesTable,
    MeetArbitrators,
    CreateNewCaseModal,
  },
  data() {
    return {
      isModalVisible: true,
    };
  },
  methods: {
    toggleModal() {
      this.isModalVisible = !this.isModalVisible;
    },
    createNewCase() {},
  },
  computed: {
    ...mapGetters({
      isResolveStoresAvailable: "resolve/isResolveStoresAvailable",
      isAuthenticated: "accounts/isAuthenticated",
    }),
  },
};
</script>

<style lang="scss" scoped>
.cases-page {
  .top-row {
    display: flex;
    flex-direction: row;
  }
}
</style>
