<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Notify } from 'quasar';

const store = useStore();
const $q = useQuasar();
const route = useRoute();
const router = useRouter();

// proxy functions for vuex actions
function faucet(send_to: string) {
    return store.dispatch('testnet/faucet', send_to);
}
function evmFaucet(send_to_evm: string) {
    return store.dispatch('testnet/evmFaucet', send_to_evm);
}
function createAccount(form: {
  account_name: string;
  owner_key: string;
  active_key: string;
}) {
    return store.dispatch('testnet/account', form);
}
function getAccount(account: string) {
    return store.dispatch('testnet/getAccount', account);
}

const availableTabs = ['create', 'tlos-native', 'tlos-evm'];
const defaultTab = 'create';

const transactionId = ref('');
const submitting = ref(false);
const tab = ref(defaultTab);

// Tab labels
const createLabel = computed(() => {
    return $q.screen.gt.sm ? 'Create Account' : 'Account';
});

const tlosNativeLabel = computed(() => {
    return $q.screen.gt.sm ? 'Send TLOS (Native)' : 'TLOS';
});

const tlosEvmLabel = computed(() => {
    return $q.screen.gt.sm ? 'Send TLOS (EVM)' : 'EVM TLOS';
});

// Result Notifications
async function handleAnswer(answer: string | object, successMessage: string) {
    if (typeof answer === 'string') {
        Notify.create({
            message: answer,
            position: 'top',
            color: 'negative',
            textColor: 'white',
            actions: [{ label: 'Dismiss', color: 'white' }],
        });
    } else if (typeof answer === 'object') {
        Notify.create({
            message: successMessage,
            position: 'top',
            color: 'primary',
            textColor: 'white',
            actions: [{ label: 'Dismiss', color: 'white' }],
        });
    }
}

const createAccountForm = ref({
    account_name: '',
    owner_key: '',
    active_key: '',
    available: false,
    checking_account: false,
});

function checkAccountAvailability(account_name: string) {
    // check if the account name has an invalid character,
    // allowed characters are lowercase letters and numbers from 1 to 5
    if (!/^[a-z1-5]+$/.test(account_name)) {
        createAccountForm.value.available = false;
        return 'uso only lowercase letters and numbers from 1 to 5';
    }

    // check first that the account name is 12 characters long
    if (account_name.length < 12) {
        createAccountForm.value.available = false;
        return 'Account name must be 12 characters long';
    }

    return getAccount(account_name)
        .then(() => {
            createAccountForm.value.available = false;
            return 'Account already exists';
        })
        .catch(() => {
            createAccountForm.value.available = true;
            return true;
        })
        .finally(() => {
            createAccountForm.value.checking_account = false;
        });
}

function isAnyInputInvalid() {
    return (
        !createAccountForm.value.account_name ||
    createAccountForm.value.account_name.length !== 12 ||
    !/^EOS[0-9A-Za-z]{50}$|^PUB_K1_[0-9A-Za-z]{50}$/i.test(
        createAccountForm.value.owner_key
    ) ||
    !/^EOS[0-9A-Za-z]{50}$|^PUB_K1_[0-9A-Za-z]{50}$/i.test(
        createAccountForm.value.active_key
    )
    );
}

function isCreateAccountButtonDisabled() {
    return (
        !createAccountForm.value.account_name ||
    !createAccountForm.value.owner_key ||
    !createAccountForm.value.active_key ||
    !createAccountForm.value.available ||
    submitting.value ||
    isAnyInputInvalid()
    );
}

// Tab Send TLOS validations
const sendTlosForm = ref({
    send_to_evm: '',
    send_to_zero: '',
    account_exists: false,
    checking_account: false,
});

function checkAccountExists(account: string) {
    return getAccount(account)
        .then(() => {
            sendTlosForm.value.account_exists = true;
            return true;
        })
        .catch(() => {
            sendTlosForm.value.account_exists = false;
            return 'Account does not exist';
        })
        .finally(() => {
            sendTlosForm.value.checking_account = false;
        });
}

function isValidEvmAddress() {
    return /^0x[a-fA-F0-9]{40}$/.test(sendTlosForm.value.send_to_evm);
}

function isValidTelosAccount() {
    return sendTlosForm.value.account_exists;
}

async function onFaucet() {
    if (isValidTelosAccount()) {
        submitting.value = true;
        const result = await faucet(sendTlosForm.value.send_to_zero);
        handleAnswer(result, '50.0000 TLOS were sent successfully');
        submitting.value = false;
    } else {
        Notify.create({
            message: 'Please provide a valid Telos account name',
            position: 'top',
            color: 'negative',
            textColor: 'white',
            actions: [{ label: 'Dismiss', color: 'white' }],
        });
    }
}

async function onEvmFaucet() {
    if (isValidEvmAddress()) {
        submitting.value = true;
        const result = await evmFaucet(sendTlosForm.value.send_to_evm);
        handleAnswer(result, '50.0 TLOS were sent successfully');
        submitting.value = false;
    } else {
        Notify.create({
            message: 'Please provide a valid EVM address',
            position: 'top',
            color: 'negative',
            textColor: 'white',
            actions: [{ label: 'Dismiss', color: 'white' }],
        });
    }
}

async function onAccount() {
    if (!isCreateAccountButtonDisabled()) {
        submitting.value = true;
        const result = await createAccount({
            account_name: createAccountForm.value.account_name,
            owner_key: createAccountForm.value.owner_key,
            active_key: createAccountForm.value.active_key,
        });
        handleAnswer(result, 'Account created successfully');
        submitting.value = false;
    } else {
        if (!createAccountForm.value.available) {
            Notify.create({
                message: 'That account name is not available',
                position: 'top',
                color: 'negative',
                textColor: 'white',
                actions: [{ label: 'Dismiss', color: 'white' }],
            });
        } else if (createAccountForm.value.account_name.length !== 12) {
            Notify.create({
                message: 'Account name must be 12 characters long',
                position: 'top',
                color: 'negative',
                textColor: 'white',
                actions: [{ label: 'Dismiss', color: 'white' }],
            });
        } else if (
            !/^EOS[0-9A-Za-z]{50}$|^PUB_K1_[0-9A-Za-z]{50}$/i.test(
                createAccountForm.value.owner_key
            )
        ) {
            Notify.create({
                message: 'Please provide a valid Owner key',
                position: 'top',
                color: 'negative',
                textColor: 'white',
                actions: [{ label: 'Dismiss', color: 'white' }],
            });
        } else if (
            !/^EOS[0-9A-Za-z]{50}$|^PUB_K1_[0-9A-Za-z]{50}$/i.test(
                createAccountForm.value.active_key
            )
        ) {
            Notify.create({
                message: 'Please provide a valid Active key',
                position: 'top',
                color: 'negative',
                textColor: 'white',
                actions: [{ label: 'Dismiss', color: 'white' }],
            });
        }
    }
}

// Tabs checkings
function checkTabFromUrl() {
    const tabQueryParam = (route.query.tab ?? defaultTab) as unknown as string;
    if (tabQueryParam && availableTabs.includes(tabQueryParam)) {
        tab.value = tabQueryParam;
    } else {
        tab.value = defaultTab;
    }
}

watch(route.query, (newQuery) => {
    if (
        newQuery.tab &&
    availableTabs.includes((newQuery.tab ?? defaultTab) as string)
    ) {
        tab.value = newQuery.tab as string;
    } else {
        tab.value = defaultTab;
    }
});

watch(tab, (newTab) => {
    router.push({ query: { tab: newTab } });
});

// Initialize
checkTabFromUrl();
</script>
<template>
  <q-page class="p-dev-page flex flex-center">
    <div class="p-dev-page__title-card">
      <div class="p-dev-page__title">
        {{ $t("pages.testnet_developers.page_title") }}
      </div>
      <div class="text-subtitle2">
        {{ $t("pages.testnet_developers.page_subtitle") }}
      </div>
    </div>
    <q-card class="p-dev-page__main-card">
      <q-tabs
        class="p-dev-page__tabs-tabs text-primary shadow-2"
        align="justify"
        v-model="tab"
        dense
      >
        <q-tab
          class="p-dev-page__tabs-tab"
          name="create"
          :label="createLabel"
        />
        <q-tab
          class="p-dev-page__tabs-tab"
          name="tlos-native"
          :label="tlosNativeLabel"
        />
        <q-tab
          class="p-dev-page__tabs-tab"
          name="tlos-evm"
          :label="tlosEvmLabel"
        />
      </q-tabs>

      <q-tab-panels class="p-dev-page__panels" v-model="tab" animated>
        <q-tab-panel class="p-dev-page__panel" name="create">
          <q-card-section class="p-dev-page__panel-section">
            <div class="text-h6">
              {{ $t("pages.testnet_developers.create_new_account_title") }}
            </div>
            <div class="text-subtitle2">
              {{ $t("pages.testnet_developers.create_new_account_subtitle") }}
            </div>
          </q-card-section>
          <q-input
            class="q-mb-lg"
            ref="account_name"
            v-model="createAccountForm.account_name"
            color="primary"
            label="Account name"
            outlined="outlined"
            maxlength="12"
            :loading="createAccountForm.checking_account"
            :rules="[checkAccountAvailability]"
          ></q-input>
          <q-input
            class="q-mb-lg"
            ref="owner_key"
            v-model="createAccountForm.owner_key"
            color="primary"
            label="Owner key"
            :rules="[
              (val) =>
                /^EOS[0-9A-Za-z]{50}$|^PUB_K1_[0-9A-Za-z]{50}$/i.test(val) ||
                'Please provide a valid Owner key',
            ]"
            outlined="outlined"
          ></q-input>
          <q-input
            class="q-mb-lg"
            ref="active_key"
            v-model="createAccountForm.active_key"
            color="primary"
            label="Active key"
            :rules="[
              (val) =>
                /^EOS[0-9A-Za-z]{50}$|^PUB_K1_[0-9A-Za-z]{50}$/i.test(val) ||
                'Please provide a valid Active key',
            ]"
            outlined="outlined"
          ></q-input>
          <div class="p-dev-page__expand"></div>
          <q-btn
            v-if="!transactionId"
            class="p-dev-page__panel-btn"
            color="primary"
            label="Create testnet account"
            size="lg"
            unelevated="unelevated"
            :loading="submitting"
            :disable="isCreateAccountButtonDisabled"
            @click="onAccount"
          ></q-btn>
          <q-btn
            v-if="transactionId"
            class="p-dev-page__panel-btn p-dev-page__trx-id"
            color="secondary"
            ><a href="#" targe="_blank">{{ transactionId }}</a></q-btn
          >
        </q-tab-panel>

        <q-tab-panel class="p-dev-page__panel" name="tlos-native">
          <q-card-section class="p-dev-page__panel-section">
            <div class="text-h6">
              {{ $t("pages.testnet_developers.send_tlos_telos_title") }}
            </div>
            <div class="text-subtitle2">
              {{ $t("pages.testnet_developers.send_tlos_telos_subtitle") }}
            </div>
          </q-card-section>
          <!-- we need to ensure the account does not exist with a rule -->
          <q-input
            class="q-mb-lg"
            ref="send_to_evm"
            v-model="sendTlosForm.send_to_zero"
            color="primary"
            label="Send to Telos account"
            outlined="outlined"
            :loading="sendTlosForm.checking_account"
            :rules="[checkAccountExists]"
          ></q-input>
          <div class="p-dev-page__expand"></div>
          <q-btn
            v-if="!transactionId"
            class="p-dev-page__panel-btn"
            color="primary"
            label="Send testnet TLOS"
            size="lg"
            unelevated="unelevated"
            :loading="submitting"
            @click="onFaucet"
          ></q-btn>
          <q-btn
            v-if="transactionId"
            class="p-dev-page__panel-btn p-dev-page__trx-id"
            color="secondary"
            ><a href="#" targe="_blank">{{ transactionId }}</a></q-btn
          >
        </q-tab-panel>

        <q-tab-panel class="p-dev-page__panel" name="tlos-evm">
          <q-card-section class="p-dev-page__panel-section">
            <div class="text-h6">
              {{ $t("pages.testnet_developers.send_tlos_evm_title") }}
            </div>
            <div class="text-subtitle2">
              {{ $t("pages.testnet_developers.send_tlos_evm_subtitle") }}
            </div>
          </q-card-section>
          <!-- Inputs and button for sending TLOS to EVM address -->
          <q-input
            class="q-mb-lg"
            ref="send_to_evm"
            v-model="sendTlosForm.send_to_evm"
            color="primary"
            label="Send to EVM address"
            :rules="[
              (val) =>
                /^0x[a-fA-F0-9]{40}$/.test(val) ||
                'Please provide a valid EVM address with 0x prefix',
            ]"
            outlined="outlined"
          ></q-input>
          <div class="p-dev-page__expand"></div>
          <q-btn
            v-if="!transactionId"
            class="p-dev-page__panel-btn"
            color="primary"
            label="Send testnet EVM TLOS"
            size="lg"
            unelevated="unelevated"
            :loading="submitting"
            @click="onEvmFaucet"
          ></q-btn>
          <q-btn
            v-if="transactionId"
            class="p-dev-page__panel-btn p-dev-page__trx-id"
            color="secondary"
            ><a href="#" targe="_blank">{{ transactionId }}</a></q-btn
          >
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
  flex-direction: column;
  &__main-card,
  &__title-card {
    margin: 20px auto 0px auto;
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
