<script>
import { mapActions } from 'vuex';
import moment from 'moment';
import { validation }         from '~/mixins/validation';

export default {
  name: 'BallotOpenVotingDialog',
  props: {
    show: { type: Boolean, required: true },
    ballot: { type: Object, required: true }
  },
  mixins: [validation],
  emits: ['close', 'done'],
  data() {
    return {
      loading: false,
      form: {
        endTime: moment(new Date()).add(20, 'days').format('YYYY-MM-DD HH:mm'),
      }
    };
  },
  watch: {
    'form.endTime'() {
      if (!this.$refs.qDateProxy1 || this.$refs.qDateProxy2) return;
      this.$refs.qDateProxy1.hide();
      this.$refs.qDateProxy2.hide();
    },
    show() {
      if (this.show) {
        this.loading = false;
        this.form.endTime = moment(new Date()).add(20, 'days').format('YYYY-MM-DD HH:mm');
      }
    }
  },
  methods: {
    ...mapActions('trails', ['openBallotForVoting']),
    async onConfirm() {
      this.rules.setActive(true);
      let ok = await this.validate(this.form);
      if (!ok) return;
      this.loading = true;
      await this.openBallotForVoting({
        ballot_name:this.ballot.ballot_name,
        endTime: this.form.endTime
      });
      this.$emit('done');
      this.loading = false;
    },
  },
};
</script>

<template lang="pug">
q-dialog(
  v-model="show"
)
  q-card
    q-card-section
      .text-h6 {{ $t('pages.trails.ballots.openBallotHeader') }}
    q-card-section
      q-input(
        ref="endTime"
        v-model="form.endTime"
        label="End date"
        :rules="[rules.required, rules.dateFuture(Date.now())]"
      )
        template(v-slot:append)
          q-icon.cursor-pointer(name="event" color="primary")
            q-popup-proxy(ref="qDateProxy1" anchor="bottom left" self="center right" transition-show="scale" transition-hide="scale")
              q-date(
                v-model="form.endTime"
                mask="YYYY-MM-DD HH:mm"
              )
          q-icon.cursor-pointer(name="access_time" color="primary")
            q-popup-proxy(ref="qDateProxy2" anchor="bottom left" self="center right" transition-show="scale" transition-hide="scale")
              q-time(
                v-model="form.endTime"
                mask="YYYY-MM-DD HH:mm"
              )
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
        :label="$t('common.buttons.confirm')"
        @click="onConfirm"
        :loading="loading"
      )

</template>
