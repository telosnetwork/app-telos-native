<template>
  <div v-if="isResolveStoresAvailable">
    <div class="q-pb-xl stepper-wrap">
      <q-btn-toggle
        :disable="[3, 4].includes(getArbitratorStatus)"
        :model-value="getArbitratorStatus"
        no-caps
        toggle-color="primary"
        color="white"
        text-color="black"
        :options="[
          { label: 'Available', value: 1 },
          { label: 'Unavailable', value: 2 },
          { label: 'Removed', value: 3 },
          { label: 'Expired', value: 4 },
        ]"
        @update:model-value="changeArbStatus"
      />
    </div>
    <div>
      <assigned-cases />
    </div>
  </div>
</template>

<script>
import AssignedCases from './AssignedCases.vue';
import { mapGetters } from 'vuex';
import { getAvailableArbitratorStatus } from '../../util';

export default {
    components: {
        AssignedCases,
    },
    data() {
        return {
            form: null,
            formType: null,
            status: null,
        };
    },
    methods: {
        closeModal() {
            this.form = null;
        },
        async changeArbStatus(new_status) {
            const newArbStatusActions = [
                {
                    account: 'testtelosarb',
                    name: 'newarbstatus',
                    data: {
                        arbitrator: this.account,
                        new_status,
                    },
                },
            ];
            try {
                await this.$store.$api.signTransaction(newArbStatusActions);
            } catch (err) {
                console.log('changeArbStatus error: ', err);
            }
        },
    },
    computed: {
        ...mapGetters({
            arbSeatsAvailable: 'resolve/arbSeatsAvailable',
            isResolveStoresAvailable: 'resolve/isResolveStoresAvailable',
            selfArbitrator: 'resolve/isArbitrator',
            account: 'accounts/account',
        }),
        getArbitratorStatus() {
            return getAvailableArbitratorStatus(this.selfArbitrator);
        },
    },
    updated() {
        const selfArbitrator = this.selfArbitrator;
        if (!selfArbitrator) this.status = null;
        const { arb_status } = selfArbitrator;
        this.status = arb_status;
    },
};
</script>

<style lang="scss" scoped>
.stepper-wrap {
  flex: 1;
}
.form-wrapper {
  flex: 1;
}
</style>