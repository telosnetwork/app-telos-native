<template>
    <q-card class="ready-case-form">
        <q-card-section>
            <div class="text-h6">{{$t('pages.resolve.ready_case_title')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <p>
                {{$t('pages.resolve.ready_case_text')}}
            </p>
            <p>
                <strong>
                    {{$t('pages.resolve.ready_case_deduction', { tlosFee: tlosFee.toFixed(4), balance})}}
                </strong>
            </p>
            <p v-if="deficit > 0" class="error">
                <strong>
                    {{$t('pages.resolve.ready_case_deficit', { balance, adjustedDeficit: this.adjustedDeficit})}}
                </strong>
            </p>
        </q-card-section>
        <!-- balance: {{ balance }} fee: {{ fee }} exchangeRate:
    {{ exchangeRate }} tlosFee: {{ tlosFee }} deficit: {{ deficit }} -->
        <q-card-actions align="right" class="text-primary">
            <q-btn flat :label="$t('pages.resolve.ready_case_ready')" @click="submit" />
            <q-btn flat :label="$t('pages.resolve.ready_case_cancel')" @click="close" />
        </q-card-actions>
    </q-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { GET_TABLE_ROWS } from '../util';

export default {
    props: ['close', 'caseId', 'afterReadyCase'],
    data() {
        return {
            balance: 0,
            fee: this.$store.state.resolve.config.fee_usd,
            exchangeRate: null
        };
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        }),
        tlosFee() {
            // todo use strings for math
            return parseFloat(this.fee.replace(' USD', '')) / this.exchangeRate;
        },
        deficit() {
            if (!this.balance) return 0;
            return this.tlosFee - this.balance.replace(' TLOS', '');
        },
        adjustedDeficit() {
            return this.deficit * 1.01;
        }
    },
    methods: {
        async submit() {
            let actions = [];
            if (this.deficit > 0) {
                actions.push({
                    account: 'eosio.token',
                    name: 'transfer',
                    data: {
                        from: this.account,
                        to: 'testtelosarb',
                        quantity: `${this.adjustedDeficit.toFixed(4)} TLOS`,
                        memo: 'For arbitration fee'
                    }
                });
            }
            actions.push({
                account: 'testtelosarb',
                name: 'readycase',
                data: {
                    claimant: this.account,
                    case_id: this.caseId
                }
            });
            try {
                await this.$store.$api.signTransaction(actions);
                setTimeout(this.afterReadyCase, 5000);
                this.close();
            } catch (err) {
                console.log('submit error: ', err);
            }
        },
        async getAccountBalance() {
            try {
                let balance = '0.0000 TLOS';
                const { rows } = await GET_TABLE_ROWS({
                    limit: 1,
                    code: 'testtelosarb',
                    scope: this.account,
                    table: 'accounts'
                });
                if (rows[0]) {
                    balance = rows[0].balance;
                }
                this.balance = balance;
            } catch (err) {
                console.log('getAccountBalance error: ', err);
            }
        },
        async getExchangeRate() {
            try {
                const { rows: exchangeRates } = await GET_TABLE_ROWS({
                    limit: 10,
                    code: 'delphioracle',
                    scope: 'tlosusd',
                    table: 'datapoints'
                });
                this.exchangeRate =
                    exchangeRates.reduce((acc, curr) => acc + curr.value, 0) /
                    exchangeRates.length /
                    10000;
            } catch (err) {
                console.log('getExchangeRate error: ', err);
            }
        }
    },
    mounted() {
        this.getAccountBalance();
        this.getExchangeRate();
    }
};
</script>

<style lang="scss">
.ready-case-form {
    min-width: 450px;
    .error {
        color: red;
    }
}
</style>