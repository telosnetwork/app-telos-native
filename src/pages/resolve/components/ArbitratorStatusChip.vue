<template>
  <div class="container">
    <q-chip v-if="statusIndex === 1" text-color="white" color="primary"
      >Available</q-chip
    >
    <q-chip v-if="statusIndex === 2" text-color="white" color="orange"
      >Unavailable</q-chip
    >
    <q-chip v-if="statusIndex === 3" text-color="white" color="red"
      >Removed</q-chip
    >
    <q-chip v-if="statusIndex === 4" text-color="white" color="deep-orange"
      >Expired</q-chip
    >
  </div>
</template>

<script lang="ts">
import { ARBITRATOR_STATUS_LIST } from "../constants";
export default {
  props: ["statusIndex"],
  computed: {
    arbitrators(): any[] {
      // @ts-ignore
      return this.$store.state.resolve.arbitrators || [];
    },
  },
  methods: {
    getArbitratorStatus(index: number) {
      return ARBITRATOR_STATUS_LIST[index];
    },
  },
  mounted() {
    console.log("hi");
    // @ts-ignore
    console.log("this.statusIndex", this.statusIndex);
  },
};
</script>

<style scoped>
.container {
  display: inline;
}
</style>
