<template>
	<q-btn-dropdown class="header-submenu-tab" auto-close stretch flat label="Resolve">
		<q-list>
			<q-item
				clickable
				@click="$router.push('/resolve')"
			>
				<q-item-section>
					<q-item-label>
						Welcome
					</q-item-label>
				</q-item-section>
			</q-item>
			<q-item
				clickable
				@click="$router.push('/resolve/elections')"
			>
				<q-item-section>
					<q-item-label>
						Elections
					</q-item-label>
				</q-item-section>
			</q-item>
			<q-item
				clickable
				@click="$router.push('/resolve/arbitrator')"
				v-if="selfArbitrator"
			>
				<q-item-section>
					<q-item-label>
						Arbitrator
					</q-item-label>
				</q-item-section>
			</q-item>
			<q-item
				clickable
				@click="$router.push('/resolve/cases')"
			>
				<q-item-section>
					<q-item-label>
						Cases
					</q-item-label>
				</q-item-section>
			</q-item>
		</q-list>
	</q-btn-dropdown>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';

export default {
    data () {
        return {
			
        };
    },
    computed: {
        ...mapGetters({
            isAuthenticated: 'accounts/account',
            selfArbitrator: 'resolve/isArbitrator',
        })
    }
};
</script>

<style scoped>

</style>