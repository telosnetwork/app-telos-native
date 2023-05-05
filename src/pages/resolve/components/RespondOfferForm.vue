<template>
    <q-card class="respond-offer-form">
        <q-card-section>
            <div class="text-h6">{{$t('pages.resolve.respond_offer_title')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <p>
                {{$t('pages.resolve.respond_offer_text')}}
            </p>
        </q-card-section>
        <q-card-section v-if="deficit > 0">
            <p class="error">
                <strong>
                    {{$t('pages.resolve.respond_offer_error', { balance, adjustedDeficit, tlosFee })}}
                </strong>
            </p>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
            <q-btn
                flat
                :label="$t('pages.resolve.respond_offer_accept')"
                @click="submit('accept')"
            />
            <q-btn flat color="red" :label="$t('pages.resolve.respond_offer_reject')" @click="submit('reject')" />
            <q-btn flat :label="$t('pages.resolve.respond_offer_cancel')" @click="close" />
        </q-card-actions>
    </q-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { GET_TABLE_ROWS } from '../util';

export default {
    props: ['close', 'caseId', 'offer'],
    data() {
        return {
            balance: 0,
            fee: 0,
            exchangeRate: null
        };
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        }),
        adjustedDeficit() {
            return this.deficit * 1.01;
        },
        tlosFee() {
            return (
                (this.offer.estimated_hours *
                    parseFloat(this.offer.hourly_rate.replace(' USD', ''))) /
                this.exchangeRate
            );
        },
        deficit() {
            if (!this.balance) return 0;
            return this.tlosFee - this.balance.replace(' TLOS', '');
        }
    },
    methods: {
        async submit(type) {
            const respondOfferActions = [];
            if (this.deficit > 0) {
                respondOfferActions.push({
                    account: 'eosio.token',
                    name: 'transfer',
                    data: {
                        from: this.account,
                        to: process.env.ARB_CONTRACT,
                        quantity: `${this.adjustedDeficit.toFixed(4)} TLOS`,
                        memo: 'For arbitration fee'
                    }
                });
            }
            respondOfferActions.push({
                account: process.env.ARB_CONTRACT,
                name: 'respondoffer',
                data: {
                    case_id: this.caseId,
                    offer_id: this.offer.offer_id,
                    accept: type === 'accept' ? true : false
                }
            });
            try {
                await this.$store.$api.signTransaction(respondOfferActions);
                setTimeout(this.close, 2000);
            } catch (err) {
                console.log('submit error: ', err);
            }
        },
        async getAccountBalance() {
            try {
                let balance = '0.0000 TLOS';
                const { rows } = await GET_TABLE_ROWS({
                    limit: 1,
                    code: process.env.ARB_CONTRACT,
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
.respond-offer-form {
    .error {
        color: red;
    }
    .total {
        text-align: center;
        font-size: 1.3rem;
        margin-top: 0;
    }
}
</style>
