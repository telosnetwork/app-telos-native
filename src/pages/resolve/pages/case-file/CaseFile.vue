<template>
    <div
        v-if="isResolveStoresAvailable && caseFile"
        id="#resolve-case-file-page"
    >
        <div class="row">
            <div class="part">
                <intro-card heading="Case Summary">
                    <p>
                        <strong>{{ caseFile.claimant }}</strong> is the
                        claimant, with
                        <strong>{{ caseFile.respondant }}</strong> being the
                        respondant. There
                        <span v-if="caseFile.arbitrators?.length">
                            is
                            <strong>{{ caseFile.arbitrators?.length }}</strong>
                            arbitrator,
                            <strong>{{
                                caseFile.arbitrators && caseFile.arbitrators[0]
                            }}</strong
                            >,&nbsp;
                        </span>
                        <span v-else>
                            are <strong>no arbitrators</strong>&nbsp;
                        </span>
                        assigned to the case.
                    </p>
                    <p>
                        Case is currently in
                        <strong>{{ getCaseStatus() }}</strong> mode
                    </p>
                    <p v-if="caseFile.case_status === 1">
                        Arbitrators have until
                        <strong>{{ formatContractDate() }}</strong>
                        to submit their offers
                    </p>
                    <template v-slot:buttons>
                        <div class="intro-buttons-wrap">
                            <q-btn
                                v-if="isAddClaimButtonVisible()"
                                color="primary"
                                label="Add claim to case"
                                @click="
                                    form = true;
                                    formType = 'addclaim';
                                "
                            />&nbsp;
                            <q-btn
                                v-if="isShredCaseButtonVisible()"
                                color="red"
                                label="Delete Case"
                                @click="
                                    form = true;
                                    formType = 'shredcase';
                                "
                            />
                        </div>
                    </template>
                </intro-card>
            </div>
            <div class="part">
                <case-steps :caseFile="caseFile" :claims="claims" />
            </div>
        </div>
        <div class="q-pa-md">
            <claims-table :caseFile="caseFile" :claims="claims" />
        </div>
        <div class="q-pa-md">
            <h2 v-if="isLoadingHistory">
                Loading case history...<q-circular-progress
                    :value="historyProgress"
                    size="3.75rem"
                    color="primary"
                    class="q-ma-md"
                    show-value
                    animation-speed="2000"
                />
            </h2>
            <h2 v-else>Case History</h2>
            <case-file-actions :actions="caseActionsHistory" :claims="claims" />
        </div>
        <div class="case-file-modal-wrap">
            <q-dialog id="case-file-modal" v-model="form">
                <add-claim-form
                    v-if="formType === 'addclaim'"
                    :caseId="$route.params.id"
                    :close="closeModal"
                />
                <shred-case-form
                    v-if="formType === 'shredcase'"
                    :caseId="$route.params.id"
                    :close="closeModal"
                    :afterShredCase="fetchCaseFile"
                />
            </q-dialog>
        </div>
    </div>
</template>

<script>
import { GET_TABLE_ROWS, CASE_STATUS_LIST } from '../../constants';
import { FETCH_CASE_ACTIONS_HISTORY } from '../../util/case';
import ClaimsTable from '../../components/ClaimsTable.vue';
import IntroCard from '../../components/IntroCard.vue';
import CaseSteps from '../cases/CaseSteps.vue';
import CaseFileActions from './CaseFileActions.vue';
import AddClaimForm from './AddClaimForm.vue';
import ShredCaseForm from '../../components/ShredCaseForm.vue';
import { mapGetters } from 'vuex';
import moment from 'moment';
import { fetchClaims } from '../../util';

export default {
    components: {
        ClaimsTable,
        IntroCard,
        CaseSteps,
        CaseFileActions,
        AddClaimForm,
        ShredCaseForm
    },
    data() {
        return {
            isLoadingHistory: false,
            historyProgress: 0,
            caseFile: null,
            claims: [],
            columns: [
                { name: 'case_id', label: 'ID', field: 'case_id' },
                { name: 'claimant', label: 'Claimant', field: 'claimant' },
                {
                    name: 'respondant',
                    label: 'Respondant',
                    field: 'respondant'
                },
                {
                    name: 'arbitrators',
                    label: 'Arbitrators',
                    field: 'arbitrators'
                },
                {
                    name: 'number_claims',
                    label: '# Claims',
                    field: 'number_claims'
                },
                { name: 'approvals', label: 'Approvals', field: 'approvals' },
                {
                    name: 'required_langs',
                    label: 'Lang',
                    field: 'required_langs'
                },
                { name: 'case_status', label: 'Status', field: 'case_status' },
                { name: 'case_ruling', label: 'Ruling', field: 'case_ruling' },
                {
                    name: 'update_ts',
                    label: 'Last Updated',
                    field: 'update_ts'
                },
                { name: 'actions', label: 'Actions', field: 'actions' }
            ],
            caseActionsHistory: [],
            form: null,
            formType: null,
            fetchCaseInterval: null
        };
    },
    methods: {
        setProgress(progress) {
            this.historyProgress = parseInt(progress);
        },
        closeModal() {
            this.form = null;
        },
        formatContractDate() {
            const date = moment(
                new Date(this.caseFile.sending_offers_until_ts + 'Z')
            ).format('YYYY-MM-DD HH:mm:ss');
            return date;
        },
        getCaseStatus() {
            const index = this.caseFile.case_status;
            return CASE_STATUS_LIST[index];
        },
        async fetchCaseFile() {
            const id = this.$route.params.id;
            if (!id) return;
            try {
                const { rows } = await GET_TABLE_ROWS({
                    code: 'testtelosarb',
                    scope: 'testtelosarb',
                    table: 'casefiles',
                    key_type: 'i64',
                    index_position: '1',
                    // @ts-ignore
                    upper_bound: this.$route.params.id,
                    // @ts-ignore
                    lower_bound: this.$route.params.id
                });
                const [caseFile] = rows;
                this.caseFile = caseFile;
            } catch (err) {
                console.log('fetchCaseFile error:', err);
            }
        },
        async getClaims() {
            try {
                const rows = await fetchClaims(this, this.$route.params.id);
                this.claims = rows;
            } catch (err) {
                console.log('getClaims error:', err);
            }
        },
        isAddClaimButtonVisible() {
            if (!this.isClaimant) return false;
            if (this.caseFile.case_status !== 0) return false;
            if (this.caseFile.number_claims > this.config.max_claims_per_case)
                return false;
            return true;
        },
        isShredCaseButtonVisible() {
            if (!this.isClaimant) return false;
            if (this.caseFile.case_status !== 0) return false;
            return true;
        }
    },
    computed: {
        ...mapGetters({
            isResolveStoresAvailable: 'resolve/isResolveStoresAvailable',
            isResolveAdmin: 'resolve/isResolveAdmin',
            account: 'accounts/account'
        }),
        config() {
            return this.$store.state.resolve.config;
        },
        isClaimant() {
            if (!this.caseFile) return false;
            return this.account === this.caseFile.claimant;
        },
        isRespondant() {
            if (!this.caseFile) return false;
            return this.account === this.caseFile.respondant;
        }
    },
    async mounted() {
        this.fetchCaseFile();
        this.getClaims();
        this.isLoadingHistory = true;
        const actionsHistory = await FETCH_CASE_ACTIONS_HISTORY(
            this,
            // @ts-ignore
            this.$route.params.id,
            this.setProgress
        );
        setTimeout(() => (this.isLoadingHistory = false), 2000);
        // @ts-ignore
        this.caseActionsHistory = actionsHistory;
        this.fetchCaseInterval = setInterval(() => {
            this.fetchCaseFile();
            this.getClaims();
        }, 10000);
    },
    beforeUnmount() {
        clearInterval(this.fetchCaseInterval);
    }
};
</script>

<style lang="scss">
.row {
    flex-direction: row;

    .part {
        flex: 4;

        .part:last-child() {
            flex: 6;
        }
    }

    .intro-buttons-wrap {
        flex-direction: column;
    }

    .case-file-modal-wrap {
        flex: 1;
    }
}
</style>