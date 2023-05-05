const FAIL_MESSAGE = 'Failed to call API';

export const produce = async function (context, accountName) {
    try {
        const response = await this.$axios.get(
            `/v1/testnet/produce/${accountName}`
        );
        return response;
    } catch (e) {
        return e.message ? e.message : FAIL_MESSAGE;
    }
};

export const faucet = async function (context, accountName) {
    try {
        const response = await this.$axios.get(`/v1/testnet/faucet/${accountName}`);
        return response;
    } catch (e) {
        return e.message ? e.message : FAIL_MESSAGE;
    }
};

export const evmFaucet = async function (conntext, evmAddress) {
    try {
        const response = await this.$axios.get(
            `/v1/testnet/evmFaucet/${evmAddress}`
        );
        return response;
    } catch (e) {
        return e.message ? e.message : FAIL_MESSAGE;
    }
};

export const account = async function (context, form) {
    try {
        const response = await this.$axios.post('/v1/testnet/account', {
            ownerKey: form.owner_key,
            activeKey: form.active_key,
            accountName: form.account_name,
        });
        return response;
    } catch (e) {
        return e.message ? e.message : FAIL_MESSAGE;
    }
};
