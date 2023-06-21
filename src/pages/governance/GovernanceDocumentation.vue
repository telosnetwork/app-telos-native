<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getGovernanceHistory, GovernanceData } from "./governanceHistory";
import { QMarkdown } from "@quasar/quasar-ui-qmarkdown";

const router = useRouter();

const governanceData = ref<Array<GovernanceData>>([]);

const goToProfile = (user: string) => {
  router.push({ path: `/profiles/display/${user}` });
};

onMounted(async () => {
  governanceData.value = await getGovernanceHistory();
});
</script>

<template>
  <div class="governance-container">
    <div v-for="(amendment, index) in governanceData" :key="index">
      <div>
        On {{ amendment.lastAmended }}
        <a class="q-markdown--link" @click="goToProfile(amendment.amendedBy)">
          {{ amendment.amendedBy }}
        </a>
        modified {{ amendment.sections.length }} sections:
      </div>
      <div>
        <div v-for="section in amendment.sections" :key="section.hash">
          <q-markdown>{{ section.text }}</q-markdown>
          <div>
            <a
              :href="'https://ipfs.telos.net/ipfs/' + section.hash"
              target="_blank"
              >{{ section.number }} {{ section.name }} - {{ section.hash }}</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@quasar/quasar-ui-qmarkdown/dist/index.css"></style>
<style lang="scss">
.governance-container {
  margin-top: 2rem;
  a {
    color: blue;
    cursor: pointer;
  }
}
</style>
