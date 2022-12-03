import { boot } from 'quasar/wrappers';
import { Api, JsonRpc } from 'eosjs';
import { Notify } from 'quasar';

const signTransaction = async function (actions) {
    actions.forEach((action) => {
        if (!action.authorization || !action.authorization.length) {
            action.authorization = [
                {
                    actor: this.state.accounts.account,
                    permission: 'active',
                },
            ];
        }
    });
    let transaction = null;
    try {
        transaction = await this.$ualUser.signTransaction(
            {
                actions,
            },
            {
                blocksBehind: 3,
                expireSeconds: 30,
            }
        );
        Notify.create({ type: 'positive', message: 'Transaction signed' });
    } catch (e) {
        if (e.cause.error) {
            const msg = e.cause.error.details[0].message.replace(
                /assertion failure with message: /g,
                ''
            );
            Notify.create({ type: 'negative', message: msg });
            throw msg;
        } else {
            Notify.create({ type: 'negative', message: e.message });
            throw e;
        }
    }
    return transaction;
};

const getTableRows = async function (options) {
    try {
        return this.$defaultApi.rpc.get_table_rows({
            json: true,
            ...options,
        });
    } catch (e) {
        console.error(e);
    }
};

const getAccount = async function (account) {
    try {
        return this.$defaultApi.rpc.get_account(account);
    } catch (e) {
        console.error(e);
    }
};

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ store }) => {
    const rpc = new JsonRpc(
        `${process.env.NETWORK_PROTOCOL}://${process.env.NETWORK_HOST}:${process.env.NETWORK_PORT}`
    );
    store['$defaultApi'] = new Api({
        rpc,
        textDecoder: new TextDecoder(),
        textEncoder: new TextEncoder(),
    });

    store['$api'] = {
        signTransaction: signTransaction.bind(store),
        getTableRows: getTableRows.bind(store),
        getAccount: getAccount.bind(store),
    };
});