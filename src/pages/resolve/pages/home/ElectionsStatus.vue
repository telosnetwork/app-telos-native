<template>
  <div class="wrap">
    <h4 class="heading">Elections are open!</h4>
    <p class="content">
      We are currently processing an election and every vote matters, especially
      yours! Head on over to Decide Voter and select this term’s arbitrators.
    </p>
    <q-btn
      color="primary"
      label="View Elections"
      @click="onClickViewElections"
    />
    <!--<q-btn color="primary" label="Vote" /> -->
  </div>
</template>

<script>
export default {
  methods: {
    onClickViewElections() {
      this.$router.push("/resolve/elections");
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #571aff;
  border-radius: 6px;
  padding: 20%;

  h4.heading {
    color: #ffffff;
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 37px;
  }
  p.content {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    color: #ffffff;
  }
  .inverse-button {
    border-color: #ffffff;
  }

  .buttons-wrap {
    display: flex;
    flex-direction: row;
  }
}
</style>
