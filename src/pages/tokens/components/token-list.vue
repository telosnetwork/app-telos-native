<template>
  <div
    class="list-container q-pa-md"
    :class="selectedToken ? 'token-selected' : ''"
  >
    <template v-if="!createToken && !editingToken">
      <token-detail
        class="token-preview q-mb-md show-close-btn"
        v-bind="mapSelectedToDetails"
        @close="clear"
        @edit="edit"
        @transfer="transfer"
        @open="open"
        @issue="issue"
        @retire="retire"
      ></token-detail>
      <q-table
        class="token-list"
        title="Tokens"
        v-model:pagination="pagination"
        :rows="tokens"
        :columns="columns"
        row-key="name"
        @row-click="rowClicked"
      >
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div class="d-flex flex justify-between items-center">
              <q-avatar rounded>
                <img :src="props.row.logo_sm" />
              </q-avatar>
              <span class="q-ml-md">{{ props.row.token_name }}</span>
            </div>
          </q-td>
        </template>
        <template v-slot:top-right v-if="!createToken && isAuthenticated">
          <q-btn
            color="primary"
            icon-right="fas fa-solid fa-plus"
            label="Create new token"
            no-caps
            @click="create"
          />
        </template>
      </q-table>
    </template>

    <!-- Token Action Dialogs -->
    <q-dialog v-model="issueDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Issue</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Issue more {{ this.mapSelectedToDetails.symbol }} tokens
        </q-card-section>
        <q-card-section>
          <q-input
            v-model.number="amountToIssue"
            type="number"
            label="Amount"
            :placeholder="`Max - ${getUnissued()}`"
            :rules="[
              (val) => !!val || '* Required',
              (val) => {
                return (
                  val <= this.getUnissued() ||
                  `Can only issue ${this.getUnissued()}`
                );
              },
            ]"
          ></q-input>
          <q-input v-model="issueMemo" label="Memo"> </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Issue" color="primary" @click="doIssue" />
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="retireDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Retire {{ this.mapSelectedToDetails.symbol }} tokens</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model.number="amountToRetire"
            type="number"
            label="Amount"
            :placeholder="`Max - ${getBalanceNumber()}`"
            :rules="[
              (val) => !!val || '* Required',
              (val) => {
                return (
                  val <= this.getBalanceNumber() ||
                  `Can only retire ${this.getBalanceNumber()}`
                );
              },
            ]"
          ></q-input>
          <q-input v-model="retireMemo" label="Memo"> </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Retire" @click="doRetire" color="primary" />
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="transferDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Transfer tokens</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model.number="amountToTransfer"
            type="number"
            label="Amount"
            :placeholder="`Max - ${getBalanceNumber()}`"
            :rules="[
              (val) => !!val || '* Required',
              (val) => {
                return (
                  val <= this.getBalanceNumber() ||
                  `Can only transfer ${this.getBalanceNumber()}`
                );
              },
            ]"
          ></q-input>
          <q-input v-model="transferTo" label="To"> </q-input>
          <q-input v-model="transferMemo" label="Memo"> </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Transfer" @click="doTransfer" color="primary" />
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<style lang="sass" scoped>

.token-preview
  opacity: 0
  overflow: hidden
  padding-top: 0px
  padding-bottom: 0px
  max-height: 0px
  transition-property: max-height, opacity, padding
  transition-duration: 0.2s
  .token-selected &
    opacity: 1
    max-height: 400px
    transition-duration: 0.5s

@import '~quasar/src/css/variables'

.list-container
  min-width: auto

@media (min-width: $breakpoint-md-min)
  .list-container
    min-width: 900px
</style>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
import TokenDetail from "./token-detail.vue";
export default {
  name: "TokenList",
  components: {
    TokenDetail,
  },
  data() {
    return {
      pagination: {
        rowsPerPage: 20,
      },
      selectedToken: null,
      balance: null,
      stat: null,
      editable: false,
      columns: [
        {
          name: "name",
          label: "Name",
          field: "token_name",
        },
        {
          name: "symbol",
          label: "Symbol",
          field: (row) => row.token_symbol.split(",")[1],
        },
        {
          name: "decimals",
          label: "Decimals",
          field: (row) => row.token_symbol.split(",")[0],
        },
        {
          name: "owner",
          label: "Owner",
          field: "token_owner",
        },
        {
          name: "contract",
          label: "Contract",
          field: "contract_account",
        },
      ],
      // token actions (migrated from token-edit) --------------
      transferDialog: false,
      issueDialog: false,
      retireDialog: false,
      amountToIssue: null,
      amountToRetire: null,
      amountToTransfer: null,
      issueMemo: null,
      retireMemo: null,
      transferMemo: null,
      transferTo: null,
    };
  },
  computed: {
    ...mapGetters("tokens", ["tokens"]),
    ...mapGetters("accounts", ["isAuthenticated", "account"]),
    ...mapState("tokens", ["createToken", "editingToken"]),
    mapSelectedToDetails() {
      if (!this.selectedToken) return null;

      return {
        name: this.selectedToken.token_name,
        symbol: this.selectedToken.token_symbol.split(",")[1],
        decimals: this.selectedToken.token_symbol.split(",")[0],
        owner: this.selectedToken.token_owner,
        logo_sm: this.selectedToken.logo_sm,
        logo_lg: this.selectedToken.logo_lg,
        contract: this.selectedToken.contract_account,
        stat: this.stat,
        balance: this.balance,
        editable: this.editable,
        retireable: this.editable,
        issuable: this.canIssue(),
      };
    },
  },
  methods: {
    async setStat() {
      if (!this.selectedToken) return;

      let result = await this.$store.$api.getTableRows({
        code: this.selectedToken.contract_account,
        scope: this.selectedToken.token_symbol.split(",")[1],
        table: "stat",
      });

      if (result.rows.length) {
        this.stat = result.rows[0];
      } else {
        this.stat = null;
      }
    },
    async setBalance() {
      if (!this.selectedToken) return;

      let result = await this.$store.$api.getTableRows({
        code: this.selectedToken.contract_account,
        scope: this.account,
        table: "accounts",
        lower_bound: this.selectedToken.token_symbol.split(",")[1],
      });
      if (result.rows.length) {
        this.balance = result.rows[0].balance;
      } else {
        this.balance = null;
        // this.balance =
        //   (0).toFixed(parseInt(this.selectedToken.token_symbol.split(",")[0])) +
        //   " " +
        //   this.selectedToken.token_symbol.split(",")[1];
      }
    },
    transfer() {
      console.log("transfer()");
      this.transferDialog = true;
    },
    retire() {
      console.log("retire()");
      this.retireDialog = true;
    },
    issue() {
      console.log("issue()");
      this.issueDialog = true;
    },
    open() {
      console.log("open()");
      this.doOpen();
    },
    edit() {
      this.$store.commit("tokens/editToken", this.selectedToken);
    },
    create() {
      this.clear();
      this.$store.commit("tokens/createToken", true);
    },
    clear() {
      this.editable = false;
      this.selectedToken = null;
      this.$store.commit("tokens/editToken", null);
      this.$store.commit("tokens/createToken", false);
    },
    rowClicked(evt, row) {
      this.clear();
      this.selectedToken = row;
      this.editable = row.token_owner === this.account;
      this.setBalance();
      this.setStat();
    },
    // token actions (migrated from token-edit) --------------
    ...mapActions("accounts", ["isAccountFree"]),
    ...mapActions("tokens", ["openToken", "issueTokens", "retireTokens", "transferTokens"]),
    getBalanceNumber() {
      return this.hasBalance() ? parseFloat(this.balance.split(" ")[0]) : 0.0;
    },
    hasBalance() {
      if (!this.balance) return false;

      return parseFloat(this.balance.split(" ")[0]) > 0;
    },
    canIssue() {
      return this.editable && this.stat && this.getUnissued() > 0;
    },
    getUnissued() {
      if (!this.stat) return;

      return (
        parseFloat(this.stat.max_supply.split(" ")[0]) -
        parseFloat(this.stat.supply.split(" ")[0])
      );
    },
    async doOpen() {
      await this.openToken({
        ...this.mapSelectedToDetails,
        contractAccount: this.mapSelectedToDetails.contract,
        memo: this.retireMemo ? this.retireMemo : "",
        amount: this.amountToRetire,
      });
      this.setBalance();
      this.setStat();
      this.amountToRetire = null;
      this.retireMemo = null;
      this.retireDialog = false;
    },
    async doIssue() {
      if (!this.amountToIssue) {
        this.$q.notify({
          type: "negative",
          message: "Please specify an amount to issue",
        });
        return;
      }
      await this.issueTokens({
        ...this.mapSelectedToDetails,
        contractAccount: this.mapSelectedToDetails.contract,
        memo: this.issueMemo ? this.issueMemo : "",
        amount: this.amountToIssue,
      });
      this.setBalance();
      this.setStat();
      this.amountToIssue = null;
      this.retireMemo = null;
      this.issueDialog = false;
    },
    async doRetire() {
      if (!this.amountToRetire) {
        this.$q.notify({
          type: "negative",
          message: "Please specify an amount to retire",
        });
        return;
      }
      await this.retireTokens({
        ...this.mapSelectedToDetails,
        contractAccount: this.mapSelectedToDetails.contract,
        memo: this.retireMemo ? this.retireMemo : "",
        amount: this.amountToRetire,
      });
      this.setBalance();
      this.setStat();
      this.amountToRetire = null;
      this.retireMemo = null;
      this.retireDialog = false;
    },
    async doTransfer() {
      if (!this.amountToTransfer) {
        this.$q.notify({
          type: "negative",
          message: "Please specify an amount to transfer",
        });
        return;
      }
      if (!this.transferTo) {
        this.$q.notify({
          type: "negative",
          message: "Please specify an account to transfer to",
        });
        return;
      }
      let invalidAccount = await this.isAccountFree(this.transferTo);
      if (invalidAccount) {
        this.$q.notify({
          type: "negative",
          message: `Account ${this.transferTo} does not exist`,
        });
        return;
      }
      await this.transferTokens({
        ...this.mapSelectedToDetails,
        contractAccount: this.mapSelectedToDetails.contract,
        memo: this.transferMemo ? this.transferMemo : "",
        amount: this.amountToTransfer,
        to: this.transferTo,
      });
      this.setBalance();
      this.setStat();
      this.amountToTransfer = null;
      this.transferTo = null;
      this.transferMemo = null;
      this.transferDialog = false;
    },
  },
  beforeUnmount: function () {
    this.clear();
  },
};
</script>
