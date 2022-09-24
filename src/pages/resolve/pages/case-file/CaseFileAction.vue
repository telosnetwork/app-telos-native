<template>
  <div class="container">
    <div v-if="act.name === 'readycase'">
      <strong>{{ authorization[0].actor }}</strong> changed case
      <strong>{{ actionData.case_id }}</strong
      >'s status to <strong>'ready'</strong> at
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'assigntocase'">
      <strong>{{ authorization[0].actor }}</strong> assigned arbitrator
      <strong>{{ actionData.arb_to_assign }}</strong> to case
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'respond'">
      <strong>{{ authorization[0].actor }}</strong> responded to claim
      <strong>{{ actionData.claim_id }}</strong>
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'acceptclaim'">
      <strong>{{ authorization[0].actor }}</strong> changed claim
      <strong>{{ actionData.claim_id }}</strong> status to
      <strong>{{ decisionClass(actionData.decision_class) }}</strong>
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'execclaim'">
      <strong>{{ authorization[0].actor }}</strong> executed claim
      <strong>{{ actionData.claim_id }}</strong>
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'addclaim'">
      <strong>{{ authorization[0].actor }}</strong> added claim
      <strong>{{ actionData.claim_id }}</strong>
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'shredcase'">
      <strong>{{ authorization[0].actor }}</strong> shredded the case
      <strong>{{ actionData.claim_id }}</strong>
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
      // @ts-ignore
      return this.action.act;
    },
    authorization(): Authorization {
      // @ts-ignore
      return this.action.act.authorization;
    },
    actionData(): any {
      // @ts-ignore
      return this.action.act.data;
    },
  },
  methods: {
    decisionClass(type: number) {
      return DECISION_CLASS_LIST[type];
    },
  },
  mounted() {
    // @ts-ignore
    console.log(this.action);
  },
};
</script>

<style lang="scss" scoped>
.padding {
}
</style>
