<script>
import { mapActions } from 'vuex';
import TreasuryTokenSettingsEdit from './TreasuryTokenSettingsEdit';

export default {
  name: 'TreasuryTokenEditDialog',
  components: {
    TreasuryTokenSettingsEdit
  },
  props: {
    show: { type: Boolean, required: true },
    treasury: { type: Object, required: true },
  },
  data() {
    return {
      settings: [],
      submitting: false,
    };
  },
  watch: {
    show() {
      if (this.show) {
        this.settings = this.treasury.settings.map(x => ({key:x.key, value:!!x.value}));
      }
    }
  },
  methods: {
    ...mapActions('trails', ['editTreasurySettings']),
    async onSaveSettings() {
      this.submitting = true;
      const success = await this.editTreasurySettings({
        settings: this.settings.map(x => ({key:x.key, value:x.value?1:0})),
        treasury: this.treasury
      });
      this.submitting = false;
      if (success) {
        this.showSuccessMsg('Token features updated successfully');
        this.$emit('close');
      } else {
        this.showSuccessMsg('An error has ocurred');
      }
    },
  },
};
</script>

<template lang="pug">
q-dialog(
  v-model="show"
)
  q-card.container-sm
    q-card-section.bg-primary.text-white
      .text-h6 Edit DAO token features
    q-card-section
      p Each DAO has it's own token which is used for vote. From here you can change the token features to alter the token behavior.
      p Clicking on any feature will display a deascription of it
    q-card-section.q-pt-none
      treasury-token-settings-edit(v-model="settings")

    q-card-actions(
      align="right"
    )
      q-btn(
        flat
        :label="$t('common.buttons.cancel')"
        @click="$emit('close')"
      )
      q-btn(
        color="primary"
        :label="$t('common.buttons.save')"
        @click="onSaveSettings"
        :loading="submitting"
      )
</template>

<style lang="sass">

</style>
