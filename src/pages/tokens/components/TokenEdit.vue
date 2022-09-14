<!-- eslint-disable vue/no-child-content -->
<template>
  <div
    class="form-container q-pa-md column"
    :class="acceptedTerms ? 'terms-accepted' : ''"
  >
    <token-detail
      class="q-mb-md show-close-btn"
      :name="token.name ? token.name : 'Token name'"
      :symbol="token.symbol ? token.symbol : 'SYMBOL'"
      :decimals="token.decimals"
      :stat="editing_stat"
      :logo_sm="token.logo_sm ? token.logo_sm : defaultIcon"
      :logo_lg="token.logo_lg ? token.logo_lg : defaultIcon"
      @close="cancelEdit"
    ></token-detail>

    <q-card>
      <div class="q-pa-lg text-h4">
        {{ editingToken ? "Edit your token's info" : "Create a new token" }}
      </div>

      <q-form
        ref="myform"
        @submit="submit"
      >

        <q-card-section class="terms-section">
          <div class="terms q-pa-md" v-html="getTermsHtml"></div>
          <q-field
            ref="toggle"
            :value="acceptedTerms"
            :rules="[
              !!val || 'You must accept the terms'
            ]"
            borderless
            dense
          >
            <template v-slot:control>
              <q-checkbox
                v-model="acceptedTerms"
                color="green"
                label="Please acknowledge these terms"
              >
              </q-checkbox>
            </template>
          </q-field>
        </q-card-section>
        <q-card-section class="form-fields">
          <q-input
            v-model="token.name"
            label="Token name"
            lazy-rules
            :rules="[
              (val) => !!val || '* Required'
            ]"
          ></q-input>
          <q-input
            v-model="token.symbol"
            counter
            :readonly="!!editingToken"
            label="Symbol"
            @input="
              (val) => (token.symbol = val.toUpperCase().replace(/[^A-Z]/g, ''))
            "
            lazy-rules
            :rules="[
              (val) => !!val || '* Required',
              (val) => !val || val.length <= 6 || 'Symbols can only be 6 characters'
            ]"
          ></q-input>
          <q-input
            v-model.number="token.decimals"
            type="number"
            :readonly="!!editingToken"
            label="Decimals"
            lazy-rules
            :rules="[
              (val) => !!val || '* Required',
              (val) => val <= 9 || 'Can only have up to 9 decimals of precision',
            ]"
          ></q-input>
          <q-input
            ref="input_supply"
            v-model.number="token.supply"
            type="number"
            v-if="createToken && token.decimals"
            label="Max supply"
            @input="
              (val) =>
                token.decimals &&
                (token.supply = parseFloat(val.toFixed(token.decimals)))
            "
            lazy-rules
            :rules="[
              (val) => !!val || '* Required',
              (val) => {
                return (
                  parseInt(val.toFixed(token.decimals).replace(/\./g, '')) <
                    4611686018427388000 ||
                  '* supply (without decimals) must be less than 4611686018427388000'
                );
              },
            ]"
          ></q-input>
          <q-input v-model="token.logo_sm" label="Small logo URL"></q-input>
          <q-input v-model="token.logo_lg" label="Large logo URL"></q-input>
        </q-card-section>
        <q-card-section class="footer-buttons q-mt-lg">
          <q-card-actions>
            <q-btn class="q-mr-auto" no-caps label="Cancel" @click="cancelEdit" />
            
            <q-btn color="primary" no-caps type="submit">{{
              createToken ? `Create for ${this.config.create_price}` : "Save"
            }}</q-btn>
          </q-card-actions>
        </q-card-section>

      </q-form>
    </q-card>
  </div>
</template>

<style lang="sass" scoped>
.terms
  opacity: 1
  overflow: hidden
  max-height: 190px
  transition-property: max-height, opacity, padding
  transition-duration: 0.5s
  .terms-accepted &
    opacity: 0
    padding-top: 0px
    padding-bottom: 0px
    max-height: 0px

.terms-section
  transition-duration: 0.5s
  transition-property: padding
  .terms-accepted &
    padding-top: 0px

.form-fields, .footer-buttons
  opacity: 0
  overflow: hidden
  padding-top: 0px
  padding-bottom: 0px
  max-height: 0px
  transition-property: max-height, opacity, padding
  transition-duration: 0.5s
  .terms-accepted &
    opacity: 1
    max-height: 400px

@import '~quasar/src/css/variables'

.form-container
  min-width: auto

@media (min-width: $breakpoint-md-min)
  .form-container
    min-width: 900px
</style>

<script>
import TokenDetail from "./TokenDetail.vue";
import { mapState, mapGetters, mapActions } from "vuex";
const defaultIcon = "statics/generic-token.svg";
export default {
  name: "TokenEdit",
  components: {
    TokenDetail,
  },
  data() {
    return {
      token: {
        name: null,
        symbol: null,
        decimals: null,
        supply: null,
        logo_sm: null,
        logo_lg: null,
        contract_account: null,
        owner: null,
      },
      defaultIcon,
      balance: null,
      stat: null,
      acceptedTerms: false,
    };
  },
  computed: {
    ...mapState("tokens", ["createToken", "editingToken", "config"]),
    ...mapGetters("accounts", ["account"]),
    editing_stat() {
      if (this.editingToken) {
        return this.stat
      } else {

        if (!this.token.decimals) return null;
        if (!this.token.symbol) return null;

        let supply = (0).toFixed(this.token.decimals) + " " + this.token.symbol;
        let max_supply = (this.token.supply || (0)).toFixed(this.token.decimals) + " " + this.token.symbol;
        let issuer = this.account;

        return { supply, max_supply, issuer };
      }
    },
    getTermsHtml() {
      return `Terms:
            ${
              !this.editingToken
                ? `There will be a fee of <strong>${this.config.create_price}</strong> to create a new token.  `
                : ""
            }
          If this token is found to be misleading, scamming or attempting to
          present itself as another existing token then it will be removed from the token registry (the token itself will remain untouched).
          <br>
          <br>
          <strong>We reserve the right to delist tokens for any reason.</strong>`;
    },
  },
  mounted() {
    this.setToken();
  },
  watch: {
    editingToken(val) {
      this.setToken();
    },
  },
  methods: {
    ...mapActions("accounts", ["isAccountFree"]),
    ...mapActions("tokens", [
      "setMeta",
      "loadTokens",
      "doCreateToken",
    ]),
    async submit() {
      if (!this.acceptedTerms) {
        this.$refs.toggle.validate();
        return;
      }
      if (this.createToken) {
        this.submitCreate();
      } else {
        this.submitSetMeta();
      }
    },
    async setStat() {
      if (!this.editingToken) return;

      let result = await this.$store.$api.getTableRows({
        code: this.editingToken.contract_account,
        scope: this.editingToken.token_symbol.split(",")[1],
        table: "stat",
      });
      if (result.rows.length) {
        this.stat = result.rows[0];
      } else {
        this.stat = null;
      }
    },
    async setBalance() {
      if (!this.editingToken) return;

      let result = await this.$store.$api.getTableRows({
        code: this.editingToken.contract_account,
        scope: this.account,
        table: "accounts",
        lower_bound: this.editingToken.token_symbol.split(",")[1],
      });
      if (result.rows.length) {
        this.balance = result.rows[0].balance;
      } else {
        this.balance = (0).toFixed(
          `${parseInt(this.editingToken.token_symbol.split(",")[0])} ${
            this.editingToken.token_symbol.split(",")[1]
          }`
        );
      }
    },
    async submitSetMeta() {
      await this.setMeta({
        symbol: this.editingToken.token_symbol,
        name: this.token.name,
        logoSm: this.token.logo_sm,
        logoLg: this.token.logo_lg,
      });
      this.loadTokens();
    },
    async submitCreate() {
      if (
        !this.token.supply ||
        isNaN(this.token.decimals) ||
        this.token.decimals < 0 ||
        !this.token.name ||
        !this.token.symbol
      ) {
        this.$q.notify({
          type: "negative",
          message: "Please fill out all the token fields",
        });
        return;
      }
      await this.doCreateToken({
        ...this.token,
        logoSm: this.token.logo_sm,
        logoLg: this.token.logo_lg,
        maxSupply: this.token.supply,
        createPrice: this.config.create_price,
      });
      this.loadTokens();
    },
    setToken() {
      if (this.editingToken) {
        this.token.name = this.editingToken.token_name;
        this.token.symbol = this.editingToken.token_symbol.split(",")[1];
        this.token.decimals = parseInt(
          this.editingToken.token_symbol.split(",")[0]
        );
        this.token.logo_sm = this.editingToken.logo_sm;
        this.token.logo_lg = this.editingToken.logo_lg;
        this.token.contract_account = this.editingToken.contract_account;
        this.token.owner = this.editingToken.token_owner;
        this.setBalance();
        this.setStat();
      } else {
        this.token = {};
      }
    },
    cancelEdit() {
      this.$store.commit("tokens/createToken", false);
      this.$store.commit("tokens/editToken", null);
    },
  },
};
</script>
