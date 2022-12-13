<template>
	<q-expansion-item
		label="Resolve"
		id="resolve-sidebar-menu"
		:model-value="isResolveRoute"
	>
	<template v-slot:header>
		<q-route-tab class="aline-left left-menu-tab header">
			Resolve
		</q-route-tab>
	</template>
		<q-route-tab label="Welcome" to="/resolve" class="aline-left q-my-lg left-menu-tab resolve-route" />
		<q-route-tab label="Elections" to="/resolve/elections" class="aline-left q-my-lg left-menu-tab resolve-route" />
		<q-route-tab label="Cases" to="/resolve/cases" class="aline-left q-my-lg left-menu-tab resolve-route" />
		<q-route-tab label="Arbitrators" to="/resolve/arbitrator" class="aline-left q-my-lg left-menu-tab resolve-route" />
	</q-expansion-item>
</template>

<script>
export default {
    data () {
        return {
            isResolveRoute: this.$route.path.includes('/resolve')
        };
    },
};
</script>

<style lang="scss">
#resolve-sidebar-menu {
	.header {
		padding-left: 13px !important;
	
	}
	.resolve-route {
		font-size: 18px;
		padding-left: 48px !important;
	}

	.q-tab.header {
		flex: 1 1 auto !important;
	}
}
</style>