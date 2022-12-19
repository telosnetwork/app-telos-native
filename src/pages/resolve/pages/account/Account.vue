<template>
    <div id="resolve-account-page">
			<div>
					<intro-card
							class="col-xs-12 col-sm-6"
							:heading="$t('pages.resolve.account_heading')"
							text="Do you have an asset related issue that you’d like the network’s arbitration system to resolve? We believe that a transparent process benefits everyone."
					>
							<template v-slot:buttons>
									<q-btn
											color="primary"
											@click="isModalVisible = !isModalVisible"
											v-if="isAuthenticated"
											>{{$t('pages.resolve.create_case_heading')}}</q-btn
									>
							</template>
					</intro-card>
					<meet-arbitrators
							class="col-xs-12 col-sm-6"
							v-if="isResolveStoresAvailable"
					/>
			</div>
			<div class="form-wrapper">
					<q-dialog v-model="isModalVisible">
							<create-new-case-modal :close="toggleModal" />
					</q-dialog>
			</div>
	</div>
</template>

<script>
import IntroCard from '../../components/IntroCard.vue';

export default {
    components: {
        IntroCard
    },
    data () {
        return {

        };
    }
};
</script>

<style lang="scss">

</style>