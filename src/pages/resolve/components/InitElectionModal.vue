<template>
	<q-card style="min-width: 450px">
		<q-card-section>
			<div class="text-h6">Start Election Preparation</div>
		</q-card-section>

		<q-card-section class="q-pt-none">
			<q-input
				filled
				v-model="credentialsLink"
				label="Info Link"
				bottom-slots
				hint="46 or 49 character IPFS hash"
				error-message="Must be valid IPFS hash (ie 'Qmdn7bZ8z25b...')"
				dense
				autofocus
				:error="!isCredentialsLinkValid"
			/>
		</q-card-section>

		<q-card-actions align="right" class="text-primary">
			<q-btn flat label="Submit" @click="initElection" :disable="!isCredentialsLinkValid" />
			<q-btn flat label="Cancel" @click="close" />
		</q-card-actions>
	</q-card>
</template>

<script>
import { validateIpfsHash } from '../util'

export default {
  props: ['form', 'close', 'onSubmit'],
  data () {
    return {
      credentialsLink: ''
    }
  },
  computed: {
    isCredentialsLinkValid () {
      return validateIpfsHash(this.credentialsLink)
    },
    account_name () {
      return this.$store.state.accounts.account
    }
    // dialogNameValue: {
    //   get () {
    //     return this.dialogName
    //   },
    //   set (newValue) {
    //     this.dialogName = newValue
    //   }
    // }
  },
  methods: {
    async initElection () {
      const initElectionActions = [
        {
          account: 'testtelosarb',
          name: 'initelection',
          data: {
            content: this.credentialsLink
          }
        }
      ]
      try {
        await this.$store.$api.signTransaction(initElectionActions)
        this.close()
        setTimeout(this.onSubmit, 5000)
      } catch (err) {
        console.log('initElection error: ', err)
      }
    }
  },
  mounted: function () {
    console.log('initElectionModal mounted, this.$store.state', this.$store.state)
  }
}

</script>

<style lang="less" scoped>

</style>
