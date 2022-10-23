<template lang="pug">
main
    q-spinner.fixed-center(
      color='primary',
      name='dots',
      size='40px',
      v-if='loading'
    )
    p.fixed-center(
      v-if='!loading'
    ) {{ $t('pages.profileLogin.failed') }}
<q-banner></q-banner>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'ProfileLogin',
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    ...mapGetters('accounts', ['account']),
  },
  async mounted() {
    const isLogged = await this.loginToBackend();
    if (isLogged) {
      const returnUrl = this.$route.query.returnUrl;
      this.$router.push({ path: returnUrl || `/profiles/display/${this.account}` });
    } else {
      this.loading = false;
    }
  },
  methods: {
    ...mapActions('accounts', ['loginToBackend']),
  },
};
</script>
