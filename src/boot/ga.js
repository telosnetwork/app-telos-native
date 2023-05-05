import { boot } from 'quasar/wrappers';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
    // something to do
});

//TODO see documentation to replace vue-analytics (below, deprecated) with 'vue-gtag'
//https://github.com/MatteoGabriele/vue-gtag

// import VueAnalytics from 'vue-analytics'

// export default async ({ app, router, store, Vue }) => {
//   Vue.use(VueAnalytics, {
//     id: `${process.env.GOOGLE_ANALYTICS}`,
//     router
//   })
// }
