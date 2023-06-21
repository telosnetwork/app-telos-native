<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getGovernanceHistory, GovernanceData } from './governanceHistory';
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown';

const router = useRouter();
const $q = useQuasar();
const loading = ref<boolean>(false);
const governanceData = ref<Array<GovernanceData>>([]);
const goToProfile = (user: string) => {
    router.push({ path: `/profiles/display/${user}` });
};

onMounted(async () => {
    $q.loading.hide(); // hide main app loading indicator (triggered on direct navigation)
    loading.value = true;
    governanceData.value = await getGovernanceHistory();
    loading.value = false;
});
</script>

<template>
  <q-spinner-dots
    class="fixed-center"
    color="primary"
    name="dots"
    size="60px"
    v-if="loading"
  ></q-spinner-dots>
  <div class="governance-container">
    <div v-for="(amendment, index) in governanceData" :key="index">
      <div class="governance-container__amended-by">
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
            >
              {{ section.name }} - {{ section.hash }}</a
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
  margin: 2rem 1rem;
  &__amended-by {
    margin: 1rem 0;
  }
  a {
    color: blue;
    cursor: pointer;
    word-wrap: break-word;
  }
}
</style>
