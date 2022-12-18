<template>
    <div class="q-pa-md" v-if="arbitratorsData">
        <q-table
            :title="$t('pages.resolve.arb_table_title')"
            :rows="arbitratorsData"
            :columns="columns"
            row-key="name"
        >
            <template v-slot:body-cell-arb="props">
                <q-td :props="props">
                    <profile-avatar
                        :account_name="props.arb"
                        size="24px"
                        childClass="profile-avatar"
                    ></profile-avatar>
                    <span>&nbsp;{{ props.row.arb }}</span>
                </q-td>
            </template>
            <template v-slot:body-cell-open_case_ids="props">
                <q-td :props="props">
                    <span v-for="id in props.row.open_case_ids" v-bind:key="id"
                        >{{ id }}<br
                    /></span>
                </q-td>
            </template>
            <template v-slot:body-cell-closed_case_ids="props">
                <q-td :props="props">
                    <span
                        v-for="id in props.row.closed_case_ids"
                        v-bind:key="id"
                        >{{ id }}<br
                    /></span>
                </q-td>
            </template>
            <template v-slot:body-cell-credentials_link="props">
                <q-td :props="props">
                    <ipfs-link
                        v-bind:key="id"
                        :hash="props.row.credentials_link"
                    >
                        {{ props.row.credentials_link }}
                    </ipfs-link>
                </q-td>
            </template>
            <template v-slot:body-cell-arb_status="props">
                <q-td :props="props">
                    <span>{{ getArbStatus(props.row.arb_status) }}</span>
                </q-td>
            </template>
        </q-table>
    </div>
</template>

<script>
import ProfileAvatar from 'src/pages/profiles/ProfileAvatar.vue';
import { ARBITRATOR_STATUS_LIST } from '../constants/arbitrators';
import IpfsLink from './IpfsLink.vue';

export default {
    components: {
        ProfileAvatar,
        IpfsLink
    },
    data() {
        return {
            arbitratorsData: this.$store.state.resolve.arbitrators,
            columns: [
                { name: 'arb', field: 'arb', label: this.$t('pages.resolve.arb_table_arb') },
                { name: 'arb_status', field: 'arb_status', label: this.$t('pages.resolve.arb_table_status') },
                {
                    name: 'open_case_ids',
                    field: 'open_case_ids',
                    label: this.$t('pages.resolve.arb_table_open_cases')
                },
                {
                    name: 'closed_case_ids',
                    field: 'closed_case_ids',
                    label: this.$t('pages.resolve.arb_table_closed_cases')
                },
                {
                    name: 'credentials_link',
                    field: 'credentials_link',
                    label: this.$t('pages.resolve.arb_table_credentials')
                },
                {
                    name: 'elected_time',
                    field: 'elected_time',
                    label: this.$t('pages.resolve.arb_table_elected')
                },
                {
                    name: 'term_expiration',
                    field: 'term_expiration',
                    label: this.$t('pages.resolve.arb_table_term_end')
                },
                { name: 'languages', field: 'languages', label: this.$t('pages.resolve.arb_table_languages') }
            ]
        };
    },
    methods: {
        getArbStatus(statusCode) {
            return ARBITRATOR_STATUS_LIST[statusCode];
        },
        isArbExpired() {
            return false;
        }
    }
};
</script>