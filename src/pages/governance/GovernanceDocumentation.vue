<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getGovernanceHistory, GovernanceData } from "./governanceHistory";
import { QMarkdown } from "@quasar/quasar-ui-qmarkdown";

const governanceData = ref<Array<GovernanceData>>([]);

onMounted(async () => {
  governanceData.value = await getGovernanceHistory();
});
</script>

<template>
  <ol>
    <div v-for="(amendment, index) in governanceData" :key="index">
      <div>
        On {{ amendment.lastAmended }} {{ amendment.amendedBy }} modified
        {{ amendment.sections.length }} sections:
      </div>
      <ol>
        <div v-for="section in amendment.sections" :key="section.hash">
          <q-markdown>{{ section.text }}</q-markdown>
          <div class="c-numbered-list__number">
            <a
              :href="'https://ipfs.telos.net/ipfs/' + section.hash"
              target="_blank"
              >{{ section.number }} {{ section.name }} - {{ section.hash }}</a
            >
          </div>
        </div>
      </ol>
    </div>
  </ol>
</template>

<style src="@quasar/quasar-ui-qmarkdown/dist/index.css"></style>
