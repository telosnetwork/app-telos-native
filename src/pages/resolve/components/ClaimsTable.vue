<template>
  <q-table title="Claims" :rows="claims" :columns="columns" row-key="name">
    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <span>&nbsp;{{ getStatus(props.row.status) }}</span>
      </q-td>
    </template>
    <template v-slot:body-cell-claim_summary="props">
      <q-td :props="props">
        <IpfsLink :hash="props.row.claim_summary"></IpfsLink>
      </q-td>
    </template>
    <template v-slot:body-cell-decision_link="props">
      <q-td :props="props">
        <IpfsLink :hash="props.row.decision_link"></IpfsLink>
      </q-td>
    </template>
    <template v-slot:body-cell-response_link="props">
      <q-td :props="props">
        <IpfsLink :hash="props.row.response_link"></IpfsLink>
      </q-td>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn-dropdown color="primary" label="Actions">
          <q-list>
            <q-item
              v-if="isRespondant() && caseFile.status === 3"
              clickable
              v-close-popup
              @click="
                form = true;
                formType = 'respond';
                claimId = props.row.claim_id;
              "
            >
              <q-item-section>
                <q-item-label>Respond</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="isClaimant() && [0, 3].includes(caseFile.case_status)"
              clickable
              v-close-popup
              @click="
                form = true;
                formType = 'updateclaim';
                claimId = props.row.claim_id;
              "
            >
              <q-item-section>
                <q-item-label>Update</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-td>
    </template>
  </q-table>
  <div class="case-file-modal-wrap">
    <q-dialog id="case-file-modal" v-model="form">
      <respond-claim-form
        v-if="formType === 'respond'"
        :caseId="$route.params.id"
        :claimId="claimId"
        :close="closeModal"
      />
      <update-claim-form
        v-if="formType === 'updateclaim'"
        :caseId="$route.params.id"
        :claimId="claimId"
        :close="closeModal"
      />
    </q-dialog>
  </div>
</template>

<script>
import { fetchClaims } from "../util";
import { DECISION_CLASS_LIST } from "../constants/claim";
import IpfsLink from "./IpfsLink.vue";
import RespondClaimForm from "./RespondClaimForm.vue";
import UpdateClaimForm from "./UpdateClaimForm.vue";
import { mapGetters } from "vuex";

export default {
  props: ["caseId", "caseFile"],
  components: {
    IpfsLink,
    RespondClaimForm,
    UpdateClaimForm,
  },
  data() {
    return {
      interval: null,
      form: false,
      claimId: null,
      formType: null,
      claims: [],
      columns: [
        { name: "claim_id", label: "ID", field: "claim_id" },
        { name: "claim_summary", label: "Summary", field: "claim_summary" },
        { name: "decision_class", label: "Class", field: "decision_class" },
        { name: "decision_link", label: "Decision", field: "decision_link" },
        { name: "response_link", label: "Response", field: "response_link" },
        { name: "status", label: "Status", field: "status" },
        { name: "actions", label: "Actions", field: "actions" },
      ],
    };
  },
  methods: {
    isClaimant() {
      if (!this.caseFile) return false;
      return this.account === this.caseFile.claimant;
    },
    isRespondant() {
      if (!this.caseFile) return false;
      console.log("there is caseFile");
      return this.account === this.caseFile.respondant;
    },
    async getClaims() {
      try {
        const rows = await fetchClaims(this, this.$route.params.id);
        this.claims = rows;
      } catch (err) {
        console.log("getClaims error:", err);
      }
    },
    getStatus(statusId) {
      return DECISION_CLASS_LIST[statusId];
    },
    closeModal() {
      this.form = false;
      this.formType = null;
      this.claimId = null;
    },
  },
  computed: {
    ...mapGetters({
      account: "accounts/account",
    }),
  },
  mounted() {
    this.getClaims();
    this.interval = setInterval(
      () => this.getClaims(this, this.$route.params.id),
      10000
    );
  },
  unmounted() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped></style>
