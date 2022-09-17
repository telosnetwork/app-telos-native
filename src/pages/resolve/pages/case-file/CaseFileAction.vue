<template>
  <div class="container">
    <div v-if="act.name === 'readycase'">
      <strong>{{ authorization[0].actor }}</strong> changed case
      <strong>{{ data.case_id }}</strong
      >'s status to <strong>'ready'</strong> at
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'assigntocase'">
      <strong>{{ authorization[0].actor }}</strong> assigned arbitrator
      <strong>{{ data.arb_to_assign }}</strong> to case
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'respond'">
      <strong>{{ authorization[0].actor }}</strong> responded to claim
      <strong>{{ data.claim_id }}</strong>
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'acceptclaim'">
      <strong>{{ authorization[0].actor }}</strong> changed claim
      <strong>{{ data.claim_id }}</strong> status to
      <strong>{{ decisionClass(data.decision_class) }}</strong>
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'execclaim'">
      <strong>{{ authorization[0].actor }}</strong> executed claim
      <strong>{{ data.claim_id }}</strong>
      {{ action.timestamp }}
    </div>
    <!-- {{ action.timestamp }}
    {{ action.timestamp }}
    {{ action.timestamp }}
    {{ action.timestamp }}
    {{ action.timestamp }} -->
  </div>
</template>

<script lang="ts">
import { DECISION_CLASS_LIST } from "../../constants";
import { HyperionAct, Authorization } from "../../types";

export default {
  props: ["action", "index"],
  computed: {
    act(): HyperionAct {
      return this.action.act;
    },
    authorization(): Authorization {
      return this.action.act.authorization;
    },
    data(): any {
      return this.action.act.data;
    },
  },
  methods: {
    decisionClass(type: number) {
      return DECISION_CLASS_LIST[type];
    },
  },
  mounted() {
    console.log(this.action);
  },
};
</script>

<style lang="scss" scoped>
.padding {
}
</style>
