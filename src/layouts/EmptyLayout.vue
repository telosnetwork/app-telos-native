<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import RightMenuAuthenticated from '~/components/layout/RightMenuAuthenticated';
import RightMenuGuest from '~/components/layout/RightMenuGuest';

export default {
    components: {
        RightMenuAuthenticated,
        RightMenuGuest,
    },
    computed: {
        ...mapGetters('accounts', ['isAuthenticated']),
        ...mapGetters('notifications', ['successCount', 'errorCount']),
    },
    methods: {
        ...mapMutations('notifications', [
            'initNotifications',
            'unmarkRead',
            'unmarkNew',
        ]),
        ...mapActions('accounts', ['autoLogin']),
    },
    name: 'EmptyLayout',
};
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white">
      <q-toolbar>
        <q-toolbar-title class="flex items-center">
          <img class="toolbar-img" src="branding/telos-logo-dark.png" />
        </q-toolbar-title>
        <right-menu-authenticated v-if="isAuthenticated" :landing-page="true" />
        <right-menu-guest v-if="!isAuthenticated" :landing-page="true" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
.toolbar-img {
  max-height: 30px;
}
</style>
