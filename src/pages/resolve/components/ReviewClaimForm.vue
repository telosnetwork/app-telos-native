<template>
    <q-card class="review-claim-form">
        <q-card-section>
            <div class="text-h6">{{$t('pages.resolve.review_claim_title')}}</div>
        </q-card-section>

        <q-card-section>
          <p>
              {{$t('pages.resolve.review_claim_instructions')}}
          </p>
        </q-card-section>

        <q-card-section class="q-pt-none q-pb-none">
            <q-checkbox
                class="mb-2"
                v-model="claim_info_needed"
                :label="$t('pages.resolve.review_claim_more_info')"
                color="primary"
            />
            <file-upload-input
              class="mb-2"
              v-if="claim_info_needed"
              @update:hash="setClaimRequiredLink"
              :label="$t('pages.resolve.start_case_info_request_label')"
            />
            <q-input
                class="mb-2"
                v-if="claim_info_needed"
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

        <q-card-section class="q-pt-none q-pb-none">
            <q-checkbox
                class="mb-2"
                v-model="response_info_needed"
                :label="$t('pages.resolve.review_claim_more_response')"
                color="primary"
            />
            <file-upload-input
              class="mb-2"
              v-if="response_info_needed"
              @update:hash="setResponseRequiredLink"
              :label="$t('pages.resolve.start_case_info_request_label')"
            />
            <q-input
                v-if="response_info_needed"
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
            <q-btn flat :label="$t('pages.resolve.review_claim_submit')" @click="submit" :disable="!isSubmitEnabled" />
            <q-btn flat :label="$t('pages.resolve.review_claim_cancel')" @click="close" />
        </q-card-actions>
    </q-card>
</template>

<script>
import { mapGetters } from 'vuex';
import FileUploadInput from './FileUploadInput.vue';

export default {
    components: {
        FileUploadInput
    },
    props: ['close', 'caseId', 'claimId'],
    data() {
        return {
            number_days_claimant: 2,
            number_days_respondant: 2,
            response_info_needed: false,
            response_info_required: '',
            claim_info_needed: false,
            claim_info_required: '',
        };
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        }),
        isSubmitEnabled () {
            if (!this.claim_info_needed && !this.response_info_needed) return false;
            if (this.claim_info_needed) {
                if (!this.claim_info_required) return false;
                if (this.number_days_claimant < 1) return false;
            }
            if (this.response_info_needed) {
                if (!this.response_info_required) return false;
                if (this.number_days_respondant < 1) return false;
            }
            return true;
        }
    },
    methods: {
        setClaimRequiredLink (hash) {
            this.claim_info_required = hash;
        },
        setResponseRequiredLink (hash) {
            this.response_info_required = hash;
        },
        async submit() {
            if (!this.claim_info_needed && !this.response_info_needed) {
                this.$q.notify({
                    message:
                        this.$t('pages.resolve.review_claim_no_info_needed'),
                    color: 'negative'
                });
                return;
            }
            const reviewClaimActions = [
                {
                    account: process.env.ARB_CONTRACT,
                    name: 'reviewclaim',
                    data: {
                        claim_id: this.claimId,
                        case_id: this.caseId,
                        assigned_arb: this.account,
                        number_days_respondant: this.number_days_respondant,
                        number_days_claimant: this.number_days_claimant,
                        claim_info_needed: this.claim_info_needed,
                        response_info_needed: this.response_info_needed,
                        claim_info_required: this.claim_info_required,
                        response_info_required: this.response_info_required
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
.review-claim-form {
    .mb-2 {
        margin-bottom: 1rem;
    }
    .total {
        text-align: center;
        font-size: 1.3rem;
        margin-top: 0;
    }
}
</style>