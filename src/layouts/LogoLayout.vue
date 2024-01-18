<script>
export default {
    name: 'LogoLayout',
};
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white">
      <q-toolbar>
        <q-toolbar-title class="flex items-center">
          <img class="toolbar-img" src="branding/telos-logo-dark.png" />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
.toolbar-img {
  max-height: 30px;
}
</style>
