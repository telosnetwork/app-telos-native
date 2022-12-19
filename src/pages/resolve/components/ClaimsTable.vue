<template>
    <q-table
        id="claims-table"
        title="Claims"
        :rows="claims"
        :columns="columns"
        row-key="name"
    >
        <template v-slot:body-cell-status="props">
            <q-td :props="props">
                <span>&nbsp;{{ getStatus(props.row.status) }}</span>
            </q-td>
        </template>
        <template v-slot:body-cell-claim_summary="props">
            <q-td :props="props">
                <a
                    v-if="props.row.claim_summary"
                    :href="
                        `https://api.dstor.cloud/ipfs/${props.row.claim_summary}`
                    "
                    target="_blank"
                    >View</a
                >
                <q-badge
                    v-if="props.row.claim_info_needed"
                    rounded
                    color="red"
                    label="!"
                    align="top"
                >
                    <q-tooltip>{{$t('pages.resolve.claims_table_more_info_claimant')}}</q-tooltip>
                </q-badge>
            </q-td>
        </template>
        <template v-slot:body-cell-claimant_limit_time="props">
            <q-td :props="props">
                {{
                    props.row.claim_info_needed
                        ? new Date(
                              props.row.claimant_limit_time + 'Z'
                          ).toISOString()
                        : 'n/a'
                }}
            </q-td>
        </template>
        <template v-slot:body-cell-decision_link="props">
            <q-td :props="props">
                <a
                    v-if="props.row.decision_link"
                    :href="
                        `https://api.dstor.cloud/ipfs/${props.row.decision_link}`
                    "
                    target="_blank"
                    >{{$t('pages.resolve.claims_table_view')}}</a
                >
            </q-td>
        </template>
        <template v-slot:body-cell-response_link="props">
            <q-td :props="props">
                <a
                    v-if="props.row.response_link"
                    :href="
                        `https://api.dstor.cloud/ipfs/${props.row.response_link}`
                    "
                    target="_blank"
                    >{{$t('pages.resolve.claims_table_view')}}</a
                >
                <q-badge
                    v-if="props.row.response_info_needed"
                    rounded
                    color="red"
                    label="!"
                    align="top"
                >
                    <q-tooltip>{{$t('pages.resolve.claims_table_more_info_respondant')}}</q-tooltip>
                </q-badge>
            </q-td>
        </template>
        <template v-slot:body-cell-respondant_limit_time="props">
            <q-td :props="props">
                {{
                    props.row.response_info_needed
                        ? new Date(
                              props.row.respondant_limit_time + 'Z'
                          ).toISOString()
                        : 'n/a'
                }}
            </q-td>
        </template>
        <template v-slot:body-cell-claim_category="props">
            <q-td :props="props">
                <span>{{ getClaimCategory(props.row.claim_category) }}</span>
            </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
            <q-td :props="props">
                <q-btn-dropdown color="primary" :label="$t('pages.resolve.claims_table_actions')">
                    <q-list>
                        <q-item
                            v-if="
                                isRespondant() &&
                                    caseFile.case_status === 3 &&
                                    [1, 2].includes(props.row.status) &&
                                    props.row.response_info_needed
                            "
                            clickable
                            v-close-popup
                            @click="
                                form = true;
                                formType = 'respond';
                                claimId = props.row.claim_id;
                            "
                        >
                            <q-item-section>
                                <q-item-label>{{$t('pages.resolve.claims_table_respond_cta')}}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item
                            v-if="
                                isClaimant() &&
                                    [0, 3].includes(caseFile.case_status)
                            "
                            clickable
                            v-close-popup
                            @click="
                                form = true;
                                formType = 'updateclaim';
                                claimId = props.row.claim_id;
                            "
                        >
                            <q-item-section>
                                <q-item-label>
                                    {{$t('pages.resolve.claims_table_update')}}
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item
                            v-if="
                                isCaseArbitrator &&
                                    caseFile.case_status === 3 &&
                                    [1, 2].includes(props.row.status)
                            "
                            clickable
                            v-close-popup
                            @click="
                                form = true;
                                formType = 'reviewclaim';
                                claimId = props.row.claim_id;
                            "
                        >
                            <q-item-section>
                                <q-item-label>{{$t('pages.resolve.claims_table_request_more')}}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item
                            v-if="
                                !isPendingInfoNeeded(props.row) &&
                                    isCaseArbitrator &&
                                    caseFile.case_status === 3
                            "
                            clickable
                            v-close-popup
                            @click="
                                form = true;
                                formType = 'settleclaim';
                                claimId = props.row.claim_id;
                            "
                        >
                            <q-item-section>
                                <q-item-label>{{$t('pages.resolve.claims_table_settle_cta')}}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </q-td>
        </template>
    </q-table>
    <div class="case-file-modal-wrap">
        <q-dialog id="case-file-modal" v-model="form">
            <respond-claim-form
                v-if="formType === 'respond'"
                :caseId="$route.params.id"
                :claimId="claimId"
                :close="closeModal"
            />
            <update-claim-form
                v-if="formType === 'updateclaim'"
                :caseId="$route.params.id"
                :claimId="claimId"
                :close="closeModal"
            />
            <review-claim-form
                v-if="formType === 'reviewclaim'"
                :caseId="$route.params.id"
                :claimId="claimId"
                :close="closeModal"
            />
            <settle-claim-form
                v-if="formType === 'settleclaim'"
                :caseId="$route.params.id"
                :claimId="claimId"
                :close="closeModal"
            />
        </q-dialog>
    </div>
</template>

<script>
import { CLAIM_STATUS_LIST, CLAIM_CATEGORY_LIST } from '../constants/claim';
import RespondClaimForm from './RespondClaimForm.vue';
import UpdateClaimForm from './UpdateClaimForm.vue';
import ReviewClaimForm from './ReviewClaimForm.vue';
import SettleClaimForm from './SettleClaimForm.vue';
import { mapGetters } from 'vuex';

export default {
    props: ['caseId', 'caseFile', 'claims'],
    components: {
        RespondClaimForm,
        UpdateClaimForm,
        ReviewClaimForm,
        SettleClaimForm
    },
    data() {
        return {
            interval: null,
            form: false,
            claimId: null,
            formType: null,
            columns: [
                { name: 'claim_id',
                    label: this.$t('pages.resolve.claims_table_id'),
                    field: 'claim_id' },
                {
                    name: 'claim_summary',
                    label: this.$t('pages.resolve.claims_table_summary'),
                    field: 'claim_summary'
                },
                {
                    name: 'claimant_limit_time',
                    label: this.$t('pages.resolve.claims_table_claimant_deadline'),
                    field: 'claimant_limit_time'
                },
                {
                    name: 'claim_category',
                    label: this.$t('pages.resolve.claims_table_category'),
                    field: 'claim_category'
                },
                {
                    name: 'decision_link',
                    label: this.$t('pages.resolve.claims_table_decision'),
                    field: 'decision_link'
                },
                {
                    name: 'response_link',
                    label: this.$t('pages.resolve.claims_table_response'),
                    field: 'response_link'
                },
                {
                    name: 'respondant_limit_time',
                    label: this.$t('pages.resolve.claims_table_respoondant_deadline'),
                    field: 'respondant_limit_time'
                },
                { name: 'status', label: this.$t('pages.resolve.claims_table_status'), field: 'status' },
                { name: 'actions', label: this.$t('pages.resolve.claims_table_actions_column'), field: 'actions' }
            ]
        };
    },
    methods: {
        isClaimant() {
            if (!this.caseFile) return false;
            return this.account === this.caseFile.claimant;
        },
        isRespondant() {
            if (!this.caseFile) return false;
            return this.account === this.caseFile.respondant;
        },
        isPendingInfoNeeded(claim) {
            let isPending = false;
            if (claim.claim_info_needed) {
                const claimantDeadline = new Date(claim.claimant_limit_time);
                if (claimantDeadline > new Date()) {
                    isPending = true;
                }
            }
            if (claim.response_info_needed) {
                const responseDeadline = new Date(claim.respondant_limit_time);
                if (responseDeadline > new Date()) {
                    isPending = true;
                }
            }
            return isPending;
        },
        getClaimCategory(id) {
            return this.$t(CLAIM_CATEGORY_LIST[id]);
        },
        getStatus(statusId) {
            return this.$t(CLAIM_STATUS_LIST[statusId]);
        },
        closeModal() {
            this.form = false;
            this.formType = null;
            this.claimId = null;
        }
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        }),
        isCaseArbitrator() {
            return this.caseFile.arbitrators.includes(this.account);
        }
    }
};
</script>

<style lang="scss">
#claims-table {
    .q-tooltip {
        font-size: 1rem;
        line-height: 1rem;
    }
}
</style>