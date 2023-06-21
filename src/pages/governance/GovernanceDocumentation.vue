<script setup lang="ts">
import { onMounted } from 'vue';
import { getGovernanceHistory, GovernanceData } from './governanceHistory';

onMounted(async () => {
    debugger;
    const data: GovernanceData[] = await getGovernanceHistory();
    console.dir(data);
});
</script>

<template>
  <ol class="c-numbered-list">
    <li
      v-for="index in slotCount"
      :key="`numbered-list-item-${index}`"
      class="c-numbered-list__li"
    >
      <div class="c-numbered-list__number">
        {{ index }}
      </div>
      <div>
        <slot :name="`${index}`"></slot>
      </div>
    </li>
  </ol>
</template>

<style lang="scss"></style>
