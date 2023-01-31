<template>
    <div id="resolve-election-steps">
        <div class="q-py-md stepper-wrap">
            <q-stepper
                v-model="electionStatus"
                vertical
                color="primary"
                animated
            >
                <q-step :name="3" :title="$t('pages.resolve.election_steps_register_title')" icon="settings">
                    {{$t('pages.resolve.election_steps_register_content')}}
                    <br /><br />
                    <q-btn
                        v-if="isAddNomineeButtonVisible"
                        @click="
                            form = true;
                            formType = 'nominate-self';
                        "
                        color="primary"
                        :label="$t('pages.resolve.election_steps_nominate_self')"
                    />
                    <q-btn
                        v-if="isRemoveNomineeButtonVisible"
                        color="primary"
                        :label="$t('pages.resolve.election_steps_remove_nomination')"
                        @click="removeSelfNomination"
                    />
                </q-step>

                <q-step
                    :name="'candidate-registration'"
                    :title="$t('pages.resolve.election_steps_candidate_registration')"
                    icon="assignment"
                >
                    {{$t('pages.resolve.election_steps_candidate_registration_content')}}
                    <br /><br />
                    <q-btn
                        v-if="isRegisterCandidateButtonVisible"
                        @click="registerSelfCandidate"
                        color="primary"
                        :label="$t('pages.resolve.election_steps_register_candidate_cta')"
                    />&nbsp;
                    <q-btn
                        v-if="isRemoveCandidacyButtonVisible"
                        @click="removeSelfCandidacy"
                        color="primary"
                        :label="$t('pages.resolve.election_steps_remove_candidacy')"
                    />&nbsp;
                    <q-btn
                        v-if="isAddNomineeButtonVisible"
                        @click="
                            form = true;
                            formType = 'nominate-self';
                        "
                        color="primary"
                        :label="$t('pages.resolve.election_steps_nominate_self')"
                    />&nbsp;
                    <q-btn
                        v-if="isRemoveNomineeButtonVisible"
                        @click="removeSelfNomination"
                        color="primary"
                        :label="$t('pages.resolve.election_steps_remove_nomination')"
                    />
                </q-step>

                <q-step
                    :name="'election-ready'"
                    :title="$t('pages.resolve.election_steps_ready')"
                    icon="assignment"
                >
                    {{$t('pages.resolve.election_steps_pending')}}
                </q-step>

                <q-step :name="'voting'" :title="$t('pages.resolve.election_steps_voting_title')" icon="add_comment">
                    {{$t('pages.resolve.election_steps_voting_content')}}
                </q-step>
                <q-step
                    :name="'election-finalization'"
                    :title="$t('pages.resolve.election_steps_arbitration_title')"
                    icon="add_comment"
                >
                    <i18n-t keypath="pages.resolve.election_steps_arbitration_content">
                        <template #endElection>
                            <strong>endelection</strong>
                        </template>
                    </i18n-t>
                    <br /><br />
                    <q-btn
                        @click="$router.push('/resolve/cases')"
                        color="primary"
                        :label="$t('pages.resolve.election_steps_view_cases_cta')"
                    />
                </q-step>
            </q-stepper>
        </div>
        <div class="form-wrapper" persistent>
            <q-dialog v-model="form">
                <nominate-self-modal
                    v-if="formType === 'nominate-self'"
                    :close="closeModal"
                />
            </q-dialog>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NominateSelfModal from '../../components/NominateSelfModal.vue';
import { IS_TIME_PASSED } from '../../util';
import { getAvailableArbitratorStatus } from '../../util/blockchain';

export default {
    components: {
        NominateSelfModal
    },
    data() {
        return {
            form: null,
            formType: null
        };
    },
    methods: {
        closeModal() {
            this.form = null;
        },
        async endElection() {
            const endElectionActions = [
                {
                    account: process.env.ARB_CONTRACT,
                    name: 'endelection'
                }
            ];
            try {
                await this.$store.$api.signTransaction(endElectionActions);
            } catch (err) {
                console.log('endElection error: ', err);
            }
        },
        async removeSelfNomination() {
            const { account } = this.$store.state.accounts;
            const removeSelfNominationActions = [
                {
                    account: process.env.ARB_CONTRACT,
                    name: 'unregnominee',
                    data: {
                        nominee: account
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(
                    removeSelfNominationActions
                );
            } catch (err) {
                console.log('removeSelfNomination error: ', err);
            }
        },
        async registerSelfCandidate() {
            const { account } = this.$store.state.accounts;
            const registerSelfCandidacyActions = [
                {
                    account: process.env.ARB_CONTRACT,
                    name: 'candaddlead',
                    data: {
                        nominee: account
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(
                    registerSelfCandidacyActions
                );
            } catch (err) {
                console.log('registerSelfCandidate error: ', err);
            }
        },
        async removeSelfCandidacy() {
            const { account } = this.$store.state.accounts;
            const removeCandidacyActions = [
                {
                    account: process.env.ARB_CONTRACT,
                    name: 'candrmvlead',
                    data: {
                        nominee: account
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(removeCandidacyActions);
            } catch (err) {
                console.log('removeSelfCandidacy error: ', err);
            }
        },
        getArbStatus: arb => getAvailableArbitratorStatus(arb)
    },
    computed: {
        ...mapGetters({
            currentElection: 'resolve/getCurrentElection',
            account: 'accounts/account'
        }),
        isAddNomineeButtonVisible() {
            if (!this.account) return false;
            // already nominee
            const {
                resolve: { nominees, arbitrators }
            } = this.$store.state;
            // is already a nominee
            const foundNominee = nominees.find(
                nominee => nominee.nominee_name === this.account
            );
            // this account already an active arbitrator
            const foundUnavailableArbitrator = arbitrators.find(
                arb => [1, 2].includes(arb) && arb.arb === this.account
            );
            return !foundNominee && !foundUnavailableArbitrator;
        },
        isRemoveNomineeButtonVisible() {
            // needs to be in nominees table but not elections candidate
            const {
                resolve: { nominees }
            } = this.$store.state;
            const foundNominee = nominees.find(
                nominee => nominee.nominee_name === this.account
            );
            const foundCandidate = this.currentElection.candidates.find(
                candidate => candidate.name === this.account
            );
            if (foundNominee && !foundCandidate) return true;
            return false;
        },
        isRemoveCandidacyButtonVisible() {
            // needs to be in nominees table but not elections candidate
            const foundCandidate = this.currentElection.candidates.find(
                candidate => candidate.name === this.account
            );
            if (foundCandidate) return true;
            return false;
        },
        isRegisterCandidateButtonVisible() {
            const { resolve } = this.$store.state;
            const { nominees } = resolve;
            const { candidates } = this.currentElection;
            const foundNominee = nominees.find(
                nominee => nominee.nominee_name === this.account
            );
            const foundCandidate = candidates.find(
                candidate => candidate.name === this.account
            );
            return !!this.account && foundNominee && !foundCandidate;
        },
        electionStatus() {
            const { resolve } = this.$store.state;
            if (resolve && resolve.config && resolve.elections) {
                const {
                    status,
                    end_voting_ts,
                    end_add_candidates_ts
                } = this.currentElection;
                if (status === 1) {
                    return (IS_TIME_PASSED(end_add_candidates_ts) ? 'election-ready' : 'candidate-registration');
                }
                if (status === 2) {
                    // see if voting period has ended
                    return (IS_TIME_PASSED(end_voting_ts) ? 'election-finalization' : 'voting');
                }
                return status;
            }
            return null;
        }
    }
};
</script>

<style lang="scss">
#resolve-election-steps {
    display: flex;
    flex-direction: row;

    .stepper-wrap {
        flex: 1;
    }
}
</style>
