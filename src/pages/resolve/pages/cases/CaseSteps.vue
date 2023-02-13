<template>
    <div id="#resolve-case-steps">
        <div class="q-pa-md stepper-wrap">
            <q-stepper v-model="caseStatus" vertical color="primary" animated>
                <q-step :name="0" :title="$t('pages.resolve.case_steps_setup_title')" icon="settings">
                    {{$t('pages.resolve.case_steps_setup_content')}}
                    <br /><br />
                    <q-btn
                        v-if="isClaimant"
                        @click="
                            form = true;
                            formType = 'readycase';
                        "
                        color="primary"
                        :label="$t('pages.resolve.case_steps_ready')"
                    />&nbsp;
                </q-step>

                <q-step
                    :name="1"
                    :title="$t('pages.resolve.case_steps_awaiting_title')"
                    icon="assignment"
                >
                    {{$t('pages.resolve.case_steps_awaiting_content')}}
                    <br /><br />
                    <q-btn
                        v-if="
                            canArbitratorSubmitOffer() &&
                                (!existingArbOffer ||
                                    existingArbOffer.status === 1)
                        "
                        @click="
                            form = true;
                            formType = 'makeoffer';
                        "
                        color="primary"
                        :label="
                            canArbitratorSubmitOffer() === 'new'
                                ? $t('pages.resolve.case_steps_submit_offer')
                                : $t('pages.resolve.case_steps_update_offer')
                        "
                    />&nbsp;
                    <q-btn
                        v-if="existingArbOffer && existingArbOffer.status === 1"
                        @click="
                            form = true;
                            formType = 'dismissoffer';
                        "
                        color="red"
                        :label="$t('pages.resolve.case_steps_dismiss_offer')"
                    />
                    <br /><br />
                    <offers-table
                        :caseId="caseFile.case_id"
                        :caseFile="caseFile"
                    />
                </q-step>

                <q-step
                    :name="2"
                    :title="$t('pages.resolve.case_steps_assigned_title')"
                    icon="assignment"
                >
                    {{$t('pages.resolve.case_steps_assigned_content')}}
                    <br /><br />
                    <q-btn
                        v-if="isCaseArbitrator()"
                        @click="
                            form = true;
                            formType = 'startcase';
                        "
                        color="primary"
                        :label="$t('pages.resolve.case_steps_start')"
                    />
                </q-step>

                <q-step :name="3" :title="$t('pages.resolve.case_steps_investigation_title')" icon="add_comment">
                    {{$t('pages.resolve.case_steps_investigation_content')}}
                    <br /><br />
                    <q-btn
                        v-if="
                            isCaseArbitrator() &&
                                caseFile.case_status === 3 &&
                                areAllClaimsSettled
                        "
                        @click="
                            form = true;
                            formType = 'setruling';
                        "
                        color="primary"
                        :label="$t('pages.resolve.case_steps_finalize_title')"
                    />
                </q-step>

                <q-step :name="4" :title="$t('pages.resolve.case_steps_decision_title')" icon="add_comment">
                    <i18n-t keypath="pages.resolve.case_steps_decision_content">
                        <template #dismissed>
                            <strong>{{$t('pages.resolve.case_steps_dismissed')}}</strong>
                        </template>
                    </i18n-t><br /><br />
                    <q-btn
                        v-if="isResolveAdmin"
                        @click="validateCase(true)"
                        color="primary"
                        :label="$t('pages.resolve.case_steps_approve')"
                    />&nbsp;
                    <q-btn
                        v-if="isResolveAdmin"
                        @click="validateCase(false)"
                        color="red"
                        :label="$t('pages.resolve.case_steps_reject')"
                    />
                </q-step>

                <q-step :name="5" :title="$t('pages.resolve.case_steps_enforce_title')" icon="add_comment">
                    {{$t('pages.resolve.case_steps_enforce_content')}}<br /><br />
                    <q-btn
                        v-if="isResolveAdmin"
                        @click="closeCase"
                        color="primary"
                        :label="$t('pages.resolve.case_steps_close_cta')"
                    />
                </q-step>

                <q-step :name="6" :title="$t('pages.resolve.case_steps_case_closed')" icon="add_comment">
                </q-step>
            </q-stepper>
        </div>
        <div class="form-wrapper" persistent>
            <q-dialog v-model="form">
                <ready-case-form
                    v-if="formType === 'readycase'"
                    :caseId="caseFile.case_id"
                    :close="closeModal"
                />
                <make-offer-form
                    v-if="formType === 'makeoffer'"
                    :caseId="caseFile.case_id"
                    :close="closeModal"
                />
                <dismiss-offer-form
                    v-if="formType === 'dismissoffer'"
                    :caseId="caseFile.case_id"
                    :close="closeModal"
                />
                <start-case-form
                    v-if="formType === 'startcase'"
                    :caseId="caseFile.case_id"
                    :close="closeModal"
                />
                <set-ruling-form
                    v-if="formType === 'setruling'"
                    :caseId="caseFile.case_id"
                    :close="closeModal"
                />
            </q-dialog>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ReadyCaseForm from '../../components/ReadyCaseForm.vue';
import MakeOfferForm from '../../components/MakeOfferForm.vue';
import OffersTable from '../../components/OffersTable.vue';
import DismissOfferForm from '../../components/DismissOfferForm.vue';
import StartCaseForm from '../../components/StartCaseForm.vue';
import SetRulingForm from '../../components/SetRulingForm.vue';

export default {
    props: ['caseFile', 'claims'],
    components: {
        ReadyCaseForm,
        MakeOfferForm,
        OffersTable,
        DismissOfferForm,
        StartCaseForm,
        SetRulingForm
    },
    data() {
        return {
            form: null,
            formType: null
        };
    },
    computed: {
        ...mapGetters({
            isResolveAdmin: 'resolve/isResolveAdmin',
            isArbitrator: 'resolve/isArbitrator',
            account: 'accounts/account'
        }),
        caseStatus() {
            return this.caseFile.case_status;
        },
        isClaimant() {
            return this.account === this.caseFile.claimant;
        },
        existingArbOffer() {
            return this.$store.state.resolve.offers.find(
                offer =>
                    offer.case_id === this.caseFile.case_id &&
                    offer.arbitrator === this.account
            );
        },
        areAllClaimsSettled() {
            return this.claims.every(claim => ![1, 2].includes(claim.status));
        }
    },
    methods: {
        closeModal() {
            this.form = null;
        },
        isCaseArbitrator() {
            return this.caseFile.arbitrators.includes(this.account);
        },
        canArbitratorSubmitOffer() {
            // is arbitrator available
            if (!this.isArbitrator) return false;
            if (this.caseFile.case_status !== 1) return false;
            const arbitrators = this.$store.state.resolve.arbitrators;
            const foundArbitrator = arbitrators.find(
                arb => arb.arb === this.account
            );
            if (foundArbitrator.arb_status !== 1) return false;
            if (
                this.caseFile.claimant === this.account ||
                this.caseFile.respondant === this.account
            )
                return false;
            if (this.existingArbOffer) {
                return 'update';
            }
            return 'new';
        },
        async startCase() {
            const startCaseActions = [
                {
                    account: process.env.ARB_CONTRACT,
                    name: 'startcase',
                    data: {
                        case_id: this.caseFile.case_id,
                        assigned_arb: this.account
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(startCaseActions);
            } catch (err) {
                console.log('endElection error: ', err);
            }
        },
        async validateCase(isProceed) {
            const validateCaseActions = [
                {
                    account: process.env.ARB_CONTRACT,
                    name: 'validatecase',
                    data: {
                        case_id: this.caseFile.case_id,
                        proceed: isProceed
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(validateCaseActions);
            } catch (err) {
                console.log('endElection error: ', err);
            }
        },
        async closeCase() {
            const validateCaseActions = [
                {
                    account: process.env.ARB_CONTRACT,
                    name: 'closecase',
                    data: {
                        case_id: this.caseFile.case_id
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(validateCaseActions);
            } catch (err) {
                console.log('endElection error: ', err);
            }
        }
    }
};
</script>

<style lang="scss">
#resolve-case-steps {
    display: flex;
    flex-direction: row;

    .stepper-wrap {
        flex: 1;
    }
}
</style>