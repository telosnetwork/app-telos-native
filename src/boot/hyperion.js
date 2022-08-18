import { boot } from "quasar/wrappers";
import axios from "axios";

export const http = axios.create({
  baseURL: process.env.HYPERION_URL,
});

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, store }) => {
  app.config.globalProperties.$hyperion = http;
  store["$hyperion"] = http;
});
