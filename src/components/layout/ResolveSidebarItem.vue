<template>
	<q-expansion-item
		:label="$t('menu.resolve')"
		id="resolve-sidebar-menu"
		:model-value="isResolveRoute"
	>
	<template v-slot:header>
		<q-route-tab class="aline-left left-menu-tab header">
			Resolve
		</q-route-tab>
	</template>
		<q-route-tab
      :label="$t('menu.welcome')"
      to="/resolve"
      class="aline-left q-my-lg left-menu-tab resolve-route"
    />
		<q-route-tab
      :label="$t('menu.elections')"
      to="/resolve/elections"
      class="aline-left q-my-lg left-menu-tab resolve-route"
    />
		<q-route-tab
      :label="$t('menu.elections')"
      to="/resolve/cases"
      class="aline-left q-my-lg left-menu-tab resolve-route"
    />
		<q-route-tab
      v-if="selfArbitrator"
      :label="$t('menu.arbitrator')"
      to="/resolve/arbitrator"
      class="aline-left q-my-lg left-menu-tab resolve-route"
    />
	</q-expansion-item>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data () {
        return {
            isResolveRoute: this.$route.path.includes('/resolve')
        };
    },
    computed: {
        ...mapGetters ({
            selfArbitrator: 'resolve/isArbitrator',
        }),
    }
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