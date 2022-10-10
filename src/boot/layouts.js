import { boot } from 'quasar/wrappers';
import AuthLayout from '../layouts/AuthLayout.vue';
import EmptyLayout from '../layouts/EmptyLayout.vue';
import GuestLayout from '../layouts/GuestLayout.vue';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  app.component('layout-main', AuthLayout);
  app.component('layout-empty', EmptyLayout);
  app.component('layout-guest', GuestLayout);
});
