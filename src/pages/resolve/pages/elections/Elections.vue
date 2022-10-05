<template>
  <div>
    <div class="intro-row">
      <div class="first">
        <intro-card heading="Elect Telos's Next Arbitrators">
          <p>
            As a leader in blockchain governance, Telos allows any user with a
            Telos account to nominate themselves as a candidate for the position
            of arbitrator. Do you have a background in arbitration? Consider
            nominating yourself. Know someone else who you think would make a
            good arbitrator? Ask them to nominate themselves. If they win the
            election they may find themselves ruling on some of the community's
            most important cases.
          </p>
          <strong>Current nominees:</strong>
          <ul>
            <li
              v-for="nominee in nominees"
              :key="nominee.nominee_name"
              class="nominee-item"
            >
              {{ nominee.nominee_name }}&nbsp;
              <q-icon
                v-if="isRemoveNomineeVisible(nominee.nominee_name)"
                @click="removeNominee()"
                name="remove"
                color="white"
                size=".8rem"
                class="remove-icon"
              />
            </li>
          </ul>
        </intro-card>
      </div>
      <div class="second">
        <election-steps
          v-if="isResolveStoresAvailable"
          remove-nominee="removeNominee"
        />
      </div>
    </div>
    <elections-table v-if="isResolveStoresAvailable" />
  </div>
</template>

<script>
import ElectionsTable from "../../components/ElectionsTable.vue";
import ElectionSteps from "./ElectionSteps.vue";
import IntroCard from "../../components/IntroCard.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    ElectionsTable,
    ElectionSteps,
    IntroCard,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      isPastNomination: "resolve/isPastNomination",
      isPastAddCandidates: "resolve/isPastAddCandidates",
      isResolveStoresAvailable: "resolve/isResolveStoresAvailable",
      account: "accounts/account",
    }),
    nominees() {
      const nomineesList = this.$store.state.resolve.nominees;
      if (nomineesList) {
        return nomineesList;
      }
      return [];
    },
  },
  methods: {
    isRemoveNomineeVisible(account) {
      return (
        !this.isPastNomination &&
        this.isPastAddCandidates &&
        account === this.account
      );
    },
    async removeNominee() {
      const unregNomineeActions = [
        {
          account: "testtelosarb",
          name: "unregnominee",
          data: {
            nominee: this.account,
          },
        },
      ];
      try {
        await this.$store.$api.signTransaction(unregNomineeActions);
      } catch (err) {
        console.log("endElection error: ", err);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.intro-row {
  display: flex;
  flex: 1;
  flex-direction: row;

  .first,
  .second {
    flex: 1;
  }
}

.nominee-item {
  .remove-icon {
    background-color: red;
    border-radius: 50%;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
