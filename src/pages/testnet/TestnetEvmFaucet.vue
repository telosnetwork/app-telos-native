<script>
import { mapActions } from 'vuex';
import { Notify } from 'quasar';

export default {
    name: 'TestnetEvmFaucet',
    data() {
        return {
            form: {
                send_to: null,
                account_name: null,
                owner_key: null,
                active_key: null,
            },
            transactionId: null,
            submitting: false,
        };
    },
    methods: {
        ...mapActions('testnet', ['evmFaucet']),
        async onEvmFaucet() {
            this.submitting = true;
            const result = await this.evmFaucet(this.form.send_to_evm);
            if (result) {
                Notify.create({
                    message: result instanceof Object ? 'Success!' : result,
                    position: 'top',
                    color: 'primary',
                    textColor: 'white',
                    actions: [{ label: 'Dismiss', color: 'white' }],
                });
                this.transactionId = result.transactionId;
            }
            this.submitting = false;
        },
    },
};
</script>

<template lang="pug">
q-page.flex.flex-center
  q-card
    q-card-section
      div.center.text-h4 Testnet faucet
    q-card-section
      q-input.q-mb-lg(
        ref="send_to_evm"
        v-model="form.send_to_evm"
        color="accent"
        label="Send to EVM address"
        :rules="[ val => /^0x[a-fA-F0-9]{40}$/.test(val) || 'Please provide a valid EVM address with 0x prefix']"
        outlined
      )
      q-btn.full-width(
        color="primary"
        label="Send testnet EVM TLOS"
        size="lg"
        unelevated
        :loading="submitting"
        @click="onEvmFaucet"
      )
    q-card-section(v-if="transactionId")
      a(
        :href="`https://telos-test.bloks.io/transaction/${transactionId}`"
        target="_blank"
      ) Trx explorer
</template>
