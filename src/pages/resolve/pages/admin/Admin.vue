<template>
    <div v-if="isResolveStoresAvailable" id="resolve-admin-page">
        <div class="q-pa-md stepper-wrap">
            <q-stepper
                v-model="electionStatus"
                vertical
                color="primary"
                animated
            >
                <q-step
                    :name="3"
                    :title="$t('pages.resolve.admin_step_case_setup')"
                    icon="settings"
                >
                    <p>{{$t('pages.resolve.admin_step_case_content_1')}}</p>
                    <i18n-t keypath="pages.resolve.admin_step_case_content_2" tag="p">
                        <template v-slot:seats>
                            <strong>{{ arbSeatsAvailable }}</strong>
                        </template>
                    </i18n-t>
                    <q-btn
                        v-if="arbSeatsAvailable"
                        @click="
                            form = true;
                            formType = 'initelection';
                        "
                        color="primary"
                        label="Prepare Election"
                    />
                </q-step>

                <q-step
                    :name="'candidate-registration'"
                    :title="$t('pages.resolve.admin_step_cand_reg')"
                    icon="assignment"
                >
                    {{$t('pages.resolve.admin_step_cand_reg_content')}}
                </q-step>

                <q-step
                    :name="'election-ready'"
                    :title="$t('pages.resolve.admin_step_election_ready')"
                    icon="assignment"
                >
                    {{$t('pages.resolve.admin_step_election_ready_content')}}
                    <br /><br />
                    <q-btn
                        @click="
                            form = true;
                            formType = 'beginvoting';
                        "
                        color="primary"
                        :label="$t('pages.resolve.admin_step_election_ready_cta')"
                    />
                </q-step>

                <q-step :name="'voting'" :title="$t('pages.resolve.admin_step_voting')" icon="add_comment">
                    {{$t('admin_step_voting_content')}}
                </q-step>

                <q-step
                    :name="'election-finalization'"
                    :title="$t('pages.resolve.admin_step_election_finalization')"
                    icon="add_comment"
                >
                    <i18n-t keypath="pages.resolve.admin_step_election_finalization_content">
                        <template v-slot:endelection>
                            <strong>endelection</strong>
                        </template>
                    </i18n-t>
                    <br /><br />
                    <q-btn
                        @click="endElection"
                        color="primary"
                        :label="$t('pages.resolve.admin_step_election_finalization_cta')"
                    />
                </q-step>
            </q-stepper>
        </div>
        <div class="form-wrapper">
            <q-dialog v-model="form">
                <init-election-modal
                    v-if="formType === 'initelection'"
                    :close="closeModal"
                />
                <begin-voting-modal
                    v-if="formType === 'beginvoting'"
                    :close="closeModal"
                />
            </q-dialog>
        </div>
    </div>
</template>

<script>
import InitElectionModal from '../../components/InitElectionModal.vue';
import BeginVotingModal from '../../components/BeginVotingModal.vue';
import { mapGetters } from 'vuex';

export default {
    components: {
        InitElectionModal,
        BeginVotingModal
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
                    account: 'testtelosarb',
                    name: 'endelection',
                    data: {}
                }
            ];
            try {
                await this.$store.$api.signTransaction(endElectionActions);
            } catch (err) {
                console.log('endElection error: ', err);
            }
        }
    },
    computed: {
        ...mapGetters({
            arbSeatsAvailable: 'resolve/arbSeatsAvailable',
            isResolveStoresAvailable: 'resolve/isResolveStoresAvailable'
        }),
        electionStatus() {
            const resolve = this.$store.state.resolve;
            if (resolve && resolve.config && resolve.elections) {
                const { current_election_id } = resolve;
                const currentElection = resolve.elections.find(
                    e => e.id === current_election_id
                );
                if (!currentElection) return null;
                const {
                    status,
                    end_voting_ts,
                    end_add_candidates_ts
                } = currentElection;
                if (status === 1) {
                    const endAddCandidateUnixTimestamp = new Date(
                        `${end_add_candidates_ts}Z`
                    ).getTime();
                    const rightNow = new Date().getTime();
                    if (endAddCandidateUnixTimestamp > rightNow) {
                        return 'candidate-registration';
                    } else {
                        return 'election-ready';
                    }
                }
                if (status === 2) {
                    // see if voting period has ended
                    const endVotingUnixTimestamp = new Date(
                        `${end_voting_ts}Z`
                    ).getTime();
                    const rightNow = new Date().getTime();
                    if (endVotingUnixTimestamp > rightNow) {
                        return 'voting';
                    } else {
                        return 'election-finalization';
                    }
                }
                return status;
            }
            return null;
        }
    },
    mounted() {}
};
</script>

<style lang="scss">
#resolve-admin-page {
    display: flex;
    flex-direction: row;

    .stepper-wrap {
        flex: 1;
    }
    .form-wrapper {
        flex: 1;
    }
}
</style>