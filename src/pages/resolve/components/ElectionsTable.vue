<template>
  <div class="page">
    <div class="q-pa-md">
      <q-table
        title="Elections"
        :rows="electionData || []"
        :columns="columns"
        row-key="name"
        :loading="electionData === null"
        class="resolve-table"
        hide-header
      >
        <template v-slot:body="props">
          <!-- <span>{{JSON.stringify(props)}}</span> -->
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                size="sm"
                color="primary"
                round
                dense
                @click="toggleRow(props.row.election_id)"
                :icon="expandedRows[props.row.election_id] ? 'remove' : 'add'"
              />
            </q-td>
            <q-td key="ballot_name" class="ballot_name">
              <div class="info">
                <div class="ballot-name">
                  {{ props.row.ballot_name || `${props.row.election_id}` }}
                </div>
                <div class="ballot-subtitle">This is some description</div>
              </div>
            </q-td>
            <q-td key="available_seats" class="default">
              <span>Seats</span><br />
              <span>{{ props.row.available_seats }}</span>
            </q-td>
            <q-td key="end_add_candidates_ts" class="default">
              <span>End Nomination</span><br />
              <span>{{ props.row.end_add_candidates_ts }}</span>
            </q-td>
            <q-td key="begin_voting_ts" class="default">
              <span>Start Voting</span><br />
              <span>{{ props.row.begin_voting_ts }}</span>
            </q-td>
            <q-td key="end_voting_ts" class="default">
              <span>End Voting</span><br />
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
            v-show="expandedRows[props.row.election_id]"
            class="expanded-row"
            :props="props"
          >
            <!-- {{JSON.stringify(props.row)}} -->
            <candidates-cell
              :election="props.row"
              colspan="100%"
              class="text-left"
              :totalVotes="totalVotes(props.row)"
            />
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import CandidatesCell from "./CandidatesCell.vue";
import { ELECTION_STATUS } from "../constants";
// import IpfsLink from './IpfsLink.vue'
import { getSymbolInfo } from "../util";

export default {
  components: {
    CandidatesCell
    // IpfsLink
  },
  data() {
    return {
      columns: [
        { name: "election_id", label: "ID", field: "election_id" },
        { name: "ballot_name", label: "Ballot Name", field: "ballot_name" },
        { name: "candidates", label: "Candidates", field: "candidates" },
        { name: "available_seats", label: "Seats", field: "available_seats" },
        {
          name: "end_add_candidates_ts",
          label: "End Add Candidates",
          field: "end_add_candidates_ts"
        },
        {
          name: "begin_voting_ts",
          label: "Start Voting",
          field: "begin_voting_ts"
        },
        { name: "end_voting_ts", label: "End Voting", field: "end_voting_ts" },
        { name: "status", label: "Status", field: "status" }
      ],
      expandedRows: [],
      ELECTION_STATUS
    };
  },
  methods: {
    totalVotes(election) {
      if (election && election.candidates) {
        return election.candidates.reduce((previous, current) => {
          const { whole } = getSymbolInfo(current.votes);
          return previous + whole;
        }, 0);
      } else {
        return 0;
      }
    },
    toggleRow(electionId) {
      this.expandedRows[electionId] = !this.expandedRows[electionId];
    }
  },
  computed: {
    electionData() {
      return this.$store.state.resolve.elections;
    }
  }
};
</script>

<style lang="scss">
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
        font-family: "Roboto";
        font-style: normal;
        font-weight: 700;
        font-size: 11px;
        line-height: 37px;
        text-transform: uppercase;
        color: #071a5f;
        opacity: 0.5;
      }

      &:nth-child(2) {
        font-family: "Roboto";
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
</style>