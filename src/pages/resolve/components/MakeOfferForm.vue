<template>
    <q-card class="make-offer-form">
        <q-card-section>
            <div class="text-h6">{{$t('pages.resolve.make_offer_heading')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <p>
                {{$t('pages.resolve.make_offer_text')}}
            </p>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <q-input
                v-model.number="estimated_hours"
                type="number"
                filled
                :label="$t('pages.resolve.make_offer_hours')"
                bottom-slots
                autofocus
                :rules="[
                    val => val > 0 || $t('pages.resolve.make_offer_hours_hint')
                ]"
            />
        </q-card-section>
        <q-card-section class="q-pt-none">
            <q-input
                prefix="$"
                v-model.number="hourly_rate"
                type="number"
                filled
                :label="$t('pages.resolve.make_offer_rate_label')"
                bottom-slots
                :rules="[
                    val => val > 0 || $t('pages.resolve.make_offer_rate_hint')
                ]"
            />
        </q-card-section>

        <p class="total">{{$t('pages.resolve.make_offer_estimate_total', { total })}}</p>

        <q-card-actions align="right" class="text-primary">
            <q-btn flat :label="$t('pages.resolve.make_offer_submit')" @click="submit" />
            <q-btn flat :label="$t('pages.resolve.make_offer_cancel')" @click="close" />
        </q-card-actions>
    </q-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: ['close', 'caseId', 'afterReadyCase'],
    data() {
        return {
            hourly_rate: 1,
            estimated_hours: 1
        };
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        }),
        total() {
            return (this.hourly_rate * this.estimated_hours).toFixed(2);
        }
    },
    methods: {
        async submit() {
            const { offers } = this.$store.state.resolve;
            const arbCaseOffer = offers.find(
                offer =>
                    offer.case_id === this.caseId &&
                    offer.arbitrator === this.account
            );

            const makeOfferActions = [
                {
                    account: process.env.ARB_CONTRACT,
                    name: 'makeoffer',
                    data: {
                        case_id: this.caseId,
                        arbitrator: this.account,
                        hourly_rate: this.hourly_rate.toFixed(4) + ' USD',
                        estimated_hours: this.estimated_hours,
                        offer_id:
                            arbCaseOffer?.offer_id > -1
                                ? arbCaseOffer.offer_id
                                : -1
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(makeOfferActions);
                setTimeout(this.close, 2000);
            } catch (err) {
                console.log('submit error: ', err);
            }
        }
    }
};
</script>

<style lang="scss">
.make-offer-form {
    .total {
        text-align: center;
        font-size: 1.3rem;
        margin-top: 0;
    }
}
</style>
