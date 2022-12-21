import { createStore } from 'vuex';

import accounts from './accounts';
import profiles from './profiles';
import works from './works';
import notifications from './notifications';
import trails from './trails';
import transfers from './transfers';
import tokens from './tokens';
import validators from './validators';
import testnet from './testnet';
import poc from './poc';
import general from './general';
import resolve from './resolve';
import { store } from 'quasar/wrappers';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default store(function (/* { ssrContext } */) {
    const Store = createStore({
        modules: {
            accounts,
            profiles,
            works,
            notifications,
            poc,
            testnet,
            tokens,
            trails,
            transfers,
            validators,
            general,
            resolve,
        },

        // enable strict mode (adds overhead!)
        // for dev mode only
        strict: process.env.DEV,
    });

    return Store;
});