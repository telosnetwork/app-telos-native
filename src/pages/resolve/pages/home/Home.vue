<template>
  <div class="container">
    <div class="primary">
      <intro />
    </div>
    <div class="secondary">
      <elections-status />
    </div>
  </div>
</template>

<script>
import Intro from "./Intro.vue";
import ElectionsStatus from "./ElectionsStatus.vue";

export default {
  components: {
    Intro,
    ElectionsStatus,
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
}
.primary {
  flex: 1;
}
.secondary {
  flex: 1;
}
</style>
