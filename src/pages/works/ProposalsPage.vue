<!-- eslint-disable vue/multi-word-component-names -->
<template lang="pug">
q-page.q-pa-lg
  div.q-pa-sm
  q-btn-toggle(
      v-model="type"
      push
      toggle-color="primary"
      color="white"
      text-color="primary"
      :options="[{label: 'Active', value: 'active'},{label: 'Inactive', value: 'inactive'}]"
  )
  q-list(bordered).rounded-borders
    ExpansionProposal(v-for="proposal in ProposalsPage" :proposal="proposal" :key="proposal.proposal_name")
</template>

<script>
import { mapActions } from 'vuex';
import ExpansionProposal from './components/ExpansionProposal';
export default {
  name: 'ProposalsPage',
  components: {
    ExpansionProposal,
  },
  data() {
    return {
      type: 'active',
    };
  },
  methods: {
    ...mapActions('works', ['fetchWorks']),
  },
  computed: {
    proposals() {
      return this.$store.state.works[this.type];
    },
  },
  beforeMount() {
    this.fetchWorks();
  },
};
</script>

<style lang="sass">
.active-toggle
 border: 1px solid primary
</style>
