<template>
    <q-card class="dismiss-offer-form">
        <q-card-section>
            <div class="text-h6">Dismiss Offer</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <p>
                Are you sure that you would like to remove your offer to
                arbitrate this case? You will not be able to make a new offer
                for this case.
            </p>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Dismiss" @click="submit" />
            <q-btn flat label="Cancel" @click="close" />
        </q-card-actions>
    </q-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: ['close', 'caseId'],
    data() {
        return {
            hourly_rate: 1,
            estimated_hours: 1
        };
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        })
    },
    methods: {
        async submit() {
            const { offers } = this.$store.state.resolve;
            const arbCaseOffer = offers.find(
                offer =>
                    offer.case_id === this.caseId &&
                    offer.arbitrator === this.account
            );

            const dismissOfferActions = [
                {
                    account: 'testtelosarb',
                    name: 'dismissoffer',
                    data: {
                        case_id: this.caseId,
                        offer_id: arbCaseOffer.offer_id
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(dismissOfferActions);
                setTimeout(this.close, 2000);
            } catch (err) {
                console.log('submit error: ', err);
            }
        }
    }
};
</script>

<style lang="scss">
.dismiss-offer-form {
    .total {
        text-align: center;
        font-size: 1.3rem;
        margin-top: 0;
    }
}
</style>