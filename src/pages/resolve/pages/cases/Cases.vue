<template>
    <div id="resolve-cases-page">
        <div class="top-row row">
            <intro-card
                class="col-xs-12 col-sm-6"
                :heading="$t('pages.resolve.create_case_heading')"
                :text="$t('pages.resolve.create_cass_text')"
            >
                <template v-slot:buttons>
                    <q-btn
                        color="primary"
                        @click="isModalVisible = !isModalVisible"
                        v-if="isAuthenticated"
                        >{{$t('pages.resolve.create_case_heading')}}</q-btn
                    >
                </template>
            </intro-card>
            <meet-arbitrators
                class="col-xs-12 col-sm-6"
                v-if="isResolveStoresAvailable"
            />
        </div>
        <div class="form-wrapper">
            <q-dialog v-model="isModalVisible">
                <create-new-case-modal :close="toggleModal" />
            </q-dialog>
        </div>
        <case-files-table />
    </div>
</template>

<script>
import IntroCard from '../../components/IntroCard.vue';
import CaseFilesTable from '../../components/CaseFilesTable.vue';
import MeetArbitrators from './MeetArbitrators.vue';
import { mapGetters } from 'vuex';
import CreateNewCaseModal from '../case-file/CreateNewCaseModal.vue';

export default {
    components: {
        IntroCard,
        CaseFilesTable,
        MeetArbitrators,
        CreateNewCaseModal
    },
    data() {
        return {
            isModalVisible: false
        };
    },
    methods: {
        toggleModal() {
            this.isModalVisible = !this.isModalVisible;
        },
        createNewCase() {}
    },
    computed: {
        ...mapGetters({
            isResolveStoresAvailable: 'resolve/isResolveStoresAvailable',
            isAuthenticated: 'accounts/isAuthenticated'
        })
    }
};
</script>

<style lang="scss">
#resolve-cases-page {
    .top-row {
        display: flex;
        flex-direction: row;
    }
}
</style>