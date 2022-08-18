import { boot } from "quasar/wrappers";
import LayoutMain from "../layouts/main.vue";
import LayoutEmpty from "../layouts/empty.vue";
import LayoutGuest from "../layouts/guest.vue";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  app.component("layout-main", LayoutMain);
  app.component("layout-empty", LayoutEmpty);
  app.component("layout-guest", LayoutGuest);
});
