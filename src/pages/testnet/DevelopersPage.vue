<!-- eslint-disable max-len -->
<!-- eslint-disable -->
<script>
import { mapActions } from 'vuex';
import { Notify } from 'quasar';

const available_tabs = ['create', 'tlos-native', 'tlos-evm'];
const default_tab = 'create';

export default {
    name: 'DevelopersPage',
    data() {
        return {
            form: {
                send_to: null,
                account_name: null,
                owner_key: null,
                active_key: null,
            },
            transactionId: '',
            submitting: false,
            tab: default_tab,
        };
    },
    computed: {
        createLabel() {
            return this.$q.screen.gt.sm ? 'Create Account' : 'Account';
        },
        tlosNativeLabel() {
            return this.$q.screen.gt.sm ? 'Send TLOS (Native)' : 'TLOS';
        },
        tlosEvmLabel() {
            return this.$q.screen.gt.sm ? 'Send TLOS (EVM)' : 'EVM TLOS';
        },
    },
    mounted() {
        this.checkTabFromUrl();
        this.$router.push({ query: { tab: this.tab }});
    },
    methods: {
        ...mapActions('testnet', ['faucet', 'evmFaucet', 'account']),
        async onFaucet() {
            this.submitting = true;
            const result = await this.faucet(this.form.send_to);
            console.log('result', result);
            if (result) {
                Notify.create({
                    message: result,
                    position: 'top',
                    color: 'primary',
                    textColor: 'white',
                    actions: [{ label: 'Dismiss', color: 'white' }],
                });
                this.transactionId = result.transactionId;
            }
            this.submitting = false;
        },
        async onEvmFaucet() {
            this.submitting = true;
            const result = await this.evmFaucet(this.form.send_to_evm);
            console.log('result', result);
            if (result) {
                Notify.create({
                    message: result,
                    position: 'top',
                    color: 'primary',
                    textColor: 'white',
                    actions: [{ label: 'Dismiss', color: 'white' }],
                });
                this.transactionId = result.transactionId;
            }
            this.submitting = false;
        },
        async onAccount() {
            this.submitting = true;
            const result = await this.account(this.form);
            console.log('result', result);
            if (result) {
                Notify.create({
                    message: result,
                    position: 'top',
                    color: 'primary',
                    textColor: 'white',
                    actions: [{ label: 'Dismiss', color: 'white' }],
                });
                this.transactionId = result.transactionId;
            }
            this.submitting = false;
        },
        checkTabFromUrl() {
            const tabQueryParam = this.$route.query.tab;
            if (tabQueryParam && available_tabs.includes(tabQueryParam)) {
                this.tab = tabQueryParam;
            } else {
                this.tab = default_tab;
            }
        },
    },
    watch: {
        '$route.query.tab'(newTab) {
            this.tab = newTab || default_tab;
        },
        tab(newTab) {
            this.$router.push({ query: { tab: newTab }});
        }
    },
};
</script>

<template>
    <q-page class="p-dev-page flex flex-center">
        <div class="p-dev-page__title-card">
            <div class="p-dev-page__title">Testnet Developers Tools</div>
            <div class="text-subtitle2">
                Use the following tools to create a new account,
                send TLOS tokens to a Telos native account,
                or send TLOS tokens to an EVM compatible address.
            </div>
        </div>
        <q-card class="p-dev-page__main-card">
            <q-tabs class="p-dev-page__tabs-tabs text-primary shadow-2" align="justify" v-model="tab" dense>
                <q-tab class="p-dev-page__tabs-tab" name="create" :label="createLabel" />
                <q-tab class="p-dev-page__tabs-tab" name="tlos-native" :label="tlosNativeLabel" />
                <q-tab class="p-dev-page__tabs-tab" name="tlos-evm" :label="tlosEvmLabel" />
            </q-tabs>
    
            <q-tab-panels class="p-dev-page__panels" v-model="tab" animated>
                <q-tab-panel class="p-dev-page__panel" name="create">
                    <q-card-section class="p-dev-page__panel-section">
                        <div class="text-h6">Create a New Testnet Account</div>
                        <div class="text-subtitle2">
                            Here you can create a new account by providing a unique
                            name and public keys for owner and active permissions.
                        </div>
                    </q-card-section>
                    <!-- Inputs and button for creating account -->
                    <q-input
                        class="q-mb-lg"
                        ref="account_name"
                        v-model="form.account_name"
                        color="primary"
                        label="Account name"
                        outlined="outlined"
                        maxlength="12"></q-input>
                    <q-input
                        class="q-mb-lg"
                        ref="owner_key"
                        v-model="form.owner_key"
                        color="primary"
                        label="Owner key"
                        outlined="outlined"></q-input>
                    <q-input
                        class="q-mb-lg"
                        ref="active_key"
                        v-model="form.active_key"
                        color="primary"
                        label="Active key"
                        outlined="outlined"></q-input>
                    <div class="p-dev-page__expand"></div>
                    <q-btn
                        v-if="!transactionId"
                        class="p-dev-page__panel-btn"
                        color="primary"
                        label="Create testnet account"
                        size="lg"
                        unelevated="unelevated"
                        :loading="submitting"
                        @click="onAccount"></q-btn>
                    <q-btn
                        v-if="transactionId"
                        class="p-dev-page__panel-btn p-dev-page__trx-id"
                        color="secondary"><a href="#" targe="_blank">{{ transactionId }}</a></q-btn>
                </q-tab-panel>
        
                <q-tab-panel class="p-dev-page__panel" name="tlos-native">
                    <q-card-section class="p-dev-page__panel-section">
                        <div class="text-h6">Send TLOS to Telos Account</div>
                        <div class="text-subtitle2">Use this tab to send TLOS tokens to a Telos native account.</div>
                    </q-card-section>
                    <!-- Inputs and button for sending TLOS to native account -->
                    <q-input
                        class="q-mb-lg"
                        ref="send_to_evm"
                        v-model="form.send_to"
                        color="primary"
                        label="Send to Telos account"
                        maxlength="12"
                        outlined="outlined"></q-input>
                    <div class="p-dev-page__expand"></div>
                    <q-btn
                        v-if="!transactionId"
                        class="p-dev-page__panel-btn"
                        color="primary"
                        label="Send testnet TLOS"
                        size="lg"
                        unelevated="unelevated"
                        :loading="submitting"
                        @click="onFaucet"></q-btn>
                    <q-btn
                        v-if="transactionId"
                        class="p-dev-page__panel-btn p-dev-page__trx-id"
                        color="secondary"><a href="#" targe="_blank">{{ transactionId }}</a></q-btn>
                </q-tab-panel>
        
                <q-tab-panel class="p-dev-page__panel" name="tlos-evm">
                    <q-card-section class="p-dev-page__panel-section">
                        <div class="text-h6">Send TLOS to EVM Address</div>
                        <div class="text-subtitle2">
                            Send TLOS tokens to an EVM compatible address with this option.
                        </div>
                    </q-card-section>
                    <!-- Inputs and button for sending TLOS to EVM address -->
                    <q-input
                        class="q-mb-lg"
                        ref="send_to_evm"
                        v-model="form.send_to_evm"
                        color="primary"
                        label="Send to EVM address"
                        :rules="[
                            val => /^0x[a-fA-F0-9]{40}$/.test(val) ||
                            'Please provide a valid EVM address with 0x prefix'
                        ]"
                        outlined="outlined"></q-input>
                    <div class="p-dev-page__expand"></div>
                    <q-btn
                        v-if="!transactionId"
                        class="p-dev-page__panel-btn"
                        color="primary"
                        label="Send testnet EVM TLOS"
                        size="lg"
                        unelevated="unelevated"
                        :loading="submitting"
                        @click="onEvmFaucet"></q-btn>
                    <q-btn
                        v-if="transactionId"
                        class="p-dev-page__panel-btn p-dev-page__trx-id"
                        color="secondary"><a href="#" targe="_blank">{{ transactionId }}</a></q-btn>
                </q-tab-panel>
            </q-tab-panels>
        </q-card>
    </q-page>
</template>


<style lang="scss">

.flex-grow-1 {
    flex-grow: 1;
}
.p-dev-page {
    &__main-card, &__title-card {
        margin: 0 auto;
        width: 90%;
        max-width: 1000px;
        padding: 0 93px;
        min-height: 75vh;
        display: flex;
        flex-direction: column;
    }
    &__title-card {
        min-height: 0px;
        margin-bottom: 16px;
    }
    &__title {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 16px;
    }
    &__tabs-tabs {
        display: block !important;
        margin: 20px 16px;
        font-size: 16px;
        font-weight: 600;
    }
    &__tabs-tab {
        text-transform: none !important;
    }
    &__panels {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        .q-panel {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }
    }
    &__panel {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
    &__panel-section {
        margin-bottom: 46px;
    }
    &__panel-btn {
        margin-bottom: 26px;
        widows: 100%;
    }
    &__trx-id {
        margin-bottom: 26px;
        widows: 100%;
    }
    &__expand {
        flex-grow: 1;
    }
}

@media (max-width: 850px) {
    .p-dev-page {
        &__main-card {
            padding: 0 16px;
            min-height: 70vh;
        }
        &__title-card {
            padding: 0 16px;
            min-height: 0px;
        }
    }
}
</style>
