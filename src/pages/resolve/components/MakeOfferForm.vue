<template>
  <q-card style="min-width: 450px">
    <q-card-section>
      <div class="text-h6">Submit Offer</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <p>
        Please give an estimate for the total amount of work that you believe is
        necessary to evaluate and reach a decision on the case.
      </p>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input
        v-model.number="estimated_hours"
        type="number"
        filled
        label="Estimated Hours"
        bottom-slots
        autofocus
        :rules="[(val) => val > 0 || 'Please enter a number greater than 0']"
      />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-input
        prefix="$"
        v-model.number="hourly_rate"
        type="number"
        filled
        label="$ / hour"
        bottom-slots
        :rules="[(val) => val > 0 || 'Please enter a number greater than 0']"
      />
    </q-card-section>

    <p class="total">Estimate total: ${{ total }}</p>

    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Submit" @click="submit" />
      <q-btn flat label="Cancel" @click="close" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["close", "caseId", "afterReadyCase"],
  data() {
    return {
      hourly_rate: 1,
      estimated_hours: 1,
    };
  },
  computed: {
    ...mapGetters({
      account: "accounts/account",
    }),
    total() {
      return (this.hourly_rate * this.estimated_hours).toFixed(2);
    },
  },
  methods: {
    async submit() {
      const { offers } = this.$store.state.resolve;
      const arbCaseOffer = offers.find(
        (offer) =>
          offer.case_id === this.caseId && offer.arbitrator === this.account
      );

      const makeOfferActions = [
        {
          account: "testtelosarb",
          name: "makeoffer",
          data: {
            case_id: this.caseId,
            arbitrator: this.account,
            hourly_rate: this.hourly_rate.toFixed(4) + " USD",
            estimated_hours: this.estimated_hours,
            offer_id: arbCaseOffer?.offer_id > -1 ? arbCaseOffer.offer_id : -1,
          },
        },
      ];
      try {
        await this.$store.$api.signTransaction(makeOfferActions);
        setTimeout(this.afterReadyCase, 5000);
        this.close();
      } catch (err) {
        console.log("submit error: ", err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.total {
  text-align: center;
  font-size: 1.3rem;
  margin-top: 0;
}
</style>
