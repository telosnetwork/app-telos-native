<template>
    <q-card class="settle-claim-form">
        <q-card-section>
            <div class="text-h6">Settle claim</div>
            <p>
                Choose whether this particular claim should be accepted or
                rejected
            </p>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <file-upload-input @update:hash="setDecisionLink" />
        </q-card-section>

        <q-card-section class="q-pt-none">
            <!-- <q-checkbox v-model="isAccepted" label="Accept claim" color="primary" /> -->
            <q-option-group
                v-model="isAccepted"
                :options="[
                    { label: 'Accept claim', value: true },
                    { label: 'Reject claim', value: false }
                ]"
                color="primary"
                :rules="[
                    val =>
                        console.log('val: ', val) ||
                        'Please choose accept or reject'
                ]"
            />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
            <q-btn
                flat
                label="Submit"
                @click="submit"
                :disable="!hasSelectedOption"
            />
            <q-btn flat label="Cancel" @click="close" />
        </q-card-actions>
    </q-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { validateIpfsHash, validateId } from '../util';
import FileUploadInput from './FileUploadInput.vue';

// claimant, claim_link, respondant, claim_category
export default {
    props: ['close', 'caseId', 'claimId'],
    components: {
        FileUploadInput
    },
    data() {
        return {
            decisionLink: '',
            isAccepted: null
        };
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        }),
        hasSelectedOption() {
            return typeof this.isAccepted === 'boolean';
        }
    },
    methods: {
        validateId,
        setDecisionLink(link) {
            this.decisionLink = link;
        },
        isLinkValid() {
            const isValid = validateIpfsHash(this.decisionLink);
            return isValid;
        },
        async submit() {
            const settleClaimActions = [
                {
                    account: 'testtelosarb',
                    name: 'settleclaim',
                    data: {
                        case_id: this.caseId,
                        assigned_arb: this.account,
                        claim_id: this.claimId,
                        accept: this.isAccepted,
                        decision_link: this.decisionLink
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(settleClaimActions);
                this.close();
                // setTimeout(this.onSubmit, 5000);
            } catch (err) {
                console.log('submit error: ', err);
            }
        }
    }
};
</script>

<style lang="scss">
.settle-claim-form {
    min-width: 450px;
}
</style>
