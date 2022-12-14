<template>
    <div class="q-pa-md" v-if="nomineeData" id="resolve-nominees-table">
        <!-- <q-banner inline-actions class="text-white bg-red" v-if="isPastAddCandidates">
      Candidacy nomination period for current election has already passed
    </q-banner> -->
        <q-table
            title="Nominees"
            :rows="nomineeData"
            :columns="columns"
            row-key="name"
        >
            <template v-slot:top>
                <div class="header-wrap">
                    <div class="q-table__control">
                        <div class="q-table__title">Nominees</div>
                    </div>
                    <div class="header-buttons">
                        <div class="q-pa-md q-gutter-sm">
                            <q-btn
                                v-if="isNominateButtonVisible"
                                color="primary"
                                label="Nominate Self"
                                @click="nominate = true"
                            />
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:body-cell-nominee_name="props">
                <q-td :props="props">
                    <profile-avatar
                        :account_name="props.nominee_name"
                        size="24px"
                        childClass="profile-avatar"
                    ></profile-avatar>
                    <span>{{ props.row.nominee_name }}</span>
                </q-td>
            </template>
            <template v-slot:body-cell-credentials_link="props">
                <q-td :props="props">
                    <ipfs-link :hash="props.row.credentials_link">
                        {{ props.row.credentials_link }}
                    </ipfs-link>
                </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <q-btn-dropdown
                        color="primary"
                        label="Actions"
                        v-if="isUserNominee(props.row.nominee_name)"
                    >
                        <q-list>
                            <q-item
                                clickable
                                v-close-popup
                                @click="enterElection"
                                v-if="isEnterElectionButtonVisible"
                            >
                                <q-item-section>
                                    <q-item-label>Enter Election</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item
                                clickable
                                v-close-popup
                                @click="removeSelf"
                                v-if="isRemoveCandidateButtonVisible"
                            >
                                <q-item-section>
                                    <q-item-label>Remove</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                </q-td>
            </template>
        </q-table>
        <nominate-self-modal
            :dialogName="nominate"
            :close="closeModal"
        ></nominate-self-modal>
    </div>
</template>

<script>
import ProfileAvatar from 'src/pages/profiles/ProfileAvatar.vue';
import NominateSelfModal from './NominateSelfModal.vue';
import IpfsLink from './IpfsLink.vue';

export default {
    components: {
        ProfileAvatar,
        NominateSelfModal,
        IpfsLink
    },
    data() {
        return {
            nominate: false,
            columns: [
                {
                    name: 'nominee_name',
                    label: 'Nominee',
                    field: 'nominee_name'
                },
                {
                    name: 'credentials_link',
                    label: 'Credentials',
                    field: 'credentials_link'
                },
                {
                    name: 'application_time',
                    label: 'Applied',
                    field: 'application_time'
                },
                {
                    name: 'actions',
                    label: 'Actions',
                    field: 'actions'
                }
            ]
        };
    },
    methods: {
        isPastAddCandidates() {
            let result = false;
            const end = new Date(this.config.end_add_candidates_ts);
            const now = new Date();
            if (now > end) {
                result = true;
            }
            return result;
        },
        isUserNominee(nomineeName) {
            const account = this.$store.getters['accounts/account'];
            const isRowNominee = nomineeName === account;
            if (isRowNominee) return true;
            return false;
        },
        isRemoveSelfButtonVisible(nomineeName) {
            const account = this.$store.getters['accounts/account'];
            const isRowNominee = nomineeName === account;
            if (isRowNominee) return true;
            return false;
        },
        async removeSelf() {
            const unregNomineeActions = [
                {
                    account: 'testtelosarb',
                    name: 'unregnominee',
                    data: {
                        nominee: this.$store.getters['accounts/account']
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(unregNomineeActions);
            } catch (err) {
                console.log('removeSelf error: ', err);
            }
        },
        async enterElection() {
            const enterElectionAction = [
                {
                    account: 'testtelosarb',
                    name: 'candaddlead',
                    data: {
                        nominee: this.$store.getters['accounts/account']
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(enterElectionAction);
            } catch (err) {
                console.log('removeSelf error: ', err);
            }
        },
        closeModal() {
            this.nominate = false;
        }
    },
    computed: {
        isNominateButtonVisible() {
            if (!this.elections || !this.configData) return;
            const isAuthenticated = this.$store.getters[
                'accounts/isAuthenticated'
            ];
            const account = this.$store.getters['accounts/account'];
            const isAlreadyNominated = this.nomineeData.find(
                nominee => nominee.nominee_name === account
            );
            if (isAuthenticated && !isAlreadyNominated) {
                return true;
            }
            return false;
        },
        isEnterElectionButtonVisible() {
            if (!this.elections || !this.configData) return;
            const account = this.$store.getters['accounts/account'];
            const { current_election_id } = this.configData;
            const currentElection = this.elections.find(
                election => election.election_id === current_election_id
            );
            const isAlreadyCandidate = !!currentElection.candidates.find(
                candidateData => candidateData.name === account
            );
            const endAddCand = new Date(
                currentElection.end_add_candidates_ts
            ).getTime();
            const isPastAddCandidates = Date.now() > endAddCand;

            const isElectionCreated = currentElection.status === 1;
            if (
                isElectionCreated &&
                !isAlreadyCandidate &&
                !isPastAddCandidates
            ) {
                return true;
            }
            return false;
        },
        isRemoveCandidateButtonVisible() {
            if (!this.elections || !this.configData) return;
            const account = this.$store.getters['accounts/account'];
            const { current_election_id } = this.configData;
            const currentElection = this.elections[current_election_id];
            const isAlreadyCandidate = currentElection.candidates.find(
                candidateData => candidateData.name === account
            );
            const endAddCand = new Date(
                currentElection.end_add_candidates_ts
            ).getTime();
            const isPastAddCandidates = Date.now() > endAddCand;

            const isElectionCreated = currentElection.status === 1;
            if (
                isElectionCreated &&
                isAlreadyCandidate &&
                !isPastAddCandidates
            ) {
                return true;
            }
            return false;
        },
        nomineeData() {
            return this.$store.state.resolve.nominees || [];
        },
        configData() {
            return this.$store.state.resolve.config || [];
        },
        elections() {
            return this.$store.state.resolve.elections || [];
        }
    }
};
</script>

<style lang="scss">
#resolve-nominees-table {
    .header-wrap {
        display: flex;
        flex: 1;
        flex-direction: row;
        justify-content: space-between;
    }
    .header-buttons {
    }

    .profile-avatar {
        display: inline;
        margin-right: 8px;
    }
}
</style>
