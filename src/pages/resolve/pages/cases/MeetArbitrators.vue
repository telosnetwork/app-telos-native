<template>
    <div id="resolve-meet-arbitrators">
        <q-card class="meet-arbitrators-card">
            <h3>{{$t('pages.resolve.meet_arbitrators_title')}}</h3>
            <p>
                {{$t('pages.resolve.meet_arbitrators_info')}}
            </p>
            <ul>
                <li
                    v-for="arbitrator in arbitrators"
                    v-bind:key="arbitrator.arb"
                >
                    <telos-profile-avatar
                        :account_name="arbitrator.arb"
                        size="24px"
                        childClass="avatar-wrap"
                    />&nbsp;
                    <a
                        v-bind:href="getDstorLink(arbitrator.credentials_link)"
                        target="_blank"
                        >{{ arbitrator.arb }}</a
                    >
                    <arbitrator-status-chip :arbitrator="arbitrator" />
                </li>
            </ul>
        </q-card>
    </div>
</template>

<script lang="ts">
import ArbitratorStatusChip from '../../components/ArbitratorStatusChip.vue';
import TelosProfileAvatar from 'src/components/common/TelosProfileAvatar.vue';
import { getDstorLink } from '../../util';
export default {
    components: {
        ArbitratorStatusChip,
        TelosProfileAvatar
    },
    methods: {
        getDstorLink(hash: string) {
            return getDstorLink(hash);
        }
    },
    computed: {
        arbitrators(): any[] {
            // @ts-ignore
            const arbitrators = [...this.$store.state.resolve.arbitrators];
            return arbitrators || [];
        }
    }
};
</script>

<style lang="scss">
#resolve-meet-arbitrators {
    .meet-arbitrators-card {
        padding: 2rem;

        .avatar-wrap {
            display: inline;
        }

        h3 {
            font-style: normal;
            font-weight: 600;
            font-size: 24px;
            line-height: 37px;
            color: rgba(51, 51, 51, 0.5);
        }

        ul {
            list-style-type: none;

            a {
                text-decoration: none;
                color: inherit;
            }
        }
    }
}
</style>