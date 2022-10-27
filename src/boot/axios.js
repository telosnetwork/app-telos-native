import { boot } from 'quasar/wrappers';
import axios from 'axios';

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
export const http = axios.create({
    baseURL: process.env.WEBSERVICES_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${process.env.WEBSERVICES_API_KEY}`,
    },
});

function getErrorMessage(error) {
    if (error.response.data.hasOwnProperty('message')) {
        return error.response.data.message;
    }

    return error.response.data;
}

http.interceptors.response.use(
    (response) => response.data || {},
    (error) => {
        throw new Error(getErrorMessage(error));
    }
);
export default boot(({ app, store }) => {
    // for use inside Vue files (Options API) through this.$axios and this.$api

    app.config.globalProperties.$axios = http;
    // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
    //       so you won't necessarily have to import axios in each vue file

    app.config.globalProperties.$api = http;
    // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
    //       so you can easily perform requests against your app's API

    store['$axios'] = http;
});