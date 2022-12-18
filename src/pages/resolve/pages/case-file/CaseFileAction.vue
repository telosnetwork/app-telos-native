<template>
    <div class="case-file-action">
        <div v-if="act.name === 'readycase'">
            <i18n-t keypath="pages.resolve.case_action_readycase">
                <template #actor>
                    <strong>{{ authorization[0].actor }}</strong>
                </template>
                <template #id>
                    <strong>{{ actionData.case_id }}</strong>
                </template>
                <template #ready>
                    <strong>'ready'</strong>
                </template>
            </i18n-t>&nbsp; ({{
                action.timestamp
            }})
        </div>
        <div v-if="act.name === 'assigntocase'">
            <i18n-t keypath="pages.resolve.case_action_assign">
                <template #actor><strong>{{ authorization[0].actor }}</strong></template>
                <template #arbToAssign><strong>{{ actionData.arb_to_assign }}</strong></template>
            </i18n-t> ({{
                action.timestamp
            }})
        </div>
        <div v-if="act.name === 'respond'">
            <i18n-t keypath="pages.resolve.case_action_respond">
                <template #actor><strong>{{ authorization[0].actor }}</strong></template>
                <template #id><strong>{{ actionData.claim_id }}</strong></template>
                <template #link><a :href="createIpfsLink(actionData.response_link)">document</a></template>
            </i18n-t>
            ({{ action.timestamp }})
        </div>
        <div v-if="act.name === 'acceptclaim'">
            <i18n-t keypath="pages.resolve.case_action_accept">
                <template #actor><strong>{{ authorization[0].actor }}</strong></template>
                <template #id><strong>{{ actionData.claim_id }}</strong></template>
                <template #class><strong>{{ decisionClass(actionData.decision_class) }}</strong></template>
            </i18n-t>
            ({{ action.timestamp }})
        </div>
        <div v-if="act.name === 'execclaim'">
            <i18n-t keypath="pages.resolve.case_action_exec">
                <template #actor><strong>{{ authorization[0].actor }}</strong></template>
                <template #id><strong>{{ actionData.claim_id }}</strong></template>
            </i18n-t>
            ({{ action.timestamp }})
        </div>
        <div v-if="act.name === 'addclaim'">
            <i18n-t keypath="pages.resolve.case_action_add">
                <template #actor><strong>{{ authorization[0].actor }}</strong></template>
                <template #id><strong>{{ actionData.claim_id }}</strong></template>
            </i18n-t>
            ({{ action.timestamp }})
        </div>
        <div v-if="act.name === 'shredcase'">
            <i18n-t keypath="pages.resolve.case_action_shred">
                <template #actor><strong>{{ authorization[0].actor }}</strong></template>
                <template #id><strong>{{ actionData.claim_id }}</strong></template>
            </i18n-t>
            ({{ action.timestamp }})
        </div>
        <div v-if="act.name === 'makeoffer'">
            <i18n-t keypath="pages.resolve.case_action_make_offer">
                <template #actor><strong>{{ authorization[0].actor }}</strong></template>
                <template #hours><strong>{{ actionData.claim_id }}</strong><strong>{{ actionData.estimated_hours }}</strong></template>
                <template #rate><strong>{{ actionData.hourly_rate }}</strong></template>
            </i18n-t>({{
                action.timestamp
            }})
        </div>
        <div v-if="act.name === 'respondoffer'">
            <i18n-t keypath="pages.resolve.case_action_respond_offer">
                <template #actor><strong>{{ authorization[0].actor }}</strong></template>
                <template #accept>{{ actionData.accept ? $t('pages.resolve.accepted') : $t('pages.resolve.rejected') }}</template>
                <template #offer>
                    <span class="underline">
                        <i18n-t keypath="pages.resolve.case_action_respond_offer_inset">
                            <template #tooltip>
                                <q-tooltip>
                                    {{ getOfferSyntax(parseInt(actionData.offer_id)) }}
                                </q-tooltip>
                            </template>
                        </i18n-t>
                    </span>
                </template>
                <template #arbitrator>{{ getOffer(parseInt(actionData.offer_id)).arbitrator }}</template>
            </i18n-t>
            ({{
                action.timestamp
            }})
        </div>
        <div v-if="act.name === 'startcase'">
            <i18n-t keypath="pages.resolve.case_action_start">
                <template #actor><strong>{{ authorization[0].actor }}</strong></template>
                <template #days><strong>{{ actionData.number_days_respondant }}</strong></template>
            </i18n-t>
             ({{ action.timestamp }})
        </div>
        <div v-if="act.name === 'settleclaim'">
            <i18n-t keypath="pages.resolve.case_action_settle">
                <template #actor><strong>{{ authorization[0].actor }}</strong></template>
                <template #id><strong>{{ actionData.claim_id }}</strong></template>
                <template #link><a :href="createIpfsLink(actionData.decision_link)">decision</a></template>
            </i18n-t>
             ({{ action.timestamp }})
        </div>
        <div v-if="act.name === 'reviewclaim'">
            <i18n-t keypath="pages.resolve.case_action_review">
                <template #actor><strong>{{ authorization[0].actor }}</strong></template>
                <template #id><strong>{{ actionData.claim_id }}</strong></template>
                <template #claimInfo>
                    <span v-if="actionData.claim_info_needed">
                        &nbsp;{{$t('pages.resolve.case_action_review_claim_info', { daysClaimant: actionData.number_days_claimant})}}
                    </span>
                </template>
                <template #responseInfo>
                    <span v-if="actionData.response_info_needed">
                        &nbsp;{{$t('pages.resolve.case_action_review_response_info', { daysResponse: actionData.number_days_respondant})}}
                    </span>
                </template>
            </i18n-t>
            ({{ action.timestamp }})
        </div>
        <div v-if="act.name === 'updateclaim'">
            <i18n-t keypath="pages.resolve.case_action_update_claim">
                <template #actor><strong>{{ authorization[0].actor }}</strong></template>
                <template #id><strong>{{ actionData.claim_id }}</strong></template>
                <template #link><ipfs-link-2 :hash="actionData.claim_link" /></template>
            </i18n-t> ({{action.timestamp}})
        </div>
        <div v-if="act.name === 'setruling'">
            <i18n-t keypath="pages.resolve.case_action_set_ruling">
                <template #actor><strong>{{ authorization[0].actor }}</strong></template>
                <template #link><a :href="createIpfsLink(actionData.case_ruling)">ruled</a></template>
            </i18n-t>
            <strong>{{ authorization[0].actor }}</strong> (admin)
            <a :href="createIpfsLink(actionData.case_ruling)">{{$t('pages.resolve.ruled')}}</a> on case
            ({{ action.timestamp }})
        </div>
        <div v-if="act.name === 'validatecase'">
            <i18n-t keypath="pages.resolve.case_action_validate">
                <template #actor><strong>{{ authorization[0].actor }}</strong></template>
                <template #ruling><strong>{{ actionData.proceed ? $t('pages.resolve.validated') : $t('pages.resolve.rejected') }}</strong></template>
            </i18n-t>({{ action.timestamp }})
        </div>
        <div v-if="act.name === 'closecase'">
            <i18n-t keypath="pages.resolve.case_action_close">
                <template #actor><strong>{{ authorization[0].actor }}</strong></template>
                <template #close><strong>{{$t('pages.resolve.closed_case')}}</strong></template>
            </i18n-t>({{ action.timestamp }})
        </div>
    </div>
</template>

<script lang="ts">
import IpfsLink2 from '../../components/IpfsLink2.vue';
import { DECISION_CLASS_LIST } from '../../constants';
import { HyperionAct, Authorization } from '../../types';

export default {
    components: { IpfsLink2 },
    props: ['action', 'index', 'claims'],
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
        }
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
            const offer = this.offers.find(
                (offer: any) => offer.offer_id === id
            );
            return offer;
        },
        getOfferSyntax(id: number): any {
            const offer = this.getOffer(id);
            if (!offer) return null;
            return `${offer.arbitrator} estimated ${offer.estimated_hours} hours at ${offer.hourly_rate} per hour`;
        }
    }
};
</script>

<style lang="scss">
.case-file-action {
    margin-top: 14px;
    margin-bottom: 14px;

    .underline {
        text-decoration: underline;
    }

    .q-tooltip .offer-tooltip {
        font-size: 2rem;
        line-height: 2.2rem;
    }

    .q-tooltip {
        font-size: 1rem;
        line-height: 1rem;
    }
}
</style>