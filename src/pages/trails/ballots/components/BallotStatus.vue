<script>
import Countdown from '~/pages/trails/ballots/components/CountdownBlock';
import moment from 'moment';
export default {
    name: 'BallotStatus',
    components: { Countdown },
    props: {
        ballot: { type: Object, required: true },
        isBallotOpened: { type: Boolean, required: true },
        startTimeHasPassed: { type: Boolean, required: true },
        getStartTime: { type: Number, required: true },
        getEndTime: { type: Number, required: true },
    },
    data() {
        return {
            moment: moment,
        };
    },
};
</script>

<template lang="pug">
div.left-tag.cursor-default
  template(v-if="ballot.status === 'voting' && isBallotOpened")
    div.status-frame-title Time left
    countdown(:endtime="getEndTime")

  template(v-else-if="ballot.status === 'voting' && !startTimeHasPassed")
    div.status-frame-title Voting begins in
    countdown(:endtime="getStartTime")

  template(v-else-if="ballot.status === 'setup'")
    div.status-frame-title Status
    div Setup

  template(v-else)
    div.status-frame-title Status
    span Proposal ended


  template(v-if="ballot.status === 'setup'")
    div.status-frame-title.time draft
    div not started yet

  template(v-else)
    div.status-frame-title.time {{Date.now() > getEndTime ? "Ended" : "Ends"}}
    div {{moment(getEndTime).format("MMMM Do YYYY")}}

</template>

<style lang="sass">
.status-frame-title
  font-size: 12px
  margin: 4px 0
  opacity: .5
  line-height: 1

.time
  margin-bottom: 0
  margin-top: 8px

.status
  margin-bottom: 0
  margin-top: 4px
</style>
