<script>
import { mapActions, mapGetters } from 'vuex';
import TreasuryCard from '../components/TreasuryCard';
import TreasuryForm from '../components/TreasuryForm';

export default {
    name: 'TreasuriesList',
    components: {
        TreasuryCard,
        TreasuryForm,
    },
    data() {
        return {
            show: false,
            fakeData: [
                {
                    access: 'public',
                    committees: 0,
                    delegates: 0,
                    description: 'Test Is prefered flag',
                    icon: '',
                    isRegistered: false,
                    locked: 0,
                    manager: 'dao.gba',
                    max_supply: '1000000000.00 GBAV',
                    open_ballots: 4,
                    settings: [],
                    supply: '31045.06 GBAV',
                    symbol: 'GBAV',
                    title: 'Fake data',
                    unlock_acct: 'dao.gba',
                    unlock_auth: 'active',
                    voters: 8,
                    isPreferred: true,
                },
            ],
        };
    },
    async mounted() {
        await this.fetchFees();
        this.$refs.infiniteScroll.reset();
        this.$refs.infiniteScroll.poll();
        await this.maybeLoadTreasuries();
    },
    methods: {
        ...mapActions('trails', ['fetchTreasuries', 'fetchFees']),
        async onLoad(index, done) {
            await this.maybeLoadTreasuries();
            done();
        },
        async maybeLoadTreasuries() {
            if (!this.treasuriesLoaded) {
                await this.fetchTreasuries();
            } else {
                this.$refs.infiniteScroll.stop();
            }
        },
    },
    computed: {
        ...mapGetters('accounts', ['isAuthenticated']),
        ...mapGetters('trails', ['treasuries', 'treasuriesLoaded']),
    },
};
</script>

<template lang="pug">
q-page.q-pa-lg

  div.row.justify-end.q-mb-md.scroll-anim(v-if="isAuthenticated")
    q-btn.create-poll-btn.btn-320(
    :label="$t('pages.trails.ballots.actionBar.btnCreateaDAO')"
    icon="add"
    color="primary"
    no-caps
    outline
    @click="show = true"
  )

  treasury-form(:show.sync="show" @close="show = false")
  .treasuries(ref="treasuriesRef")
    q-infinite-scroll(
      ref="infiniteScroll"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.treasuriesRef"
    )
      .row.q-col-gutter-md
        .col-xs-12.col-sm-6(v-for="treasury in treasuries")
          treasury-card(:treasury="treasury")
</template>