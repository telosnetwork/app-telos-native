import { ecc } from 'eosjs/dist/eosjs-ecc-migration';

export const generateKeys = async () => {
    const privateKey = await ecc.randomKey(undefined, { secureEnv: true });
    const publicKey = await ecc.privateToPublic(privateKey);
    return {
        privateKey,
        publicKey,
    };
};
