<template>
	<q-btn-dropdown id="resolve-menu-dropdown" class="header-submenu-tab" :class="{'resolve-dropdown-active': isResolveRoute}" auto-close stretch flat label="Resolve">
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
    computed: {
        ...mapGetters({
            isAuthenticated: 'accounts/account',
            selfArbitrator: 'resolve/isArbitrator',
        }),
        isResolveRoute () {
            return this.$route.path.includes('/resolve');
        }
    },
    mounted () {
        const el = document.getElementById('resolve-menu-dropdown');
        const bottomBorder = document.createElement('div');
        bottomBorder.classList.add('resolve-dropdown-bottom');
        el?.appendChild(bottomBorder);
    }
};
</script>

<style lang="scss">
.resolve-dropdown-active {
	.resolve-dropdown-bottom {
		height: 5px;
		border-radius: 5px 5px 0 0;
		transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0s;
		transform: none;
		opacity: 1;
		transform-origin: left /* rtl:ignore */;
		color: $primary;
		background: currentColor;
		right: 0;
		bottom: 0;
		left: 0;
		position: absolute;
	}
}
</style>