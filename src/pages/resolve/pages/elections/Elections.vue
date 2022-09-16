<template>
  <div>
    <div class="intro-row">
      <div class="first">
        <intro-card
          heading="Elect Telos's Next Arbitrators"
        >
          <p>As a leader in blockchain governance, Telos allows any user with a Telos account to nominate themselves as a candidate for
            the position of arbitrator.
            Do you have a background in arbitration? Consider nominating yourself.
            Know someone else who you think would make a good arbitrator? Ask them to nominate themselves.
            If they win the election they may find themselves ruling on some of the community's most important cases.</p>
            <strong>Current nominees:</strong>
          <ul>
            <li v-for="nominee in nominees" :key="nominee.nominee_name">{{nominee.nominee_name}}</li>
          </ul>
        </intro-card>
      </div>
      <div class="second">
        <election-steps />
      </div>
    </div>
    <elections-table />
  </div>
</template>

<script>
import ElectionsTable from '../../components/ElectionsTable.vue'
import ElectionSteps from './ElectionSteps.vue'
import IntroCard from '../../components/IntroCard.vue'

export default {
  components: {
    ElectionsTable,
    ElectionSteps,
    IntroCard
  },
  data () {
    return {

    }
  },
  computed: {
    nominees () {
      const nomineesList = this.$store.state.resolve.nominees
      if (nomineesList) {
        return nomineesList
      }
      return []
    }
  }
}
</script>

<style scoped lang="scss">
.intro-row {
  display: flex;
  flex: 1;
  flex-direction: row;

  .first, .second {
    flex: 1;
  }
}
</style>
