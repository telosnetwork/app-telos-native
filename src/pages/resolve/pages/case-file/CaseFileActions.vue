<template>
    <div class="container">
        <case-file-action
            v-for="(action, index) in actions"
            :key="index"
            :action="action"
            :claims="claims"
        />
    </div>
</template>

<script lang="ts">
import CaseFileAction from './CaseFileAction.vue';

export default {
    components: { CaseFileAction },
    props: ['actions', 'claims', 'offers']
};
</script>

<style scoped lang="scss">
.container {
    padding: 20px;
}
</style>
