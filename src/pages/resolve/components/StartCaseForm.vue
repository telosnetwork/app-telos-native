<template>
    <q-card style="min-width: 450px">
        <q-card-section>
            <div class="text-h6">Submit Offer</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <q-input
                v-model.number="number_days_respondant"
                type="number"
                filled
                label="Number days for respondant to respond"
                bottom-slots
                autofocus
                :rules="[
                    val => val > 0 || 'Please enter a number greater than 0'
                ]"
            />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Start Case" @click="submit" />
            <q-btn flat label="Cancel" @click="close" />
        </q-card-actions>
    </q-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: ['close', 'caseId'],
    data() {
        return {
            number_days_respondant: 7
        };
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        })
    },
    methods: {
        async submit() {
            const startCaseActions = [
                {
                    account: 'testtelosarb',
                    name: 'startcase',
                    data: {
                        case_id: this.caseId,
                        assigned_arb: this.account,
                        number_days_respondant: this.number_days_respondant
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

<style lang="scss" scoped>
.total {
    text-align: center;
    font-size: 1.3rem;
    margin-top: 0;
}
</style>
