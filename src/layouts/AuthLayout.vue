<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import AppHeader from '~/components/layout/AppHeader';
import LeftMenu from '~/components/layout/LeftMenu';
import RightMenuNotifications from '~/components/layout/RightMenuNotifications';

export default {
    name: 'AuthLayout',
    components: {
        AppHeader,
        LeftMenu,
        RightMenuNotifications,
    },
    data() {
        return {
            menu: false,
            right: false,
            miniState: true,
            activeFilter: 'amend-ballots',
            checkForActiveElection: true,
        };
    },
    computed: {
        ...mapGetters('trails', ['ballots']),
        ...mapGetters('notifications', ['successCount', 'errorCount']),
    },
    methods: {
        ...mapMutations('notifications', [
            'initNotifications',
            'unmarkRead',
            'unmarkNew',
        ]),
        ...mapActions('accounts', ['memoryAutoLogin']),
        toggleNotifications() {
            if (this.right) {
                this.unmarkRead();
            }
            this.right = !this.right;
        },
        toLanding() {
            this.$router.push({ path: '/' });
        },
        toggleMenu() {
            this.menu = !this.menu;
        },
        setActiveFilter(filter) {
            this.activeFilter = filter;
        },
        closeMenu() {
            this.menu = false;
        },
    },
    watch: {
        ballots(ballots) {
            // redirect to elections tab during active election
            if (this.checkForActiveElection) {
                const activeElections = ballots.some(
                    (b) =>
                        (b.category === 'election' || b.category === 'leaderboard') &&
            b.status === 'voting' &&
            Date.parse(b.end_time) > Date.now()
                );
                if (activeElections && this.$route.path === '/') {
                    this.$router.push('/trails/elections');
                }
                this.checkForActiveElection = false;
            }
        },
    },
    async mounted() {
        this.memoryAutoLogin();
        this.initNotifications();
    },
};
</script>

<template lang="pug">
q-layout(view="lHh lpR lFr")
  app-header(
    @open="toggleMenu"
    @goToHomePage="toLanding"
    @toggleNote="toggleNotifications"
    @set-active-filter="setActiveFilter"
    :activeFilter="activeFilter"
)
  q-drawer(
    v-model="right"
    side="right"
    overlay
    bordered
  )
    right-menu-notifications
  q-drawer(
    v-model="menu"
    :width="320"
    :breakpoint="500"
    overlay
  )
    left-menu(@close="menu = false")
  q-page-container
    router-view(:activeFilter="activeFilter")
</template>

<style lang="sass" scoped>
.q-layout
  max-width: 1366px
  margin: 0 auto
  padding: 0 93px
@media (max-width: 890px)
  .q-layout
    padding: 0 34px
@media (max-width: 400px)
  .q-layout
    padding: 0
</style>
