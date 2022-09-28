<template>
  <div class="q-pa-md">
    <q-table
      title="Case Files"
      :rows="caseFiles"
      :columns="columns"
      row-key="name"
      class="resolve-table"
    >
      <template v-slot:body-cell-claimant="props">
        <q-td :props="props">
          <div class="profile-item">
            <profile-avatar
              :account_name="props.row.claimant"
              size="24px"
              childClass="avatar-wrap"
            ></profile-avatar>
            <div>&nbsp;{{ props.row.claimant }}</div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-respondant="props">
        <q-td :props="props">
          <div class="profile-item">
            <profile-avatar
              :account_name="props.row.respondant"
              size="24px"
              childClass="avatar-wrap"
            ></profile-avatar>
            <div>&nbsp;{{ props.row.respondant }}</div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-arbitrators="props">
        <q-td :props="props">
          <div class="arbitrator-cell profile-item">
            <profile-avatar
              :account_name="props.row.arbitrators[0]"
              size="24px"
              childClass="avatar-wrap"
            ></profile-avatar>
            <div>&nbsp;{{ props.row.arbitrators[0] }}</div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div>
            <q-btn-dropdown color="primary" label="Actions">
              <q-list>
                <q-item
                  clickable
                  v-close-popup
                  @click="goToCaseFile(props.row.case_id)"
                >
                  <q-item-section>
                    <q-item-label>View</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import ProfileAvatar from "src/pages/profiles/ProfileAvatar.vue";

export default {
  components: {
    ProfileAvatar
  },
  data() {
    return {
      columns: [
        { name: "case_id", label: "ID", field: "case_id" },
        { name: "claimant", label: "Claimant", field: "claimant" },
        { name: "respondant", label: "Respondant", field: "respondant" },
        { name: "arbitrators", label: "Arbitrators", field: "arbitrators" },
        { name: "approvals", label: "Approvals", field: "approvals" },
        { name: "case_status", label: "Status", field: "case_status" },
        { name: "update_ts", label: "Last Updated", field: "update_ts" },
        { name: "actions", label: "Actions", field: "actions" }
      ]
    };
  },
  computed: {
    caseFiles() {
      return this.$store.state.resolve.case_files || [];
    }
  },
  methods: {
    goToCaseFile(caseFileId) {
      this.$router.push({ path: `case/${caseFileId}`, params: { caseFileId } });
    }
  }
};
</script>

<style lang="scss" scoped>
.arbitrator-cell {
  padding: 10px 0;
}
.profile-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  span {
    display: inline-block;
    line-height: 24px;
  }
}
</style>