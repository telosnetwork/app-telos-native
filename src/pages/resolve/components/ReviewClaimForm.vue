<template>
    <q-card class="review-claim-form">
        <q-card-section>
            <div class="text-h6">{{$t('pages.resolve.review_claim_title')}}</div>
            <p>
                {{$t('pages.resolve.review_claim_instructions')}}
            </p>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <q-checkbox
                v-model="claim_info_needed"
                :label="$t('pages.resolve.review_claim_more_info')"
                color="primary"
            />
            <q-input
                v-model.number="number_days_claimant"
                type="number"
                filled
                :label="$t('pages.resolve.review_claim_claimant_days')"
                bottom-slots
                autofocus
                :rules="[
                    val => val > 0 || $t('pages.resolve.review_claim_claimant_error')
                ]"
                :disable="!claim_info_needed"
            />
        </q-card-section>

        <q-card-section class="q-pt-none">
            <q-checkbox
                v-model="response_info_needed"
                :label="$t('pages.resolve.review_claim_more_response')"
                color="primary"
            />
            <q-input
                v-model.number="number_days_respondant"
                type="number"
                filled
                :label="$t('pages.resolve.review_claim_respondant_days')"
                bottom-slots
                autofocus
                :rules="[
                    val => val > 0 || $t('pages.resolve.review_claim_respondant_error')
                ]"
                :disable="!response_info_needed"
            />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
            <q-btn flat :label="$t('pages.resolve.review_claim_submit')" @click="submit" />
            <q-btn flat :label="$t('pages.resolve.review_claim_cancel')" @click="close" />
        </q-card-actions>
    </q-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: ['close', 'caseId', 'claimId'],
    data() {
        return {
            number_days_claimant: 2,
            number_days_respondant: 2,
            response_info_needed: false,
            claim_info_needed: false
        };
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        })
    },
    methods: {
        async submit() {
            if (!this.claim_info_needed && !this.response_info_needed) {
                this.$q.notify({
                    message:
                        'If you do not require more info, exit out of this form',
                    color: 'negative'
                });
                return;
            }
            const reviewClaimActions = [
                {
                    account: 'testtelosarb',
                    name: 'reviewclaim',
                    data: {
                        claim_id: this.claimId,
                        case_id: this.caseId,
                        assigned_arb: this.account,
                        number_days_respondant: this.number_days_respondant,
                        number_days_claimant: this.number_days_claimant,
                        claim_info_needed: this.claim_info_needed,
                        response_info_needed: this.response_info_needed
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(reviewClaimActions);
                setTimeout(this.close, 2000);
            } catch (err) {
                console.log('submit error: ', err);
            }
        }
    }
};
</script>

<style lang="scss">
.respond-claim-form {
    .total {
        text-align: center;
        font-size: 1.3rem;
        margin-top: 0;
    }
}
</style>