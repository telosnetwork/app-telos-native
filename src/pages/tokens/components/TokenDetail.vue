<template>
  <q-card class="my-card" flat bordered>
    <q-btn flat round color="default" @click="closeBtn" icon="cancel" class="close-btn q-mt-sm q-mr-sm absolute-top-right"/>
    <q-card-section horizontal class="col-grow">
      <q-card-section class="flex flex-center">
        <q-img class="image-icon" :src="logo_lg">
          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-negative text-white">
              Cannot load large logo
            </div>
          </template>
        </q-img>
      </q-card-section>

      <q-card-section class="q-pt-xs col-grow">
        <q-card-section class="q-mt-sm q-mb-xs">
          <div class="text-h3">{{ name }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="row col-grow q-px-none q-py-none">
          <q-card-section class="col-auto">
            <div v-if="symbol" class="text-h8 q-mb-xs">symbol: <b>{{ symbol }}</b></div>
            <div v-if="decimals" class="text-h8 q-mb-xs">precision: <b>{{ decimals }} decimals</b></div>
            <div v-if="contract" class="text-h8 q-mb-xs">contract: <b>{{ contract }}</b></div>            
            <div v-if="owner" class="text-h8 q-mb-xs">owner: <b>{{ owner }}</b></div>
            <div v-if="!owner && logo_sm" class="text-h8 q-mb-xs">small icon: 
              <q-img class="image-icon-sm" :src="logo_sm">
                <template v-slot:error>
                  <div class="error-slot text-center absolute-full flex flex-center bg-negative text-white">bad url</div>
                </template>
              </q-img>              
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="col-auto text-right col-grow">
            <div v-if="stat" class="text-h8 q-mb-xs">max supply: <b>{{ stat.max_supply }}</b></div>
            <div v-if="stat" class="text-h8 q-mb-xs">supply: <b>{{ stat.supply }}</b></div>
            <div v-if="balance" class="text-h8 q-mb-xs">your balance: <b>{{ balance }}</b></div>    
          </q-card-section>
        </q-card-section>
      </q-card-section>
    </q-card-section>
    
    <q-separator />
    <q-card-section class="row q-py-md">
      <q-space />
      <q-btn
          v-if="!balance && owner"
          class="q-ml-sm"
          color="primary"
          icon-right="fas fa-sd-card"
          label="Open"
          no-caps
          @click="openBtn"
        />
      <q-btn
          v-if="balance && parseFloat(balance.split(' ')[0]) > 0"
          class="q-ml-sm"
          color="primary"
          icon-right="fa-solid fa-money-bill-transfer"
          label="Transfer"
          no-caps
          @click="transferBtn"
        />
        <q-btn
          v-if="retireable"
          class="q-ml-sm"
          color="primary"
          icon-right="fa-solid fa-fire-burner"
          label="Retire"
          no-caps
          @click="retireBtn"
        />        
      <q-btn
          v-if="issuable"
          class="q-ml-sm"
          color="primary"
          icon-right="fa-solid fa-money-bills"
          label="Issue"
          no-caps
          @click="issueBtn"
        />
      <q-btn
          v-if="editable"
          class="q-ml-sm"
          color="primary"
          icon-right="fa-solid fa-pen-to-square"
          label="Edit token"
          no-caps
          @click="editBtn"
        />
    </q-card-section>
  
  </q-card>
</template>

<style lang="sass" scoped>
.image-icon
  min-width: 128px

.image-icon-sm
  width: 32px
  height: 32px
  .error-slot
    padding: 0px
    font-size: small
    line-height: 13px

.mr-negative
  margin-right: -16px
</style>

<style lang="sass">
button.q-btn.close-btn
  display: none
.show-close-btn button.q-btn.close-btn
  z-index: 1
  display: inline-flex
</style>

<script >
import { mapGetters } from "vuex";
export default {
  name: "TokenDetail",
  props: {
    name: String,
    symbol: String,
    owner: String,
    contract: String,
    decimals: String,
    logo_sm: String,
    logo_lg: String,
    balance: String,
    editable: Boolean,
    issuable: Boolean,
    retireable: Boolean,
    stat: {
      supply: String,
      max_supply: String,
      issuer: String
    }
  },
  computed: {
    ...mapGetters("accounts", ["isAuthenticated", "account"]),
  },
  methods: {
    closeBtn() {
      this.$emit("close");
    },
    editBtn() {
      this.$emit("edit");
    },
    transferBtn() {
      this.$emit("transfer");
    },
    openBtn() {
      this.$emit("open");
    },
    retireBtn() {
      this.$emit("retire");
    },
    issueBtn() {
      this.$emit("issue");
    }
  },
};
</script>
