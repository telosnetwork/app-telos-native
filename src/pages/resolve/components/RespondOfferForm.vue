<template>
  <q-card style="min-width: 450px">
    <q-card-section>
      <div class="text-h6">Respond</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <p>
        Are you sure that you would like to accept this offer? You will not be
        able to change your mind.
      </p>
    </q-card-section>

    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Accept" @click="submit('accept')" />
      <q-btn flat color="red" label="Reject" @click="submit('reject')" />
      <q-btn flat label="Cancel" @click="close" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["close", "caseId", "offer_id"],
  computed: {
    ...mapGetters({
      account: "accounts/account",
    }),
  },
  methods: {
    async submit(type) {
      const respondOfferActions = [
        {
          account: "testtelosarb",
          name: `respondoffer`,
          data: {
            case_id: this.caseId,
            offer_id: this.offer_id,
            accept: type === "accept" ? true : false,
          },
        },
      ];
      try {
        await this.$store.$api.signTransaction(respondOfferActions);
        setTimeout(this.close, 2000);
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
