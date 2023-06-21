<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getGovernanceHistory, GovernanceData } from './governanceHistory';

const governanceData = ref<Array<GovernanceData>>([]);

onMounted(async () => {
    governanceData.value = await getGovernanceHistory();
});
</script>

<template>
  <ol class="c-numbered-list">
    <li
      v-for="(amendment, index) in governanceData"
      :key="index"
      class="c-numbered-list__li"
    >
      <div class="c-numbered-list__number">
        On {{ amendment.lastAmended }} {{ amendment.amendedBy }} modified
        {{ amendment.sections.length }} sections:
      </div>
      <ol class="c-numbered-list">
        <li
          v-for="section in amendment.sections"
          :key="section.hash"
          class="c-numbered-list__li"
        >
          <div class="c-numbered-list__number">
            {{ section.number }} {{ section.name }} - {{ section.hash }}
          </div>
          <div>{{ section.text }}</div>
        </li>
      </ol>
    </li>
  </ol>
</template>

<style lang="scss"></style>
