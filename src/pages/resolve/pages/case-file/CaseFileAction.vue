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
    <div v-if="act.name === 'makeoffer'">
      <strong>{{ authorization[0].actor }}</strong> made offer with estimate
      <strong>{{ actionData.estimated_hours }}</strong> hours at
      <strong>{{ actionData.hourly_rate }}</strong> per hour at
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'respondoffer'">
      <strong>{{ authorization[0].actor }}</strong
      >&nbsp;
      <strong>{{ actionData.accept ? "accepted" : "rejected" }}</strong> offer
      at
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'startcase'">
      <strong>{{ authorization[0].actor }}</strong
      >&nbsp; <strong>started case</strong>, giving respondant
      <strong>{{ actionData.number_days_respondant }}</strong> days to respond
      to claims at
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'settleclaim'">
      <strong>{{ authorization[0].actor }}</strong
      >&nbsp; settled claim <strong>{{ actionData.claim_id }}</strong> with
      <a href="createIpfsLink(actionData.decision_link)">decision</a> at
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'setruling'">
      <strong>{{ authorization[0].actor }}</strong> (admin)
      <a href="createIpfsLink(actionData.case_ruling)">ruled</a> on case at
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'validatecase'">
      <strong>{{ authorization[0].actor }}</strong> (admin)
      <strong>{{ actionData.proceed ? "validated" : "rejected" }}</strong> case
      at
      {{ action.timestamp }}
    </div>
    <div v-if="act.name === 'closecase'">
      <strong>{{ authorization[0].actor }}</strong
      >&nbsp; <strong>closed case</strong> at
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
    createIpfsLink(hash: string) {
      return `https://api.dstor.cloud/ipfs/${hash}`;
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
