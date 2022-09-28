<template>
  <div class="intro">
    <div class="info">
      <p class="first">
        When valuable assets are in question, there can arise disputes over
        fairness, oversight, and ownership. Resolve is how Telos finds equitable
        solutions to these kinds of issues on our community led network.
      </p>
      <h3>Create a new case</h3>
      <p class="second">
        Do you have an asset related issue that you’d like the network’s
        arbitration system to resolve? We believe that a transparent process
        benefits everyone.
      </p>
      <q-btn color="primary" label="Create a new case" />&nbsp;
      <q-btn color="primary" label="Admin Dashboard" @click="navigateToAdmin" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    navigateToAdmin() {
      this.$router.push("/resolve/admin");
    },
  },
};
</script>

<style scoped lang="scss">
.info {
  margin-right: 80px;
  p.first {
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 36px;
    color: #333333;
  }
  h3 {
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 37px;
    color: rgba(51, 51, 51, 0.5);
  }
  p.second {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #333333;
    margin-bottom: 36px;
  }
}
</style>
