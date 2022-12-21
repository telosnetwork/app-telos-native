<template>
    <case-files-table :caseFiles="assignedCaseFiles" :title="$t('pages.resolve.assigned_cases_title')" />
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import CaseFilesTable from '../../components/CaseFilesTable.vue';
export default {
    components: {
        CaseFilesTable
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        }),
        assignedCaseFiles() {
            const caseFiles = [
                ...(this as any).$store.state.resolve.case_files
            ];
            const relevantCaseFiles = caseFiles.filter(caseFile => {
                const arbIsFound = caseFile.arbitrators.find(
                    (arb: any) => arb === this.account
                );
                if (arbIsFound) return true;
                return false;
            });
            return relevantCaseFiles;
        }
    }
};
</script>