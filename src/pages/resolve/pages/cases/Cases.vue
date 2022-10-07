<template>
  <div class="cases-page">
    <div class="top-row">
      <intro-card
        heading="Create a new case"
        text="Do you have an asset related issue that you’d like the network’s arbitration system to resolve? We believe that a transparent process benefits everyone."
        buttonText="Create a new case"
      />
      <meet-arbitrators v-if="isResolveStoresAvailable" />
    </div>
    <case-files-table />
  </div>
</template>

<script>
import IntroCard from "../../components/IntroCard.vue";
import CaseFilesTable from "../../components/CaseFilesTable.vue";
import MeetArbitrators from "./MeetArbitrators.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    IntroCard,
    CaseFilesTable,
    MeetArbitrators,
  },
  computed: {
    ...mapGetters({
      isResolveStoresAvailable: "resolve/isResolveStoresAvailable",
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
