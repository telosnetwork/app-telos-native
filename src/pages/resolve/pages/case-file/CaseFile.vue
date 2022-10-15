<template>
  <div v-if="isResolveStoresAvailable && caseFile">
    <div class="row">
      <div class="part">
        <intro-card heading="Case Summary">
          <p>
            <strong>{{ caseFile.claimant }}</strong> is the claimant, with
            <strong>{{ caseFile.respondant }}</strong> being the respondant.
            There is
            <strong>{{ caseFile.arbitrators?.length }}</strong> arbitrator,
            <strong>{{
              caseFile.arbitrators && caseFile.arbitrators[0]
            }}</strong
            >, assigned to the case.
          </p>
          <template v-slot:buttons>
            <div class="intro-buttons-wrap">
              <q-btn
                v-if="isAddClaimButtonVisible()"
                color="primary"
                label="Add claim to case"
                @click="
                  form = true;
                  formType = 'addclaim';
                "
              />&nbsp;
              <q-btn
                v-if="isShredCaseButtonVisible()"
                color="red"
                label="Delete Case"
                @click="
                  form = true;
                  formType = 'shredcase';
                "
              />
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
    <div class="case-file-modal-wrap">
      <q-dialog id="case-file-modal" v-model="form">
        <add-claim-form
          v-if="formType === 'addclaim'"
          :caseId="$route.params.id"
          :close="closeModal"
        />
        <shred-case-form
          v-if="formType === 'shredcase'"
          :caseId="$route.params.id"
          :close="closeModal"
          :afterShredCase="fetchCaseFile"
        />
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { GET_TABLE_ROWS } from "../../constants";
import { FETCH_CASE_ACTIONS_HISTORY } from "../../util/case";
import ClaimsTable from "../../components/ClaimsTable.vue";
import IntroCard from "../../components/IntroCard.vue";
import CaseSteps from "../cases/CaseSteps.vue";
import CaseFileActions from "./CaseFileActions.vue";
import AddClaimForm from "./AddClaimForm.vue";
import ShredCaseForm from "../../components/ShredCaseForm.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    ClaimsTable,
    IntroCard,
    CaseSteps,
    CaseFileActions,
    AddClaimForm,
    ShredCaseForm,
  },
  data() {
    return {
      caseFile: null,
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
      form: null,
      formType: null,
    };
  },
  methods: {
    closeModal() {
      this.form = null;
    },
    async fetchCaseFile() {
      const id = this.$route.params.id;
      if (!id) return;
      try {
        const { rows } = await GET_TABLE_ROWS({
          code: "testtelosarb",
          scope: "testtelosarb",
          table: "casefiles",
          key_type: "i64",
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
    isAddClaimButtonVisible() {
      if (!this.isClaimant) return false;
      console.log("isClaimaint");
      if (this.caseFile.case_status !== 0) return false;
      if (this.caseFile.number_claims > this.config.max_claims_per_case)
        return false;
      return true;
    },
    isShredCaseButtonVisible() {
      if (!this.isClaimant) return false;
      console.log("isClaimaint");
      if (this.caseFile.case_status !== 0) return false;
      return true;
    },
  },
  computed: {
    ...mapGetters({
      isResolveStoresAvailable: "resolve/isResolveStoresAvailable",
      isResolveAdmin: "resolve/isResolveAdmin",
      account: "accounts/account",
    }),
    config() {
      return this.$store.state.resolve.config;
    },
    isClaimant() {
      if (!this.caseFile) return false;
      return this.account === this.caseFile.claimant;
    },
    isRespondant() {
      if (!this.caseFile) return false;
      return this.account === this.caseFile.respondant;
    },
  },
  async mounted() {
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
};
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

  .case-file-modal-wrap {
    flex: 1;
  }
}
</style>
