<script>
import { mapGetters } from 'vuex';
import AddVoterDialog from './AddVoterDialog';
import MintTokenDialog from './MintTokenDialog';
import TreasuryEditDialog from './TreasuryEditDialog';

export default {
  name: 'TreasuryCard',
  components: {
    AddVoterDialog,
    MintTokenDialog,
    TreasuryEditDialog,
  },
  props: {
    treasury: { type: Object, required: true },
  },
  data() {
    return {
      show: false,
      showMint: false,
      showEdit: false,
    };
  },
  computed: {
    ...mapGetters('accounts', ['account', 'isAuthenticated']),
  },
};
</script>

<template lang="pug">
div
  add-voter-dialog(
    :show.sync="show"
    :supply="treasury.max_supply"
    @close="show = false"
  )
  mint-token-dialog(
    :show.sync="showMint"
    :supply="treasury.max_supply"
    @close="showMint = false"
  )
  treasury-edit-dialog(
    :show.sync="showEdit"
    :treasury="treasury"
    @close="showEdit = false"
  )
  q-card
    q-card-section.bg-primary.text-white(:class="`${!treasury.isPreferred ? undefined : 'prefered'}`")
      .text-h6
        | {{ treasury.title || "Group" }}
        q-icon.q-ml-sm(
          :name="`fas ${treasury.access === 'private' ? 'fa-lock' : 'fa-globe'}`"
          size="12px"
        )
          q-tooltip {{ treasury.access }}
        q-icon.q-ml-sm.cursor-pointer(
          v-if="account === treasury.manager"
          name="fas fa-comment-dollar"
          @click="showMint = true"
        )
        q-icon.q-ml-sm.cursor-pointer(
          v-if="account === treasury.manager"
          name="fas fa-edit"
          @click="showEdit = true"
        )
      .text-right.text-italic {{ treasury.manager }}
    q-card-section.q-mt-lg
      p {{ treasury.description || "No desc" }}
    q-card-section
      strong {{ $t('pages.trails.treasuries.card.supply') }}: {{ treasury.supply }}
      br
      strong {{ $t('pages.trails.treasuries.card.maxSupply') }}: {{ treasury.max_supply }}
      br
      strong Voters: {{treasury.voters}}
    q-card-section.btn-group
      q-btn(
        icon="fas fa-person-booth"
        color="primary"
        size="sm"
        :label="`${$t('pages.trails.treasuries.card.openedBallots')} ${treasury.open_ballots}`"
        :to="`/trails/ballots?treasury=${treasury.symbol}`"
      )
      q-btn(
        v-if="isAuthenticated && !treasury.isRegistered"
        icon="fas fa-user-plus"
        color="primary"
        size="sm"
        :label="`${$t('pages.trails.treasuries.card.registerVoter')}`"
        :disabled="treasury.access === 'private'"
        @click="show = true"
      )
      q-btn.cursor-inherit(
        v-if="isAuthenticated && treasury.isRegistered"
        icon="fas fa-user-check"
        color="primary"
        size="sm"
        :label="`${$t('pages.trails.treasuries.card.registered')}`"
      )
</template>

<style scoped lang="scss">
.prefered {
  background: purple !important;
}
.btn-group {
  display: flex;
  justify-content: space-between;
  @media (max-width: 1199px) {
    flex-direction: column;

    .q-btn {
      margin-bottom: 15px;
    }
  }
}
</style>
