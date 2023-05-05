<template>
	<q-btn-dropdown
    id="resolve-menu-dropdown"
    class="header-submenu-tab"
    :class="{'resolve-dropdown-active': isResolveRoute}"
    auto-close
    stretch
    flat
    :label="$t('menu.resolve')"
  >
		<q-list>
			<q-item
				clickable
				@click="$router.push('/resolve')"
			>
				<q-item-section>
					<q-item-label>
						{{$t('pages.resolve.menu_welcome')}}
					</q-item-label>
				</q-item-section>
			</q-item>
			<q-item
				clickable
				@click="$router.push('/resolve/elections')"
			>
				<q-item-section>
					<q-item-label>
						{{$t('pages.resolve.menu_elections')}}
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
						{{$t('pages.resolve.menu_arbitrator')}}
					</q-item-label>
				</q-item-section>
			</q-item>
			<q-item
				clickable
				@click="$router.push('/resolve/cases')"
			>
				<q-item-section>
					<q-item-label>
						{{$t('pages.resolve.menu_cases')}}
					</q-item-label>
				</q-item-section>
			</q-item>
			<q-item
				v-if="isAuthenticated"
				clickable
				@click="$router.push('/resolve/account')"
			>
				<q-item-section>
					<q-item-label>
						{{$t('pages.resolve.menu_account')}}
					</q-item-label>
				</q-item-section>
			</q-item>
		</q-list>
	</q-btn-dropdown>
</template>

<script lang="js">
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
