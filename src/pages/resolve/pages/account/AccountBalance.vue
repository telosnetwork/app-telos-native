<template>
	<q-card id="account-balance">
		<h4>
			<span class="heading">{{$t('pages.resolve.account_balance')}}</span>
			<span class="balance">{{balance}}</span>
		</h4>
		<q-btn
      :label="$t('pages.resolve.account_balance_withdraw')"
      @click="withdraw"
      color="primary"
      :disable="!canWithdraw"
    />
	</q-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { GET_TABLE_ROWS } from '../../constants';
import { getSymbolInfo } from '../../util';

export default {
    data () {
        return {
            balance: 'TLOS'
        };
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        }),
        canWithdraw () {
            const { amount } = getSymbolInfo(this.balance);
            if (parseFloat(amount) > 0) return true;
            return false;
        }
    },
    methods: {
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
        async withdraw() {
            const withdrawActions = [
                {
                    account: process.env.ARB_CONTRACT,
                    name: 'withdraw',
                    data: {
                        owner: this.account
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(withdrawActions);
            } catch (err) {
                console.log('withdraw error: ', err);
            }
        }
    },
    mounted() {
        this.getAccountBalance();
        setInterval(this.getAccountBalance, 10000);
    }
};
</script>

<style lang="scss">
#account-balance {
	padding: 40px;

	h4 {
		width: 100%;
		flex-direction: row;
		display: flex;
		justify-content: space-between;

		.heading {
			display: inline-block;
		}

		.balance {
			display: inline-block;
		}
	}
}
</style>