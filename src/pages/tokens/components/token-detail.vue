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

    <template v-if="editable">
      <q-separator />

      <q-card-actions class="row">
        <q-space />
        <q-btn
            color="primary"
            icon-right="fa-solid fa-pen-to-square"
            label="Edit token"
            no-caps
            @click="editBtn"
          />
      </q-card-actions>
  </template>
  </q-card>
</template>

<style lang="sass" scoped>
.image-icon
  min-width: 128px
</style>

<style lang="sass">
button.q-btn.close-btn
  display: none
.show-close-btn button.q-btn.close-btn
  z-index: 1
  display: inline-flex
</style>

<script>
import { mapGetters } from "vuex";
export default {
  name: "TokenDetail",
  props: {
    name: String,
    symbol: String,
    owner: String,
    contract: String,
    decimals: String,
    supply: Number,
    logo_sm: String,
    logo_lg: String,
    balance: String,
    editable: Boolean,
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
    closeBtn: function () {
      console.log("closeBtn()");
      this.$emit("close");
    },
    editBtn: function () {
      console.log("editBtn()");
      this.$emit("edit");
    },
  },
};
</script>
