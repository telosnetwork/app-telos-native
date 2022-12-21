<template>
    <q-card class="shred-case-form">
        <q-card-section>
            <div class="text-h6">{{$t('pages.resolve.shred_case_title')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <p>{{$t('pages.resolve.shred_case_instructions')}}</p>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
            <q-btn flat :label="$t('pages.resolve.shred_case_delete')" @click="submit" />
            <q-btn flat :label="$t('pages.resolve.shred_case_cancel')" @click="close" />
        </q-card-actions>
    </q-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: ['close', 'caseId', 'afterShredCase'],
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        })
    },
    methods: {
        async submit() {
            const shredCaseActions = [
                {
                    account: 'testtelosarb',
                    name: 'shredcase',
                    data: {
                        claimant: this.account,
                        case_id: this.caseId
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(shredCaseActions);
                setTimeout(this.afterShredCase, 5000);
                this.close();
            } catch (err) {
                console.log('submit error: ', err);
            }
        }
    }
};
</script>

<style lang="scss">
.shred-case-form {
    min-width: 450px;
}
</style>