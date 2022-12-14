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
                    title="Setup &amp; Nominee Registration"
                    icon="settings"
                >
                    <p>
                        Admin is able to set the configuration parameters for
                        the smart contract, including election duration,
                        arbitration term length, and number of arbitration seats
                        to be filled.
                    </p>

                    <p>
                        There are currently
                        <strong>{{ arbSeatsAvailable }}</strong>
                        arbitration seats available
                    </p>
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
                    title="Candidate Registration"
                    icon="assignment"
                >
                    Nominees are able to add and remove themselves as an
                    official candidate to the upcoming election.
                </q-step>

                <q-step
                    :name="'election-ready'"
                    title="Election Ready to Start"
                    icon="assignment"
                >
                    Election is ready to start pending administration launch
                    <br /><br />
                    <q-btn
                        @click="
                            form = true;
                            formType = 'beginvoting';
                        "
                        color="primary"
                        label="Start Election"
                    />
                </q-step>

                <q-step :name="'voting'" title="Voting" icon="add_comment">
                    Users are able to vote for the candidate(s) of choice.
                </q-step>

                <q-step
                    :name="'election-finalization'"
                    title="Election Finalization"
                    icon="add_comment"
                >
                    Voting has completed and admin needs to execute
                    <strong>endelection</strong>
                    action to process the vote results and begin the arbitration
                    term for the winning candidates. Users will also be able to
                    start nominating themselves for the next election, whenever
                    that may happen to be.
                    <br /><br />
                    <q-btn
                        @click="endElection"
                        color="primary"
                        label="Finalize Election"
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
