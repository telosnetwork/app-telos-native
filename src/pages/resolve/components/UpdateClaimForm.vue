<template>
    <q-card class="update-claim-form">
        <q-card-section>
            <div class="text-h6">Update Claim</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <file-upload-input @update:hash="setNewClaimLink" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Update" @click="submit" />
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
            newClaimLink: ''
        };
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        })
    },
    methods: {
        validateId,
        setNewClaimLink(link) {
            this.newClaimLink = link;
        },
        isLinkValid() {
            const isValid = validateIpfsHash(this.newClaimLink);
            return isValid;
        },
        async submit() {
            const updateClaimActions = [
                {
                    account: 'testtelosarb',
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
                // setTimeout(this.onSubmit, 5000);
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