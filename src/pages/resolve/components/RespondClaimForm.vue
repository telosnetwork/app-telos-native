<template>
    <q-card class="respond-claim-form">
        <q-card-section>
            <div class="text-h6">{{$t('pages.resolve.respond_claim_title')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <file-upload-input @update:hash="setResponseLink" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
            <q-btn flat :label="$t('pages.resolve.respond_claim_submit')" @click="submit" />
            <q-btn flat :label="$t('pages.resolve.respond_claim_cancel')" @click="close" />
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
            responseLink: ''
        };
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        })
    },
    methods: {
        validateId,
        setResponseLink(link) {
            this.responseLink = link;
        },
        isLinkValid() {
            const isValid = validateIpfsHash(this.responseLink);
            return isValid;
        },
        async submit() {
            const addClaimActions = [
                {
                    account: process.env.ARB_CONTRACT,
                    name: 'respond',
                    data: {
                        respondant: this.account,
                        response_link: this.responseLink,
                        claim_id: this.claimId,
                        case_id: this.caseId
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(addClaimActions);
                this.close();
            } catch (err) {
                console.log('submit error: ', err);
            }
        }
    }
};
</script>

<style lang="scss">
.respond-claim-form {
    min-width: 450px;
}
</style>
