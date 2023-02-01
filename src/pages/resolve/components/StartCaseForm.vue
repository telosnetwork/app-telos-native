<template>
    <q-card class="start-case-form">
        <q-card-section>
            <div class="text-h6">{{$t('pages.resolve.start_case_title')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <q-input
                v-model.number="number_days_respondant"
                type="number"
                filled
                :label="$t('pages.resolve.start_case_label')"
                bottom-slots
                autofocus
                :rules="[
                    val => val > 0 || $t('pages.resolve.start_case_error')
                ]"
            />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <file-upload-input
            @update:hash="setNewResponseNeededLink"
            :label="$t('pages.resolve.start_case_info_request_label')"
          />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
            <q-btn flat :label="$t('pages.resolve.start_case_start')" @click="submit" />
            <q-btn flat :label="$t('pages.resolve.start_case_cancel')" @click="close" />
        </q-card-actions>
    </q-card>
</template>

<script>
import { mapGetters } from 'vuex';
import FileUploadInput from './FileUploadInput.vue';

export default {
    props: ['close', 'caseId'],
    components: {
        FileUploadInput
    },
    data() {
        return {
            number_days_respondant: 7,
            response_info_required: null
        };
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        })
    },
    methods: {
        setNewResponseNeededLink(link) {
            this.response_info_required = link;
        },
        async submit() {
            const startCaseActions = [
                {
                    account: process.env.ARB_CONTRACT,
                    name: 'startcase',
                    data: {
                        case_id: this.caseId,
                        assigned_arb: this.account,
                        number_days_respondant: this.number_days_respondant,
                        response_info_required: this.response_info_required
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(startCaseActions);
                setTimeout(this.close, 2000);
            } catch (err) {
                console.log('submit error: ', err);
            }
        }
    }
};
</script>

<style lang="scss">
.start-case-form {
  min-width: 450px;
    .total {
        text-align: center;
        font-size: 1.3rem;
        margin-top: 0;
    }
}
</style>
