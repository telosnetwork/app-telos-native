<template>
  <q-card style="min-width: 450px">
    <q-card-section>
      <div class="text-h6">Nominate Self ({{account_name}})</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input
        filled
        v-model="credentialsLink"
        label="Credentials Link"
        bottom-slots
        hint="46 or 49 character IPFS hash"
        error-message="Must be valid IPFS hash (ie 'Qmdn7bZ8z25b...')"
        dense
        autofocus
        :error="!isCredentialsLinkValid"
      />
    </q-card-section>

    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Submit" @click="nominateSelf" :disable="!isCredentialsLinkValid" />
      <q-btn flat label="Cancel" @click="close" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { validateIpfsHash } from '../util'

export default {
  props: ['close', 'onSubmit'],
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
  },
  methods: {
    async nominateSelf () {
      const nominateSelfActions = [
        {
          account: 'testtelosarb',
          name: 'regarb',
          data: {
            credentials_link: this.credentialsLink,
            nominee: this.account_name
          }
        }
      ]
      try {
        await this.$store.$api.signTransaction(nominateSelfActions)
        this.close()
        setTimeout(this.onSubmit, 5000)
      } catch (err) {
        console.log('nominateSelf error: ', err)
      }
    }
  },
  mounted: function () {
    console.log('nominateSelfModal mounted, this.$store.state', this.$store.state)
  }
}

</script>

<style lang="less" scoped>

</style>
