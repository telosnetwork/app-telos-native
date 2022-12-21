<template>
    <q-card class="create-new-case-modal">
        <q-card-section>
            <div class="text-h6">{{$('pages.resolve.create_case_title')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <q-input
                v-model="account"
                disable
                filled
                :label="$t(pages.resolve.claimant)"
                bottom-slots
                :hint="$t('pages.resolve.create_case_account_name')"
                :error-message="$t('pages.resolve.create_case_account_error')"
            />
        </q-card-section>

        <q-card-section class="q-pt-none">
            <q-input
                v-model="respondant"
                autofocus
                filled
                :label="$t(pages.resolve.respondant)"
                bottom-slots
                :hint="$t('pages.resolve.create_case_account_name')"
                :rules="[
                    val => validateId(val) || $t('pages.resolve.create_case_account_error')
                ]"
            />
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
            <q-btn flat :label="$('pages.resolve.submit')" @click="submit" />
            <q-btn flat :label="$('pages.resolve.cancel')" @click="close" />
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
    props: ['close'],
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
            respondant: '',
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
            const newCaseActions = [
                {
                    account: 'testtelosarb',
                    name: 'filecase',
                    data: {
                        claimant: this.account,
                        claim_link: this.claimLink,
                        respondant: this.respondant,
                        claim_category: this.category.value,
                        lang_codes: [0]
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(newCaseActions);
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
.create-new-case-modal {
    min-width: 450px;
}
</style>