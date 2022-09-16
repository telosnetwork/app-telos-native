<template>
  <div>
    <div class="row">
      <div class="part">
        <intro-card
          heading="Case Summary"
          >
          <p><strong>{{caseData.claimant}}</strong> is the claimant, with <strong>{{caseData.respondant}}</strong> being the respondant.
            There is one arbitrator assigned to the case.</p>
          <template v-slot:buttons>
            <div class="intro-buttons-wrap">
              <q-btn color="primary" label="Add claim to case" />&nbsp;
              <q-btn color="primary" label="Respond to claim" />
            </div>
          </template>
        </intro-card>
      </div>
      <div class="part">
        <case-steps :caseFile="caseFile[0]" />
      </div>
    </div>
    <div class="q-pa-md">
      <claims-table></claims-table>
    </div>
  </div>
</template>

<script>
import { GET_TABLE_ROWS } from '../../constants'
import { FETCH_CASE_ACTIONS_HISTORY } from '../../util/case'
import ClaimsTable from '../../components/ClaimsTable.vue'
import IntroCard from '../../components/IntroCard.vue'
import CaseSteps from '../cases/CaseSteps.vue'

export default {
  props: ['id'],
  components: {
    ClaimsTable,
    IntroCard,
    CaseSteps
  },
  data () {
    return {
      caseFile: [],
      columns: [
        { name: 'case_id', label: 'ID', field: 'case_id' },
        { name: 'claimant', label: 'Claimant', field: 'claimant' },
        { name: 'respondant', label: 'Respondant', field: 'respondant' },
        { name: 'arbitrators', label: 'Arbitrators', field: 'arbitrators' },
        { name: 'number_claims', label: '# Claims', field: 'number_claims' },
        { name: 'approvals', label: 'Approvals', field: 'approvals' },
        { name: 'required_langs', label: 'Lang', field: 'required_langs' },
        { name: 'case_status', label: 'Status', field: 'case_status' },
        { name: 'case_ruling', label: 'Ruling', field: 'case_ruling' },
        { name: 'update_ts', label: 'Last Updated', field: 'update_ts' },
        { name: 'actions', label: 'Actions', field: 'actions' }
      ],
      caseActionsHistory: []
    }
  },
  methods: {
    goToCaseFile (caseFileId) {
      this.$router.push({ path: `resolve/case/${caseFileId}`, params: { caseFileId } })
    },
    async fetchCaseFile () {
      try {
        const { rows } = await GET_TABLE_ROWS({
          code: 'testtelosarb',
          scope: 'testtelosarb',
          table: 'casefiles',
          upper_bound: this.$route.params.id,
          lower_bound: this.$route.params.id,
          reverse: true
        })
        this.caseFile = rows
      } catch (err) {
        console.log('fetch case files error:', err)
      }
    }
  },
  mounted: async function () {
    this.fetchCaseFile()
    const actionsHistory = await FETCH_CASE_ACTIONS_HISTORY(this, this.$route.params.id)
    console.log('actionsHistory: ', actionsHistory)
    this.caseActionsHistory = actionsHistory
  },
  computed: {
    caseData () {
      return this.caseFile[0]
    }
  }
}
</script>

<style scoped lang="scss">
.row {
  flex-direction: row;

  .part {
    flex: 1;
  }

  .intro-buttons-wrap {
    flex-direction: column;
  }

}

</style>
