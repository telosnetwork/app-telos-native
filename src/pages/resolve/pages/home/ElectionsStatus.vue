<template>
    <div id="resolve-election-status" v-if="isResolveStoresAvailable">
        <h4 class="heading">{{ $t(currentElectionContent.heading) }}</h4>
        <p class="content q-pb-lg">{{ $t(currentElectionContent.text) }}</p>
        <q-btn
            color="primary"
            :label="$t(currentElectionContent.buttonText)"
            @click="onClickButton(currentElectionContent.buttonRoute)"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ELECTION_STATUS_LIST } from '../../constants/elections';
const electionStatus = {
    CREATED: {
        heading: 'pages.resolve.election_status_created_heading',
        text:
            'pages.resolve.election_status_created_text',
        buttonText: 'pages.resolve.election_status_created_cta',
        buttonRoute: '/resolve/elections'
    },
    LIVE: {
        heading: 'pages.resolve.election_status_live_heading',
        text:
            'pages.resolve.election_status_live_text',
        buttonText: 'pages.resolve.election_status_live_cta',
        buttonRoute: '/resolve/elections'
    },
    FINALIZING: {
        heading: 'pages.resolve.election_status_finalizing_heading',
        text:
            'pages.resolve.election_status_finalizing_text',
        buttonText: 'pages.resolve.election_status_finalizing_cta',
        buttonRoute: '/resolve/elections'
    },
    ENDED: {
        heading: 'pages.resolve.election_status_ended_heading',
        text:
            'pages.resolve.election_status_ended_text',
        buttonText: 'pages.resolve.election_status_ended_cta',
        buttonRoute: '/resolve/cases'
    }
};
export default {
    computed: {
        ...mapGetters({
            currentElection: 'resolve/getCurrentElection',
            isResolveStoresAvailable: 'resolve/isResolveStoresAvailable'
        }),
        currentElectionStatus() {
            return this.currentElection.status;
        },
        currentElectionContent() {
            let statusString =
                ELECTION_STATUS_LIST[this.currentElection.status || 3];
            if (statusString === 'LIVE') {
                const endVotingUnixTimestamp = new Date(
                    `${this.currentElection.end_voting_ts}Z`
                ).getTime();
                const rightNow = new Date().getTime();
                if (endVotingUnixTimestamp < rightNow) {
                    statusString = 'FINALIZING';
                }
            }
            return electionStatus[statusString];
        }
    },
    methods: {
        onClickButton(path) {
            this.$router.push(path);
        }
    }
};
</script>

<style lang="scss">
#resolve-election-status {
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
        text-align: center;
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
