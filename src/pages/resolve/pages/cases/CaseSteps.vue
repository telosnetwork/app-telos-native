<template>
  <div class="container">
    <div class="q-pa-md stepper-wrap">
      <q-stepper
        v-model="caseStatus"
        vertical
        color="primary"
        animated
      >
        <q-step
          :name="0"
          title="Case Setup"
          icon="settings"
        >
          Case Setup description
          <br /><br />
          <q-btn v-if="isClaimant" @click="form = true; formType = 'add-claim'" color="primary" label="Add Claim" />
          <q-btn v-if="isRespondant" @click="form = true; formType = 'respond-claim'" color="primary" label="Respond to Claim" />
        </q-step>

        <q-step
          :name="1"
          title="Awaiting Arbitrators"
          icon="assignment"
        >
          Awaiting Arbs description
          <br /><br />
          <q-btn
						v-if="isRegisterCandidateButtonVisible"
						@click="registerSelfCandidate"
						color="primary"
						label="Register as Candidate"
					/>
        </q-step>

        <q-step
          :name="2"
          title="Arbitrators Assigned"
          icon="assignment"
        >
          Awaiting arbs description
        </q-step>

        <q-step
          :name="3"
          title="Case Investigation"
          icon="add_comment"
        >
          Case Investigation description
        </q-step>

        <q-step
          :name="4"
          title="Decision"
          icon="add_comment"
        >
          Decision description
          <br /><br />
          <q-btn @click="endElection" color="primary" label="View Cases" />
        </q-step>

        <q-step
          :name="5"
          title="Enforcement"
          icon="add_comment"
        >
          Enforcement description
          <br /><br />
          <q-btn @click="endElection" color="primary" label="View Cases" />
        </q-step>

      </q-stepper>
    </div>
    <div class="form-wrapper" persistent>
      <q-dialog v-model="form">
				<nominate-self-modal v-if="formType === 'nominate-self'" :close="closeModal" />
      </q-dialog>
    </div>
  </div>
</template>

<script>

import NominateSelfModal from '../../components/NominateSelfModal.vue'

export default {
  props: ['caseFile'],
  components: {
    NominateSelfModal
  },
  data () {
    return {
      form: null,
      formType: null
    }
  },
  computed: {
    caseStatus () {
      if (!this.caseFile) return null
      return this.caseFile.case_status
    },
    isClaimant () {
      return this.$store.state.accounts.account === this.caseFile.claimant
    },
    isRespondant () {
      return this.$store.state.accounts.account === this.caseFile.respondant
    },
    isArbitrator () {
      return false
    }
  },
  methods: {
    closeModal () {
      this.form = null
    },
    async endElection () {
      const endElectionActions = [
        {
          account: 'testtelosarb',
          name: 'endelection'
        }
      ]
      try {
        await this.$store.$api.signTransaction(endElectionActions)
      } catch (err) {
        console.log('endElection error: ', err)
      }
    }
  },
  mounted () {
    console.log('CaseSteps this.caseFile: ', this.caseFile)
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;

  .stepper-wrap {
    flex: 1;
  }
}
</style>
