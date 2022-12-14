<template>
    <div>
        <section class="heading">
            <h3>{{ getCurrentRouteName }}</h3>
        </section>
        <router-view></router-view>
    </div>
</template>

<script>
import {
    fetchArbConfig,
    fetchArbitrators,
    fetchElections,
    fetchNominees,
    fetchCaseFiles,
    fetchOffers
} from './util';

export default {
    data() {
        return {
            tab: 'mails',
            interval: null
        };
    },
    computed: {
        getCurrentRouteName() {
            if (this.$route.params && this.$route.params.id) {
                return `${this.$route.name} ${this.$route.params.id}`;
            }
            return this.$route.name;
        }
    },
    methods: {
        async getArbConfig() {
            try {
                const config = await fetchArbConfig(this);
                this.$store.commit('resolve/setArbConfig', config);
            } catch (err) {
                console.warn('fetchConfig error: ', err);
            }
        },
        async getArbitrators() {
            try {
                const arbitrators = await fetchArbitrators(this);
                this.$store.commit('resolve/setArbitrators', arbitrators);
            } catch (err) {
                console.warn('fetchArbitrators error: ', err);
            }
        },
        async getElections() {
            try {
                const elections = await fetchElections(this);
                this.$store.commit('resolve/setElections', elections);
            } catch (err) {
                console.warn('getElections error: ', err);
            }
        },
        async getNominees() {
            try {
                const nominees = await fetchNominees(this);
                this.$store.commit('resolve/setNominees', nominees);
            } catch (err) {
                console.warn('getNominees error: ', err);
            }
        },
        async getCaseFiles() {
            try {
                const caseFiles = await fetchCaseFiles(this);
                this.$store.commit('resolve/setCaseFiles', caseFiles);
            } catch (err) {
                console.warn('getCaseFiles error: ', err);
            }
        },
        async getOffers() {
            try {
                const offers = await fetchOffers(this);
                this.$store.commit('resolve/setOffers', offers);
            } catch (err) {
                console.warn('getOffers error: ', err);
            }
        },
        fetchAllData() {
            this.getArbConfig();
            this.getArbitrators();
            this.getElections();
            this.getNominees();
            this.getCaseFiles();
            this.getOffers();
        }
    },
    mounted() {
        this.fetchAllData();
        this.interval = setInterval(this.fetchAllData, 10000);
    },
    unmounted() {
        clearInterval(this.interval);
    }
};
</script>

<style scoped lang="scss">
.heading {
    h3 {
        margin-top: 20px;
        margin-bottom: 20px;
        font-style: normal;
        font-weight: 900;
        font-size: 92px;
        line-height: 110px;

        background: linear-gradient(90deg, #071a5f 0%, #571aff 30%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }
}

.sub-header h3 {
    margin: 0 auto;
    text-align: center;
}
a:-webkit-any-link {
    color: inherit;
    cursor: pointer;
    text-decoration: none;
}
.nav-tabs {
    display: flex;
    flex: 1;
    margin-top: 20px;
    flex-direction: row;
    justify-content: center;
}

.nav-tabs .q-gutter-y-md {
    max-width: 100% !important;
}

.nav-tabs .q-tab {
    padding: 0 72px;
}
</style>
