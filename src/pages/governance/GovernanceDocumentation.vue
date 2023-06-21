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
  <ol class="c-numbered-list">
    <div
      v-for="(amendment, index) in governanceData"
      :key="index"
      class="c-numbered-list__li"
    >
      <div>
        On {{ amendment.lastAmended }} {{ amendment.amendedBy }} modified
        {{ amendment.sections.length }} sections:
      </div>
      <ol class="c-numbered-list">
        <div
          v-for="section in amendment.sections"
          :key="section.hash"
          class="c-numbered-list__li"
        >
          <div class="c-numbered-list__number">
            {{ section.number }} {{ section.name }} - {{ section.hash }}
          </div>
          <q-markdown>{{ section.text }}</q-markdown>
        </div>
      </ol>
    </div>
  </ol>
</template>

<style src="@quasar/quasar-ui-qmarkdown/dist/index.css"></style>
