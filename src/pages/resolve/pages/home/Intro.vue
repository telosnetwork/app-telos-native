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
      <q-btn
        v-if="isAuthenticated"
        color="primary"
        label="View Cases"
        @click="$router.push('/resolve/cases')"
      />&nbsp;
      <q-btn
        v-if="isResolveAdmin"
        color="primary"
        label="Admin Dashboard"
        @click="navigateToAdmin"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    navigateToAdmin(): void {
      (this as any).$router.push("/resolve/admin");
    },
  },
  computed: {
    isResolveAdmin(): any {
      return (this as any).$store.getters["resolve/isResolveAdmin"];
    },
    isAuthenticated(): any {
      return (this as any).$store.getters["accounts/isAuthenticated"];
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
