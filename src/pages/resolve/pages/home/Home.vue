<template>
    <div class="container1 row">
        <div class="primary col-sm-12 col-md-6">
            <intro />
        </div>
        <div class="secondary col-sm-12 col-md-6">
            <elections-status />
        </div>
    </div>
</template>

<script>
import Intro from './Intro.vue';
import ElectionsStatus from './ElectionsStatus.vue';

export default {
    components: {
        Intro,
        ElectionsStatus
    }
};
</script>

<style lang="scss" scoped>
.container1 {
    display: flex;
    flex-direction: row;
}
.primary,
.secondary {
    margin-bottom: 48px;
}
</style>
