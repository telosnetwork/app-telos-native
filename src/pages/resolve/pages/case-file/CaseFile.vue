<template>
  <div v-if="isResolveStoresAvailable && caseFile">
    <div class="row">
      <div class="part">
        <intro-card heading="Case Summary">
          <p>
            <strong>{{ caseFile.claimant }}</strong> is the claimant, with
            <strong>{{ caseFile.respondant }}</strong> being the respondant.
            There is one arbitrator assigned to the case.
          </p>
          <template v-slot:buttons>
            <div class="intro-buttons-wrap">
              <q-btn color="primary" label="Add claim to case" />&nbsp;
              <q-btn color="primary" label="Respond to claim" />
            </div>
          </template>
        </intro-card>
      </div>
      <div class="part">
        <case-steps :caseFile="caseFile" />
      </div>
    </div>
    <div class="q-pa-md">
      <claims-table></claims-table>
    </div>
    <div class="q-pa-md">
      <case-file-actions :actions="caseActionsHistory" />
    </div>
  </div>
</template>

<script lang="ts">
import { GET_TABLE_ROWS } from "../../constants";
import { FETCH_CASE_ACTIONS_HISTORY } from "../../util/case";
import ClaimsTable from "../../components/ClaimsTable.vue";
import IntroCard from "../../components/IntroCard.vue";
import CaseSteps from "../cases/CaseSteps.vue";
import CaseFileActions from "./CaseFileActions.vue";
import { defineComponent } from "@vue/runtime-core";
import { mapGetters } from "vuex";

export default defineComponent({
  props: ["id"],
  components: {
    ClaimsTable,
    IntroCard,
    CaseSteps,
    CaseFileActions,
  },
  data() {
    return {
      caseFile: {},
      columns: [
        { name: "case_id", label: "ID", field: "case_id" },
        { name: "claimant", label: "Claimant", field: "claimant" },
        { name: "respondant", label: "Respondant", field: "respondant" },
        { name: "arbitrators", label: "Arbitrators", field: "arbitrators" },
        { name: "number_claims", label: "# Claims", field: "number_claims" },
        { name: "approvals", label: "Approvals", field: "approvals" },
        { name: "required_langs", label: "Lang", field: "required_langs" },
        { name: "case_status", label: "Status", field: "case_status" },
        { name: "case_ruling", label: "Ruling", field: "case_ruling" },
        { name: "update_ts", label: "Last Updated", field: "update_ts" },
        { name: "actions", label: "Actions", field: "actions" },
      ],
      caseActionsHistory: [],
    };
  },
  methods: {
    async fetchCaseFile() {
      const id = this.$route.params.id;
      if (!id) return;
      try {
        const { rows } = await GET_TABLE_ROWS({
          code: "testtelosarb",
          scope: "testtelosarb",
          table: "casefiles",
          key_type: "i64",
          // @ts-ignore
          index_position: "1",
          // @ts-ignore
          upper_bound: this.$route.params.id,
          // @ts-ignore
          lower_bound: this.$route.params.id,
        });
        console.log("fetchCaseFile rows", rows);
        const [caseFile] = rows;
        this.caseFile = caseFile;
      } catch (err) {
        console.log("fetchCaseFile error:", err);
      }
    },
  },
  mounted: async function () {
    this.fetchCaseFile();
    const actionsHistory = await FETCH_CASE_ACTIONS_HISTORY(
      this,
      // @ts-ignore
      this.$route.params.id
    );
    console.log("actionsHistory: ", actionsHistory);
    // @ts-ignore
    this.caseActionsHistory = actionsHistory;
  },
  computed: {
    ...mapGetters({
      isResolveStoresAvailable: "resolve/isResolveStoresAvailable",
    }),
    caseData() {
      return this.caseFile;
    },
  },
});
</script>

<style scoped lang="scss">
.row {
  flex-direction: row;

  .part {
    flex: 1;
  }

  .intro-buttons-wrap {
    flex-direction: column;
  }
}
</style>
