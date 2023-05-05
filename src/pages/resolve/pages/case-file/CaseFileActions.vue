<template>
    <div id="case-file-actions">
        <case-file-action
            v-for="(action, index) in actions"
            :key="index"
            :action="action"
            :claims="claims"
        />
    </div>
</template>

<script>
import CaseFileAction from './CaseFileAction.vue';

export default {
    components: { CaseFileAction },
    props: ['actions', 'claims', 'offers']
};
</script>

<style lang="scss">
#case-file-actions {
    padding: 20px;
}
</style>
