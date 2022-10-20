<template>
  <div class="container">
    <q-chip
      v-if="getArbitratorStatus(arbitrator) === 1"
      text-color="white"
      color="primary"
      >{{ getStatusText(getArbitratorStatus(arbitrator)) }}</q-chip
    >
    <q-chip
      v-if="getArbitratorStatus(arbitrator) === 2"
      text-color="white"
      color="orange"
      >{{ getStatusText(getArbitratorStatus(arbitrator)) }}</q-chip
    >
    <q-chip
      v-if="getArbitratorStatus(arbitrator) === 3"
      text-color="white"
      color="red"
      >{{ getStatusText(getArbitratorStatus(arbitrator)) }}</q-chip
    >
    <q-chip
      v-if="getArbitratorStatus(arbitrator) === 4"
      text-color="white"
      color="deep-orange"
      >{{ getStatusText(getArbitratorStatus(arbitrator)) }}</q-chip
    >
  </div>
</template>

<script lang="ts">
import { ARBITRATOR_STATUS_LIST } from "../constants";
import { Arbitrator } from "../types";
export default {
  props: ["arbitrator"],
  computed: {},
  methods: {
    getStatusText(status: number) {
      return ARBITRATOR_STATUS_LIST[status];
    },
    getArbitratorStatus(arbitrator: Arbitrator) {
      console.log("arbitrator", JSON.parse(JSON.stringify(arbitrator)));
      if (
        // @ts-ignore
        new Date(this.arbitrator.term_expiration + "Z") < new Date() &&
        // @ts-ignore
        [1, 2].includes(this.arbitrator.arb_status)
      ) {
        return 4;
      }
      return arbitrator.arb_status;
    },
  },
  mounted() {
    // @ts-ignore
    console.log(
      "this.arbitrator.term_expiration",
      // @ts-ignore
      JSON.parse(JSON.stringify(this.arbitrator))
    );
  },
};
</script>

<style scoped>
.container {
  display: inline;
}
</style>
