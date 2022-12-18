<template>
    <div id="elections-table">
        <div class="q-py-lg">
            <q-table
                :title="$t('pages.resolve.elections_table_title')"
                :rows="electionData || []"
                :columns="columns"
                row-key="name"
                :loading="electionData === null"
                class="resolve-table"
                hide-header
            >
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td auto-width>
                            <q-btn
                                size="sm"
                                color="primary"
                                round
                                dense
                                @click="toggleRow(props.row.election_id)"
                                :icon="
                                    expandedRows[props.row.election_id]
                                        ? 'remove'
                                        : 'add'
                                "
                            />
                        </q-td>
                        <q-td key="ballot_name" class="ballot_name">
                            <div class="info">
                                <div class="ballot-name">
                                    {{
                                        props.row.ballot_name ||
                                            `${props.row.election_id}`
                                    }}
                                </div>
                                <div class="ballot-subtitle">
                                    <a
                                        v-if="props.row.info_url"
                                        :href="
                                            `https://api.dstor.cloud/ipfs/${props.row.info_url}`
                                        "
                                        target="_blank"
                                        >{{$t('pages.resolve.elections_table_view_info')}}</a
                                    >
                                </div>
                            </div>
                        </q-td>
                        <q-td key="available_seats" class="default">
                            <span>{{$t('pages.resolve.elections_table_seats')}}</span><br />
                            <span>{{ props.row.available_seats }}</span>
                        </q-td>
                        <q-td key="end_add_candidates_ts" class="default">
                            <span>{{$t('pages.resolve.elections_table_end_add')}}</span><br />
                            <span>{{ props.row.end_add_candidates_ts }}</span>
                        </q-td>
                        <!-- <q-td key="begin_voting_ts" class="default">
              <span>Start Voting</span><br />
              <span>{{ props.row.begin_voting_ts }}</span>
            </q-td> -->
                        <q-td key="end_voting_ts" class="default">
                            <span>
                                {{$t('pages.resolve.elections_table_end_voting')}}
                            </span><br />
                            <span>{{ props.row.end_voting_ts }}</span>
                        </q-td>

                        <!-- <q-td key="info_url">
              <ipfs-link :hash="props.row.info_url">
                {{props.row.info_url}}
              </ipfs-link>
            </q-td> -->
                        <q-td key="status">
                            {{ ELECTION_STATUS[props.row.status] }}
                        </q-td>
                    </q-tr>
                    <q-tr
                        v-if="expandedRows[props.row.election_id]"
                        class="expanded-row"
                        :props="props"
                    >
                        <!-- {{JSON.stringify(props.row)}} -->
                        <candidates-cell
                            :election="props.row"
                            colspan="100%"
                            class="text-left"
                        />
                    </q-tr>
                </template>
            </q-table>
        </div>
    </div>
</template>

<script>
import CandidatesCell from './CandidatesCell.vue';
import { ELECTION_STATUS } from '../constants';
// import IpfsLink from './IpfsLink.vue'
import { mapGetters } from 'vuex';

export default {
    components: {
        CandidatesCell
        // IpfsLink
    },
    data() {
        return {
            columns: [
                { name: 'election_id', label: this.$t('pages.resolve.elections_table_id'), field: 'election_id' },
                {
                    name: 'ballot_name',
                    label: this.$t('pages.resolve.elections_table_ballot_name'),
                    field: 'ballot_name'
                },
                {
                    name: 'candidates',
                    label: this.$t('pages.resolve.elections_table_candidates'),
                    field: 'candidates'
                },
                {
                    name: 'available_seats',
                    label: this.$t('pages.resolve.elections_table_seats'),
                    field: 'available_seats'
                },
                {
                    name: 'end_add_candidates_ts',
                    label: this.$t('pages.resolve.elections_table_end_add'),
                    field: 'end_add_candidates_ts'
                },
                {
                    name: 'begin_voting_ts',
                    label: this.$t('pages.resolve.elections_table_start_voting'),
                    field: 'begin_voting_ts'
                },
                {
                    name: 'end_voting_ts',
                    label: this.$t('pages.resolve.elections_table_end_voting'),
                    field: 'end_voting_ts'
                },
                { name: 'status', label: 'Status', field: 'status' }
            ],
            expandedRows: [],
            ELECTION_STATUS
        };
    },
    methods: {
        toggleRow(electionId) {
            this.expandedRows[electionId] = !this.expandedRows[electionId];
        }
    },
    computed: {
        ...mapGetters({
            currentElection: 'resolve/getCurrentElection'
        }),
        electionData() {
            return this.$store.state.resolve.elections;
        }
    },
    mounted() {
        if (this.currentElection) {
            this.expandedRows[this.currentElection.election_id] = true;
        }
    }
};
</script>

<style lang="scss">
#elections-table {
    .resolve-table {
        .q-table__top {
            background-color: #571aff;
        }

        .q-table__title {
            color: #ffffff;
        }

        .expanded-row {
            td {
            }
        }

        td {
            &.default {
                text-align: left;

                span:nth-child(1) {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 700;
                    font-size: 11px;
                    line-height: 37px;
                    text-transform: uppercase;
                    color: #071a5f;
                    opacity: 0.5;
                }

                &:nth-child(2) {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 37px;
                    color: #333333;
                }
            }

            &.ballot_name {
                flex-direction: column;
                text-align: left;

                .info {
                    flex-direction: column;

                    .ballot-name {
                        font-weight: 400;
                        font-size: 18px;
                        line-height: 37px;
                        color: #571aff;
                    }

                    .ballot-subtitle {
                        font-weight: 400;
                        font-size: 14px;
                        line-height: 18px;
                        color: #333333;
                        opacity: 0.5;
                    }
                }
            }
        }
    }
}
</style>