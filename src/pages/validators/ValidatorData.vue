<template lang="pug">
div
  q-btn.toggle(@click='toggleView' :label='toggleLabel' color='primary')
  q-btn.toggle( v-if='account' @click='castVote' :disable='!voteChanged' label='Vote' color='primary')
  q-btn.toggle( v-if='account' @click='resetVote' :disable='!voteChanged' label='Reset' color='primary')
  ValidatorDataChart(v-if='showCpu')
  ValidatorDataTable( v-else
    ref="ValidatorDataTable"
    :producerData='producerData'
    :producerVotes='producerVotes'
    :lastWeight='lastWeight'
    :lastStaked='lastStaked'
    :stakedAmount='stakedAmount'
    :lastUpdated='lastUpdated'
    @vote-changed='toggleVoteButtons'
    @get-votes='getVotes'
  )
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import ValidatorDataChart from './components/ValidatorDataChart.vue';
import ValidatorDataTable from './components/ValidatorDataTable.vue';

// Live API — replaces stale S3 bucket telos-producer-validation
// Set via VALIDATORS_API env var (mainnet + testnet builds)
const VALIDATORS_API = process.env.VALIDATORS_API;

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Validator',
    components: {
        ValidatorDataChart,
        ValidatorDataTable,
    },
    data() {
        return {
            lastUpdated: '',
            producerData: [],
            producerVotes: [],
            showCpu: false,
            voteChanged: false,
            resetFlag: false,
            lastWeight: '0',
            lastStaked: 0,
            stakedAmount: 0,
        };
    },
    async mounted() {
        await this.getData();
    },
    computed: {
        ...mapGetters('accounts', ['account']),
        toggleLabel() {
            return this.showCpu ? 'View Table' : 'View Graph';
        },
    },
    methods: {
        async getData() {
            try {
                const response = await axios.get(VALIDATORS_API);
                this.producerData = response.data;
                this.lastUpdated = new Date().toISOString();
                await this.getVotes();
            } catch (err) {
                console.log('Error', err);
            }
        },
        async getVotes() {
            if (this.account) {
                const voterInfo = (await this.$store.$api.getAccount(this.account))
                    .voter_info;
                this.producerVotes = voterInfo.producers;
                this.lastWeight = parseFloat(voterInfo.last_vote_weight).toFixed(2);
                this.lastStaked = voterInfo.last_stake;
                this.stakedAmount = voterInfo.staked;
            }
        },
        toggleView() {
            this.showCpu = !this.showCpu;
        },
        castVote() {
            this.$refs.ValidatorDataTable.sendVoteTransaction();
        },
        resetVote() {
            this.$refs.ValidatorDataTable.resetVotes();
        },
        toggleVoteButtons(val) {
            this.voteChanged = val;
        },
    },
};
</script>
<style lang="sass">
.toggle
  margin-top: 0.75rem
  margin-left: 1rem
</style>
