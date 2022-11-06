<script>
import { mapActions, mapGetters } from 'vuex';
import { validation } from '~/mixins/validation';
import TreasuryTokenSettingsEdit from './TreasuryTokenSettingsEdit';

export default {
  name: 'TreasuryForm',
  mixins: [validation],
  components: {
    TreasuryTokenSettingsEdit
  },
  props: {
    show: { type: Boolean, required: true },
  },
  data() {
    return {
      showEditSettings: false,
      form: {
        settings: [],
        manager: null,
        maxSupply: null,
        maxSupplyValue: null,
        maxSupplyToken: null,
        maxSupplyDecimals: null,
        access: null,
        title: null,
        description: null,
      },
      submitting: false,
    };
  },
  computed: {
    ...mapGetters('trails', ['treasuryFees']),
    settingsAsText() {
      return this.form.settings.filter(x => x.value).map(x => x.key).join(', ');
    }
  },
  methods: {
    ...mapActions('trails', ['addTreasury', 'fetchTreasuries']),
    async onAddTreasury() {
      this.resetValidation(this.form);
      if (!(await this.validate(this.form))) return;
      this.submitting = true;
      const success = await this.addTreasury(this.form);
      this.submitting = false;
      if (success) {
        this.$emit('update:show', false);
        this.resetTreasury();
        await this.fetchTreasuries();
      }
    },
    resetSettings() {
      this.form.settings = [
          { 'key': 'burnable',     'value': false },
          { 'key': 'maxmutable',   'value': false },
          { 'key': 'reclaimable',  'value': false },
          { 'key': 'stakeable',    'value': true  },
          { 'key': 'transferable', 'value': true  },
          { 'key': 'unstakeable',  'value': false }
        ];
    },
    resetTreasury() {
      this.form = {
        settings: null,
        manager: null,
        maxSupply: null,
        access: null,
        title: null,
        description: null,
      };
      this.resetSettings();
    },
    editSettings() {
      this.showEditSettings = true;
    },
    setMaxSupply() {
      if (
        this.form.maxSupplyDecimals &&
        parseInt(this.form.maxSupplyDecimals) > 0
      ) {
        this.form.maxSupply = `${this.form.maxSupplyValue || 0}.${''.padStart(
          parseInt(this.form.maxSupplyDecimals),
          '0'
        )} ${this.form.maxSupplyToken}`;
      } else {
        this.form.maxSupply = `${this.form.maxSupplyValue || 0} ${
          this.form.maxSupplyToken
        }`;
      }
    },
  },
  watch: {
    show: {
      handler: function() {
        if (this.show) {
          this.resetTreasury();
        }
      },
      inmediate: true
    },
    'form.maxSupplyValue': function () {
      this.setMaxSupply();
    },
    'form.maxSupplyToken': function () {
      this.setMaxSupply();
    },
    'form.maxSupplyDecimals': function () {
      this.setMaxSupply();
    },
  },
};
</script>

<template lang="pug">
q-dialog(
  v-model="show"
  persistent
)
  q-dialog(
    v-model="showEditSettings"
  )
    q-card.container-sm
      q-card-section.bg-primary.text-white
        .text-h6 Edit DAO token features
      q-card-section
        | Each DAO has it's own token which is used to vote. From here you can change....
      q-card-section
        treasury-token-settings-edit(v-model="form.settings")

      q-card-actions(
        align="right"
      )
        q-btn(
          color="primary"
          :label="$t('common.buttons.reset')"
          @click="resetSettings()"
        )
        q-btn(
          color="primary"
          :label="$t('common.buttons.ok')"
          @click="showEditSettings = false"
        )
  q-card.container-md(
    flat
    bordered
  )
    q-card-section.bg-primary.text-white
      .text-h6 Create a DAO
    q-card-section
      q-input(
        ref="manager"
        v-model="form.manager"
        label="Manager"
        maxlength="12"
        :rules="[rules.required, rules.accountFormat, rules.accountLength, rules.accountExists]"
        lazy-rules
        :debounce="200"
        @blur="form.manager = (form.manager || '').toLowerCase()"
      )
      .row
        q-input.col-4(
          ref="maxSupplyValue"
          v-model="form.maxSupplyValue"
          label="Max supply"
          type="number"
          :rules="[rules.required, rules.isInteger, rules.positiveInteger]"
          lazy-rules
        )
        q-input.col-4(
          ref="maxSupplyToken"
          v-model="form.maxSupplyToken"
          label="Token"
          maxlength="6"
          :rules="[rules.required, rules.isToken]"
          lazy-rules
          @keyup="form.maxSupplyToken = (form.maxSupplyToken || '').toUpperCase()"
        )
        q-input.col-4(
          ref="maxSupplyDecimals"
          v-model="form.maxSupplyDecimals"
          label="Decimals"
          type="number"
          :rules="[rules.required, rules.isInteger, rules.isTokenDecimals]"
          lazy-rules
        )
      .row
        .col
          q-input(
            v-model="settingsAsText"
            label="token"
            readonly
          )
            template(v-slot:append)
              q-btn(
                icon="edit"
                no-caps color="primary"
                label="edit"
                @click="showEditSettings = true"
              )
      q-input(
        ref="title"
        v-model="form.title"
        label="Title"
        maxlength="50"
        :rules="[rules.required]"
        lazy-rules
      )
      q-input(
        ref="description"
        v-model="form.description"
        label="Description"
        type="textarea"
        maxlength="250"
        :rules="[rules.required]"
        lazy-rules
      )
      q-select(
        v-model="form.access"
        label="Access"
        :options=["public", "private", "invite"]
        :rules="[rules.required]"
        lazy-rules
      )
    q-card-section(v-if="treasuryFees")
      strong.text-red.fees There is a deposit fee of {{ treasuryFees.value }}
    q-card-actions(align="right")
      q-btn(
        flat
        :label="$t('common.buttons.cancel')"
        @click="$emit('close')"
      )
      q-btn(
        color="primary"
        :label="$t('common.buttons.create')"
        :loading="submitting"
        @click="onAddTreasury()"
      )
</template>

<style lang="sass" scoped>
.fees
  font-size: 12px
</style>
