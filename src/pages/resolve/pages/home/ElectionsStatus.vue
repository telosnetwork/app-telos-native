<template>
    <div id="resolve-election-status" v-if="isResolveStoresAvailable">
        <h4 class="heading">{{ currentElectionContent.heading }}</h4>
        <p class="content q-pb-lg">{{ currentElectionContent.text }}</p>
        <q-btn
            color="primary"
            :label="currentElectionContent.buttonText"
            @click="onClickButton(currentElectionContent.buttonRoute)"
        />
        <!--<q-btn color="primary" label="Vote" /> -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ELECTION_STATUS_LIST } from '../../constants/elections';
const electionStatus = {
    CREATED: {
        heading: 'Elections Coming Soon!',
        text:
            'There is an upcoming election, and we are currently taking nominations. Think that you would make a good arbitrator? Then consider nominating yourself!',
        buttonText: 'View Elections',
        buttonRoute: '/resolve/elections'
    },
    LIVE: {
        heading: 'Election is Live!',
        text:
            'An election is currently underway and every vote matters, especially yours! Head on over to Decide Voter and select this term’s arbitrators.',
        buttonText: 'View Elections',
        buttonRoute: '/resolve/elections'
    },
    FINALIZING: {
        heading: 'Election Has Ended',
        text:
            "An election has recently finished. See how the candidates did, and who will be one of Telos's newest arbitrators.",
        buttonText: 'View Election Results',
        buttonRoute: '/resolve/elections'
    },
    ENDED: {
        heading: 'Arbitration is Currently Ongoing!',
        text:
            'There are currently active arbitrators for this period. You can view the ongoing arbitration cases by heading to the cases page.',
        buttonText: 'View Cases',
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
