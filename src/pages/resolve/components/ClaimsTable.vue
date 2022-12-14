<template>
  <q-table title="Claims" :rows="claims" :columns="columns" row-key="name">
    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <span>&nbsp;{{ getStatus(props.row.status) }}</span>
      </q-td>
    </template>
    <template v-slot:body-cell-claim_summary="props">
      <q-td :props="props">
        <a
          v-if="props.row.claim_summary"
          :href="`https://api.dstor.cloud/ipfs/${props.row.claim_summary}`"
          target="_blank"
          >View</a
        >
        <q-badge
          v-if="props.row.claim_info_needed"
          rounded
          color="red"
          label="!"
          align="top"
        >
          <q-tooltip>More info needed from claimant</q-tooltip>
        </q-badge>
      </q-td>
    </template>
    <template v-slot:body-cell-claimant_limit_time="props">
      <q-td :props="props">
        {{
          props.row.claim_info_needed
            ? new Date(props.row.claimant_limit_time + "Z").toISOString()
            : "n/a"
        }}
      </q-td>
    </template>
    <template v-slot:body-cell-decision_link="props">
      <q-td :props="props">
        <a
          v-if="props.row.decision_link"
          :href="`https://api.dstor.cloud/ipfs/${props.row.decision_link}`"
          target="_blank"
          >View</a
        >
      </q-td>
    </template>
    <template v-slot:body-cell-response_link="props">
      <q-td :props="props">
        <a
          v-if="props.row.response_link"
          :href="`https://api.dstor.cloud/ipfs/${props.row.response_link}`"
          target="_blank"
          >View</a
        >
        <q-badge
          v-if="props.row.response_info_needed"
          rounded
          color="red"
          label="!"
          align="top"
        >
          <q-tooltip>More info needed from respondant</q-tooltip>
        </q-badge>
      </q-td>
    </template>
    <template v-slot:body-cell-respondant_limit_time="props">
      <q-td :props="props">
        {{
          props.row.response_info_needed
            ? new Date(props.row.respondant_limit_time + "Z").toISOString()
            : "n/a"
        }}
      </q-td>
    </template>
    <template v-slot:body-cell-claim_category="props">
      <q-td :props="props">
        <span>{{ getClaimCategory(props.row.claim_category) }}</span>
      </q-td>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn-dropdown color="primary" label="Actions">
          <q-list>
            <q-item
              v-if="
                isRespondant() &&
                caseFile.case_status === 3 &&
                [1, 2].includes(props.row.status) &&
                props.row.response_info_needed
              "
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
                <q-item-label>Update Claim</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="
                isCaseArbitrator &&
                caseFile.case_status === 3 &&
                [1, 2].includes(props.row.status)
              "
              clickable
              v-close-popup
              @click="
                form = true;
                formType = 'reviewclaim';
                claimId = props.row.claim_id;
              "
            >
              <q-item-section>
                <q-item-label>Request More Info</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="
                !isPendingInfoNeeded(props.row) &&
                isCaseArbitrator &&
                caseFile.case_status === 3
              "
              clickable
              v-close-popup
              @click="
                form = true;
                formType = 'settleclaim';
                claimId = props.row.claim_id;
              "
            >
              <q-item-section>
                <q-item-label>Settle Claim</q-item-label>
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
      <review-claim-form
        v-if="formType === 'reviewclaim'"
        :caseId="$route.params.id"
        :claimId="claimId"
        :close="closeModal"
      />
      <settle-claim-form
        v-if="formType === 'settleclaim'"
        :caseId="$route.params.id"
        :claimId="claimId"
        :close="closeModal"
      />
    </q-dialog>
  </div>
</template>

<script>
import { fetchClaims } from "../util";
import { CLAIM_STATUS_LIST, CLAIM_CATEGORY_LIST } from "../constants/claim";
import IpfsLink from "./IpfsLink.vue";
import RespondClaimForm from "./RespondClaimForm.vue";
import UpdateClaimForm from "./UpdateClaimForm.vue";
import ReviewClaimForm from "./ReviewClaimForm.vue";
import SettleClaimForm from "./SettleClaimForm.vue";
import { mapGetters } from "vuex";

export default {
  props: ["caseId", "caseFile", "claims"],
  components: {
    IpfsLink,
    RespondClaimForm,
    UpdateClaimForm,
    ReviewClaimForm,
    SettleClaimForm,
  },
  data() {
    return {
      interval: null,
      form: false,
      claimId: null,
      formType: null,
      columns: [
        { name: "claim_id", label: "ID", field: "claim_id" },
        { name: "claim_summary", label: "Claim", field: "claim_summary" },
        {
          name: "claimant_limit_time",
          label: "Claimant Deadline",
          field: "claimant_limit_time",
        },
        { name: "claim_category", label: "Category", field: "claim_category" },
        { name: "decision_link", label: "Decision", field: "decision_link" },
        { name: "response_link", label: "Response", field: "response_link" },
        {
          name: "respondant_limit_time",
          label: "Respondant Deadline",
          field: "respondant_limit_time",
        },
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
      return this.account === this.caseFile.respondant;
    },
    isPendingInfoNeeded(claim) {
      let isPending = false;
      if (claim.claim_info_needed) {
        const claimantDeadline = new Date(claim.claimant_limit_time);
        if (claimantDeadline > new Date()) {
          isPending = true;
        }
      }
      if (claim.response_info_needed) {
        const responseDeadline = new Date(claim.respondant_limit_time);
        if (responseDeadline > new Date()) {
          isPending = true;
        }
      }
      return isPending;
    },
    getClaimCategory(id) {
      return CLAIM_CATEGORY_LIST[id];
    },
    getStatus(statusId) {
      return CLAIM_STATUS_LIST[statusId];
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
    isCaseArbitrator() {
      return this.caseFile.arbitrators.includes(this.account);
    },
  },
};
</script>

<style scoped lang="scss">
.q-tooltip {
  font-size: 1rem;
  line-height: 1rem;
}
</style>
