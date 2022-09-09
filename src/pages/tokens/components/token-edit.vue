<!-- eslint-disable vue/no-child-content -->
<template>
  <div class="form-container q-pa-md column" :class="acceptedTerms ? 'terms-accepted' : ''">
    <token-detail
      class="q-mb-md show-close-btn"
      :name="token.name ? token.name : 'Token name'"
      :symbol="token.symbol ? token.symbol : 'SYMBOL'"
      :decimals="token.decimals"
      :supply="token.supply"
      :logo_sm="token.logo_sm ? token.logo_sm : defaultIcon"
      :logo_lg="token.logo_lg ? token.logo_lg : defaultIcon"
      @close="cancelEdit"
    ></token-detail>

    <q-card>
      <div class="q-pa-lg text-h4">
        {{ editingToken ? "Edit your token's info" : "Create a new token" }}
      </div>
      <q-card-section class="terms-section">
        <div class="terms q-pa-md" v-html="getTermsHtml"></div>
        <q-field
          ref="toggle"
          :value="acceptedTerms"
          :rules="[checkTerms]"
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
        <q-input v-model="token.name" label="Token name"></q-input>
        <q-input
          v-model="token.symbol"
          counter
          :readonly="!!editingToken"
          label="Symbol"
          @input="
            (val) => (token.symbol = val.toUpperCase().replace(/[^A-Z]/g, ''))
          "
          :rules="[
            !!val || '* Required',
            (val) => val.length <= 6 || 'Symbols can only be 6 characters',
          ]"
        ></q-input>
        <q-input
          v-model.number="token.decimals"
          type="number"
          :readonly="!!editingToken"
          label="Decimals"
          :rules="[
            (val) => !!val || '* Required',
            (val) => val <= 9 || 'Can only have up to 9 decimals of precision',
          ]"
        ></q-input>
        <q-input
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
      <q-card-section class="footer-buttons">
        <q-card-actions>
          <q-btn class="q-mr-auto" no-caps label="Cancel" @click="cancelEdit" />

          <q-btn color="primary" no-caps @click="submit">{{
            createToken ? `Create for ${this.config.create_price}` : "Save"
          }}</q-btn>

          <q-btn-dropdown
            v-if="!createToken"
            color="primary"
            label="Manage Tokens"
          >
            <q-list>
              <q-item
                v-if="canIssue()"
                clickable
                v-close-popup
                @click="issueDialog = true"
              >
                <q-item-section>
                  <q-item-label>Issue</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                v-if="hasBalance()"
                clickable
                v-close-popup
                @click="retireDialog = true"
              >
                <q-item-section>
                  <q-item-label>Retire</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                v-if="hasBalance()"
                clickable
                v-close-popup
                @click="transferDialog = true"
              >
                <q-item-section>
                  <q-item-label>Transfer</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-card-actions>
      </q-card-section>
    </q-card>

    <q-dialog v-model="issueDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Issue</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Issue more {{ this.token.symbol }} tokens
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
          <div class="text-h6">Retire {{ this.token.symbol }} tokens</div>
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
import TokenDetail from "./token-detail.vue";
import { mapState, mapGetters, mapActions } from "vuex";
const defaultIcon =
  "data:image/svg+xml,%0A%3Csvg class='svg-icon' style='width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M512 0.745631C230.270757 0.745631 0.745631 230.270757 0.745631 512c0 281.729243 229.525126 511.254369 511.254369 511.254369 281.729243 0 511.254369-229.525126 511.254369-511.254369C1023.254369 230.270757 793.729243 0.745631 512 0.745631z m0 962.311456c-248.752466 0-451.057087-202.304621-451.057087-451.057087 0-248.752466 202.304621-451.057087 451.057087-451.057087 248.752466 0 451.057087 202.304621 451.057087 451.057087 0 248.752466-202.304621 451.057087-451.057087 451.057087z' fill='%232E323F' /%3E%3Cpath d='M634.134369 518.243417c-25.480699-19.22734-59.700194-30.222913-89.913165-38.464621l-2.753864-0.745631V354.403417l4.503611 0.994175c26.723417 5.994874 51.697087 17.736078 72.674175 34.219495 2.246835 1.749748 5.249243 2.753864 8.251651 2.246835a10.935922 10.935922 0 0 0 7.486136-4.245126l22.229747-28.721709a11.075107 11.075107 0 0 0-1.749747-15.479301c-30.222913-24.476583-67.18633-39.717282-109.896078-45.463611l-3.24101-0.497088v-45.950757c0-6.243417-5.000699-11.234175-11.244116-11.234175h-40.214369c-6.243417 0-11.234175 4.990757-11.234175 11.234175v46.954874l-3.250951 0.497087c-35.462214 5.497786-65.436583 19.22734-86.41367 40.214369-20.728544 20.728544-31.962718 47.203417-31.962719 76.919301 0 60.197282 33.205437 92.657087 118.624932 116.139495l2.753864 0.745631v138.617787l-4.49367-0.994175c-30.72-6.99899-60.942913-22.229748-84.673864-42.709748a12.258175 12.258175 0 0 0-8.738796-2.753864 10.40901 10.40901 0 0 0-7.744621 4.49367l-21.722719 30.222913c-3.250951 4.49367-2.753864 10.995573 1.491263 14.73367 30.72 28.73165 72.177087 46.457786 122.88 52.701204l3.250951 0.497087v44.956583c0 6.243417 4.990757 11.234175 11.234175 11.234174h40.214369c6.243417 0 11.234175-4.990757 11.234174-11.234174v-43.445437l3.250952-0.258486c40.462913-4.245126 72.425631-17.487534 95.162408-39.210252 22.726835-21.73266 34.965126-51.955573 34.965126-86.920699-0.248544-36.207845-13.490951-63.686835-40.96-84.663923z m-92.915573 30.72l5.000699 1.491263c29.725825 9.494369 63.686835 24.983612 63.686835 59.45165a57.244583 57.244583 0 0 1-14.485126 37.957592c-11.234175 12.74532-27.976078 21.235573-49.708738 25.232156l-4.49367 0.745631V548.963417zM422.832466 410.594175c0-27.717592 18.740194-48.446136 51.2-56.439301l4.752155-1.25266v108.643417l-5.000699-1.739806c-21.722718-6.99899-50.951456-20.231456-50.951456-49.21165z' fill='%232E323F' /%3E%3C/svg%3E";
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
    ...mapState("tokens", ["createToken", "editingToken", "config"]),
    ...mapGetters("accounts", ["account"]),
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
      "issueTokens",
      "retireTokens",
      "transferTokens",
    ]),
    checkTerms(val) {
      return val || "You must accept the terms";
    },
    canIssue() {
      return this.stat && this.getUnissued() > 0;
    },
    getUnissued() {
      if (!this.stat) return;

      return (
        parseFloat(this.stat.max_supply.split(" ")[0]) -
        parseFloat(this.stat.supply.split(" ")[0])
      );
    },
    hasBalance() {
      if (!this.balance) return false;

      return parseFloat(this.balance.split(" ")[0]) > 0;
    },
    getBalanceNumber() {
      return this.hasBalance() ? parseFloat(this.balance.split(" ")[0]) : 0.0;
    },
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
    async doIssue() {
      if (!this.amountToIssue) {
        this.$q.notify({
          type: "negative",
          message: "Please specify an amount to issue",
        });
        return;
      }
      await this.issueTokens({
        ...this.token,
        contractAccount: this.token.contract_account,
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
        ...this.token,
        contractAccount: this.token.contract_account,
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
        ...this.token,
        contractAccount: this.token.contract_account,
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
    cancelEdit() {
      this.$store.commit("tokens/createToken", false);
      this.$store.commit("tokens/editToken", null);
    },
  },
};
</script>
