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
import { mapGetters, mapState } from "vuex";
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
        this.balance =
          (0).toFixed(parseInt(this.selectedToken.token_symbol.split(",")[0])) +
          " " +
          this.selectedToken.token_symbol.split(",")[1];
      }
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
  },
  beforeUnmount: function () {
    this.clear();
  },
};
</script>
