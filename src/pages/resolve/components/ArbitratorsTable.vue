<template>
    <div class="q-pa-md" v-if="arbitratorsData">
        <q-table
            title="Arbitrators"
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
                { name: 'arb', field: 'arb', label: 'Arbitrator' },
                { name: 'arb_status', field: 'arb_status', label: 'Status' },
                {
                    name: 'open_case_ids',
                    field: 'open_case_ids',
                    label: 'Open Cases'
                },
                {
                    name: 'closed_case_ids',
                    field: 'closed_case_ids',
                    label: 'Closed Cases'
                },
                {
                    name: 'credentials_link',
                    field: 'credentials_link',
                    label: 'Credentials'
                },
                {
                    name: 'elected_time',
                    field: 'elected_time',
                    label: 'Elected'
                },
                {
                    name: 'term_expiration',
                    field: 'term_expiration',
                    label: 'Term Ends'
                },
                { name: 'languages', field: 'languages', label: 'Languages' }
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