<template>
  <q-card style="min-width: 450px">
    <q-card-section>
      <div class="text-h6">Ready Case</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <p>
        Are you sure that you would like set the case to "Ready" mode? This will
        open up the case to offers from arbitrators, who will make bids for the
        case work.
      </p>
    </q-card-section>

    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Ready" @click="submit" />
      <q-btn flat label="Cancel" @click="close" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["close", "caseId", "afterReadyCase"],
  computed: {
    ...mapGetters({
      account: "accounts/account",
    }),
  },
  methods: {
    async submit() {
      const readyCaseActions = [
        {
          account: "testtelosarb",
          name: "readycase",
          data: {
            claimant: this.account,
            case_id: this.caseId,
          },
        },
      ];
      try {
        await this.$store.$api.signTransaction(readyCaseActions);
        setTimeout(this.afterReadyCase, 5000);
        this.close();
      } catch (err) {
        console.log("submit error: ", err);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
