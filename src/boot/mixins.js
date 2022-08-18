import { boot } from "quasar/wrappers";
import { utils } from "~/mixins/utils";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  app.mixin(utils);
  // something to do
});
