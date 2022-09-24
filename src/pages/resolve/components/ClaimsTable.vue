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
  </q-table>
</template>

<script>
import { fetchClaims } from "../util";
import { DECISION_CLASS_LIST } from "../constants/claim";
import IpfsLink from "./IpfsLink.vue";

export default {
  props: ["caseId"],
  components: {
    IpfsLink
  },
  data() {
    return {
      interval: null,
      claims: [],
      columns: [
        { name: "claim_id", label: "ID", field: "claim_id" },
        { name: "claim_summary", label: "Summary", field: "claim_summary" },
        { name: "decision_class", label: "Class", field: "decision_class" },
        { name: "decision_link", label: "Decision", field: "decision_link" },
        { name: "response_link", label: "Response", field: "response_link" },
        { name: "status", label: "Status", field: "status" }
      ]
    };
  },
  methods: {
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
    }
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
  }
};
</script>

<style scoped></style>
