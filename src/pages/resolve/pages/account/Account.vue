<template>
    <div id="resolve-account-page" class="row">
			<intro-card
					class="col-xs-12 col-md-6 item"
					:heading="$t('pages.resolve.account_heading')"
					:text="$t('pages.resolve.account_instructions')"
			>
			</intro-card>
			<div class="col-xs-12 col-md-6 item">
				<account-balance />
			</div>
	</div>
</template>

<script>
import IntroCard from '../../components/IntroCard.vue';
import AccountBalance from './AccountBalance.vue';

export default {
    components: {
        IntroCard,
        AccountBalance
    },
    data () {
        return {

        };
    }
};
</script>

<style lang="scss">
#resolve-account-page {
	display: flex;
	flex-direction: row;
	flex: 1;

}
</style>