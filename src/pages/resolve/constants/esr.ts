import axios from "axios";

export const getEsrOptions = (url: string) => {
  return {
    // string encoder
    textEncoder: TextEncoder,
    // string decoder
    textDecoder: TextDecoder,
    // zlib string compression (optional, recommended)
    // Customizable ABI Provider used to retrieve contract data
    abiProvider: {
      getAbi: async (account: string) => {
        console.log("account: ", account);
        const { data } = await axios(`${url}/v1/chain/get_abi`, {
          method: "POST",
          data: {
            account_name: account,
          },
        });
        return data.abi;
      },
    },
  };
};

export const getAuth = (identity: string) => [
  {
    actor: identity,
    permission: "active",
  },
];
