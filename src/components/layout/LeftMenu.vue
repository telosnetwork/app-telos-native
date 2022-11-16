<script>
export default {
    name: 'LeftMenu',
    data() {
        return {
            menuItems: [
                { label: this.$t('menu.daos'),      route: '/trails/treasuries' },
                { label: this.$t('menu.elections'), route: '/trails/elections' },
                { label: this.$t('menu.proposals'), route: '/trails/ballots' },
            ],
            clientWidth: 0,
        };
    },
    watch: {
        clientWidth: function () {
            if (this.clientWidth > 760) {
                this.closeMenu();
            }
        },
    },
    created() {
        window.addEventListener('resize', this.updateWidth);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateWidth);
    },
    methods: {
        closeMenu: function () {
            this.$emit('close');
        },
        goToHomePage: function () {
            this.$emit('goToHomePage');
        },
        updateWidth() {
            this.clientWidth = window.innerWidth;
        },
    },
};
</script>

<template lang="pug">
q-scroll-area.left-menu(style="height: 100%; border-right: 1px solid #ddd")
  div.menu-logo-wrapper
    q-btn.burger-close(
        flat
        dense
        round
        @click="closeMenu"
        icon="close"
        aria-label="Menu"
        text-color="black"
      )
    div.wrapper
      img(@click="goToHomePage" class="img" src="statics/telos-logo-new.svg")
  q-tabs(
      no-caps
      vertical
      switch-indicator
      class="text-grey text-teal"
      active-color="grey-9"
      indicator-color='primary'
    )
    q-route-tab.aline-left.q-my-lg.left-menu-tab(
      v-for="(item, index) of menuItems"
      :key="index"
      :name="item.label"
      :label="item.label"
      :to="item.route"
      ripple
    )
</template>

<style lang="sass">
.left-menu
  .aline-left
    justify-content: left
    padding: 0 27px
    font-size: 22px
    line-height: 22px
    font-weight: 600
  .menu-logo-wrapper
    height: 162px
    border-bottom: 1px solid rgba(0, 9, 26, 0.1)
@media (max-width: 760px)
  .left-menu
    .burger-close
      margin: 16px 0 0 24px
    .wrapper
      margin: 34px 0 0 28px
    .img
      cursor: pointer
      width: 144px
    .left-menu-tab
      padding-left: 27px !important
    .header-submenu-tab
      font-size: 22px
      font-weight: bold
      text-transform: capitalize
      padding-left: 27px !important
      width: 100%
      margin: 0
      & .q-btn__wrapper
        padding: 0
        & .q-btn__content
          justify-content: flex-start
    .header-submenu-item
      margin: 0
      border-bottom: none !important
      border-left: 5px solid transparent !important
    .active-tab
      border-bottom: none !important
      border-left: 5px solid $primary !important
    .q-menu
      width: 320px
</style>