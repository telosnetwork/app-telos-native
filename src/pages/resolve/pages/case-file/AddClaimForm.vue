<template>
    <q-card style="min-width: 450px">
        <q-card-section>
            <div class="text-h6">{{$t('pages.resolve.add_claim_title')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <file-upload-input @update:hash="setClaimLink" />
        </q-card-section>

        <q-card-section class="q-pt-none">
            <q-select
                filled
                v-model="category"
                :options="categories"
                :label="$t('pages.resolve.category')"
            />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
            <q-btn flat :label="$t('pages.resolve.submit')" @click="submit" />
            <q-btn flat :label="$t('pages.resolve.cancel')" @click="close" />
        </q-card-actions>
    </q-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { DECISION_CLASS_LIST } from '../../constants';
import { validateIpfsHash, validateId } from '../../util';
import FileUploadInput from '../../components/FileUploadInput.vue';

// claimant, claim_link, respondant, claim_category
export default {
    props: ['close', 'caseId'],
    components: {
        FileUploadInput
    },
    data() {
        const options = DECISION_CLASS_LIST.map((item, index) => ({
            label: this.$t(item),
            value: index
        }));
        return {
            category: null,
            claimLink: '',
            categories: options
        };
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        })
    },
    methods: {
        validateId,
        setClaimLink(link) {
            this.claimLink = link;
        },
        isLinkValid() {
            const isValid = validateIpfsHash(this.claimLink);
            return isValid;
        },
        async submit() {
            const addClaimActions = [
                {
                    account: 'testtelosarb',
                    name: 'addclaim',
                    data: {
                        claimant: this.account,
                        claim_link: this.claimLink,
                        claim_category: this.category.value,
                        case_id: this.caseId
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(addClaimActions);
                this.close();
                // setTimeout(this.onSubmit, 5000);
            } catch (err) {
                console.log('submit error: ', err);
            }
        }
    }
};
</script>