<template>
  <q-table
    title="Offers"
    :rows="offers"
    :columns="columns"
    row-key="name"
    hide-bottom
  >
    <template v-slot:body-cell-status="props">
      <q-td :props="props"> {{ getOfferStatus(props.row.status) }} </q-td>
    </template>
    <template v-slot:body-cell-hourly_rate="props">
      <q-td :props="props">
        ${{ props.row.hourly_rate.replace("00 USD", "") }}
      </q-td>
    </template>
    <template v-slot:body-cell-total="props">
      <q-td :props="props">
        ${{
          (
            parseFloat(props.row.hourly_rate.replace("USD", "")) *
            props.row.estimated_hours
          ).toFixed(2)
        }}
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchClaims } from "../util";
import { OFFER_STATUS_LIST } from "../constants";

export default {
  props: ["caseId"],
  data() {
    return {
      interval: null,
      columns: [
        { name: "status", label: "Status", field: "status" },
        { name: "estimated_hours", label: "Hours", field: "estimated_hours" },
        { name: "arbitrator", label: "Arbitrator", field: "arbitrator" },
        { name: "hourly_rate", label: "Rate", field: "hourly_rate" },
        { name: "total", label: "Total", field: "total" },
      ],
    };
  },
  methods: {
    getOfferStatus(index) {
      return OFFER_STATUS_LIST[index];
    },
    getStatus(statusId) {
      return DECISION_CLASS_LIST[statusId];
    },
  },
  computed: {
    ...mapGetters({}),
    offers() {
      return this.$store.state.resolve.offers.filter((offer) => {
        console.log(offer.case_id);
        const isCase = offer.case_id === this.caseId;
        return isCase;
      });
    },
  },
  updated() {
    console.log("this.caseId: ", this.caseId);
  },
  // mounted() {
  //   this.getClaims();
  //   this.interval = setInterval(
  //     () => this.getClaims(this, this.$route.params.id),
  //     10000
  //   );
  // },
  // unmounted() {
  //   clearInterval(this.interval);
  // },
};
</script>

<style scoped></style>
