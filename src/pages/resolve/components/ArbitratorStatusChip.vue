<template>
  <div class="arbitrator-status-chip">
    <q-chip
      v-if="getArbitratorStatus(arbitrator) === 1"
      text-color="white"
      color="primary"
    >
      <a href="/resolve/arbitrator">
        {{ getStatusText(getArbitratorStatus(arbitrator)) }}
      </a>
    </q-chip>
    <q-chip
      v-if="getArbitratorStatus(arbitrator) === 2"
      text-color="white"
      color="orange"
    >
      <a href="/resolve/arbitrator">
        {{ getStatusText(getArbitratorStatus(arbitrator)) }}
      </a>
    </q-chip>
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

<script>
import { mapGetters } from "vuex";
import { ARBITRATOR_STATUS_LIST } from "../constants";
import { getAvailableArbitratorStatus } from "../util";

export default {
  props: ["arbitrator"],
  computed: {
    ...mapGetters({
      account: "accounts/account",
    }),
  },
  methods: {
    getStatusText(status) {
      // @ts-ignore
      return this.$t(ARBITRATOR_STATUS_LIST[status]);
    },
    getArbitratorStatus: getAvailableArbitratorStatus,
  },
};
</script>

<style lang="scss">
.arbitrator-status-chip {
  display: inline;
}
</style>
