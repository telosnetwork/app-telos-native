<template>
  <div class="q-pa-md" v-if="configData.length > 0">
    <q-table
      title="Contract"
      :data="configData"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body-cell-admin="props">
        <q-td :props="props">
					<profile-avatar :account_name="props.admin" size="24px" childClass="profile-avatar"></profile-avatar>
						<span>&nbsp;{{props.row.admin}}</span>
					</q-td>
			</template>
      <template v-slot:body-cell-arb_term_length="props">
        <q-td :props="props">
						<span>{{arbTermDuration}}</span>
					</q-td>
			</template>
      <template v-slot:body-cell-election_add_candidates_ts="props">
        <q-td :props="props">
						<span>{{addCandidatesDuration}}</span>
					</q-td>
			</template>
      <template v-slot:body-cell-election_voting_ts="props">
        <q-td :props="props">
						<span>{{electionDuration}}</span>
					</q-td>
			</template>
      <template v-slot:body-cell-runoff_election_voting_ts="props">
        <q-td :props="props">
						<span>{{runoffElectionDuration}}</span>
					</q-td>
			</template>
    </q-table>
  </div>
</template>

<script>
import ProfileAvatar from 'src/components/common/ProfileAvatar.vue'
import { secondsToDhms } from '../util'

export default {
  components: {
    ProfileAvatar
  },
  data () {
    return {
      columns: [
        { name: 'admin', label: 'Admin', field: 'admin' },
        { name: 'current_election_id', label: 'Current Election', field: 'current_election_id' },
        { name: 'arb_term_length', label: 'Arbitrator Term', field: 'arb_term_length' },
        { name: 'election_add_candidates_ts', label: 'Add Election Nominees', field: 'election_add_candidates_ts' },
        { name: 'election_voting_ts', label: 'Election Duration', field: 'election_voting_ts' },
        { name: 'max_elected_arbs', label: 'Arbitrator Count', field: 'max_elected_arbs' },
        { name: 'runoff_election_voting_ts', label: 'Runoff Duration', field: 'runoff_election_voting_ts' }
      ]
    }
  },
  computed: {
    configData () {
      const config = this.$store.state.resolve.config
      if (config) return [config]
      return []
    },
    arbTermDuration () {
      if (!this.configData[0]) return ''
      return secondsToDhms(this.configData[0].arb_term_length)
    },
    electionDuration () {
      if (!this.configData[0]) return ''
      return secondsToDhms(this.configData[0].election_voting_ts)
    },
    addCandidatesDuration () {
      if (!this.configData[0]) return ''
      return secondsToDhms(this.configData[0].election_add_candidates_ts)
    },
    runoffElectionDuration () {
      if (!this.configData[0]) return ''
      return secondsToDhms(this.configData[0].runoff_election_voting_ts)
    }
  }
}
</script>

<style scoped></style>
