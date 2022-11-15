<template>
  <div class="container">
    <div v-if="act.name === 'readycase'">
      <strong>{{ authorization[0].actor }}</strong> changed case
      <strong>{{ actionData.case_id }}</strong
      >'s status to <strong>'ready'</strong>&nbsp; ({{ action.timestamp }})
    </div>
    <div v-if="act.name === 'assigntocase'">
      <strong>{{ authorization[0].actor }}</strong> assigned arbitrator
      <strong>{{ actionData.arb_to_assign }}</strong> to case ({{
        action.timestamp
      }})
    </div>
    <div v-if="act.name === 'respond'">
      <strong>{{ authorization[0].actor }}</strong> responded to claim
      <strong>{{ actionData.claim_id }}</strong> with
      <a :href="createIpfsLink(actionData.response_link)">document</a>
      ({{ action.timestamp }})
    </div>
    <div v-if="act.name === 'acceptclaim'">
      <strong>{{ authorization[0].actor }}</strong> changed claim
      <strong>{{ actionData.claim_id }}</strong> status to
      <strong>{{ decisionClass(actionData.decision_class) }}</strong>
      ({{ action.timestamp }})
    </div>
    <div v-if="act.name === 'execclaim'">
      <strong>{{ authorization[0].actor }}</strong> executed claim
      <strong>{{ actionData.claim_id }}</strong>
      ({{ action.timestamp }})
    </div>
    <div v-if="act.name === 'addclaim'">
      <strong>{{ authorization[0].actor }}</strong> added claim
      <strong>{{ actionData.claim_id }}</strong>
      ({{ action.timestamp }})
    </div>
    <div v-if="act.name === 'shredcase'">
      <strong>{{ authorization[0].actor }}</strong> shredded the case
      <strong>{{ actionData.claim_id }}</strong>
      ({{ action.timestamp }})
    </div>
    <div v-if="act.name === 'makeoffer'">
      <strong>{{ authorization[0].actor }}</strong> made offer with estimate
      <strong>{{ actionData.estimated_hours }}</strong> hours at
      <strong>{{ actionData.hourly_rate }}</strong> per hour ({{
        action.timestamp
      }})
    </div>
    <div v-if="act.name === 'respondoffer'">
      <strong>{{ authorization[0].actor }}</strong
      >&nbsp; {{ actionData.accept ? "accepted" : "rejected" }}
      <span class="underline"
        >offer<q-tooltip>
          {{ getOfferSyntax(parseInt(actionData.offer_id)) }}
        </q-tooltip></span
      >
      from {{ getOffer(parseInt(actionData.offer_id)).arbitrator }} ({{
        action.timestamp
      }})
    </div>
    <div v-if="act.name === 'startcase'">
      <strong>{{ authorization[0].actor }}</strong>
      started case, giving respondant
      <strong>{{ actionData.number_days_respondant }}</strong> days to respond
      to claims ({{ action.timestamp }})
    </div>
    <div v-if="act.name === 'settleclaim'">
      <strong>{{ authorization[0].actor }}</strong> settled claim
      <strong>{{ actionData.claim_id }}</strong> with
      <a :href="createIpfsLink(actionData.decision_link)">decision</a> ({{
        action.timestamp
      }})
    </div>
    <div v-if="act.name === 'reviewclaim'">
      <strong>{{ authorization[0].actor }}</strong> reviewed claim
      <strong>{{ actionData.claim_id }}</strong
      >.
      <span v-if="actionData.claim_info_needed"
        >&nbsp;Claimant has {{ actionData.number_days_claimant }} days to
        provide more information.</span
      >&nbsp;
      <span v-if="actionData.response_info_needed"
        >&nbsp;Respondant has {{ actionData.number_days_respondant }} days to
        provide more information.</span
      >
      ({{ action.timestamp }})
    </div>
    <div v-if="act.name === 'updateclaim'">
      <strong>{{ authorization[0].actor }}</strong> updated claim
      <strong>{{ actionData.claim_id }}</strong> with document
      <ipfs-link-2 :hash="actionData.claim_link" /> ({{ action.timestamp }})
    </div>
    <div v-if="act.name === 'setruling'">
      <strong>{{ authorization[0].actor }}</strong> (admin)
      <a :href="createIpfsLink(actionData.case_ruling)">ruled</a> on case ({{
        action.timestamp
      }})
    </div>
    <div v-if="act.name === 'validatecase'">
      <strong>{{ authorization[0].actor }}</strong> (admin)
      <strong>{{ actionData.proceed ? "validated" : "rejected" }}</strong> case
      ({{ action.timestamp }})
    </div>
    <div v-if="act.name === 'closecase'">
      <strong>{{ authorization[0].actor }}</strong
      >&nbsp;<strong>closed case</strong> ({{ action.timestamp }})
    </div>
    <!-- {{ action.timestamp }}
    {{ action.timestamp }}
    {{ action.timestamp }}
    {{ action.timestamp }}
    {{ action.timestamp }} -->
  </div>
</template>

<script lang="ts">
import IpfsLink from "../../components/IpfsLink.vue";
import IpfsLink2 from "../../components/IpfsLink2.vue";
import { DECISION_CLASS_LIST } from "../../constants";
import { HyperionAct, Authorization } from "../../types";

export default {
  components: { IpfsLink, IpfsLink2 },
  props: ["action", "index", "claims"],
  computed: {
    offers(): any {
      // @ts-ignore
      return this.$store.state.resolve.offers;
    },
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
    // @ts-ignore
    getOffer(id: number): any {
      // @ts-ignore
      if (!this.offers) return null;
      // @ts-ignore
      const offer = this.offers.find((offer: any) => offer.offer_id === id);
      return offer;
    },
    getOfferSyntax(id: number): any {
      const offer = this.getOffer(id);
      if (!offer) return null;
      return `${offer.arbitrator} estimated ${offer.estimated_hours} hours at ${offer.hourly_rate} per hour`;
    },
  },
};
</script>

<style lang="scss" scoped>
.padding {
}

.underline {
  text-decoration: underline;
}

.q-tooltip .offer-tooltip {
  font-size: 2rem;
  line-height: 2.2rem;
}
</style>
