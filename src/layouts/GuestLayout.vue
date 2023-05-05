<script>
export default {
    name: 'GuestLayout',
    computed: {
        title() {
            return this.$t(this.$route.meta.title || 'common.defaultTitle');
        },
    },
};
</script>

<template lang="pug">
q-layout(view="hHh lpR fFf")
  q-page-container
    q-page.flex.column.relative-position
      .col-10.flex.flex-center.col-grow.q-pa-lg
        router-view
</template>

<style lang="sass" scoped>
.back
  position: absolute
  top: 25px
  left: 10px
h1
  color: $primary
  font-size: 16px
  padding: 0
  line-height: 60px
  font-weight: 600
</style>
