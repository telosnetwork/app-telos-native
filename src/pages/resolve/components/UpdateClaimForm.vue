<template>
    <q-card class="update-claim-form">
        <q-card-section>
            <div class="text-h6">{{$t('pages.resolve.update_claim_title')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <file-upload-input @update:hash="setNewClaimLink" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
            <q-btn flat :label="$t('pages.resolve.update_claim_update_cta')" @click="submit" :disable="!isLinkValid" />
            <q-btn flat :label="$t('pages.resolve.update_claim_cancel_cta')" @click="close" />
        </q-card-actions>
    </q-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { validateIpfsHash, validateId } from '../util';
import FileUploadInput from './FileUploadInput.vue';

export default {
    props: ['close', 'caseId', 'claimId'],
    components: {
        FileUploadInput
    },
    data() {
        return {
            newClaimLink: ''
        };
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        }),
        isLinkValid() {
            const isValid = validateIpfsHash(this.newClaimLink);
            return isValid;
        }
    },
    methods: {
        validateId,
        setNewClaimLink(link) {
            this.newClaimLink = link;
        },

        async submit() {
            const updateClaimActions = [
                {
                    account: process.env.ARB_CONTRACT,
                    name: 'updateclaim',
                    data: {
                        claimant: this.account,
                        claim_link: this.newClaimLink,
                        claim_id: this.claimId,
                        case_id: this.caseId
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(updateClaimActions);
                this.close();
            } catch (err) {
                console.log('submit error: ', err);
            }
        }
    }
};
</script>

<style lang="scss">
.update-claim-form {
    min-width: 450px;
}
</style>