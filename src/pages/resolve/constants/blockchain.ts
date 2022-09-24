import axios from "axios";
import { TableRowsConfig, Config } from "../types";

const NETWORK_HOST = process.env.NETWORK_HOST;
const NETWORK_PROTOCOL = process.env.NETWORK_PROTOCOL;
const ARBITRATION_CONTRACT = process.env.ARBITRATION_CONTRACT;

const TABLE_ROWS_SUFFIX = "v1/chain/get_table_rows";
const TABLE_ROWS_ENDPOINT = `${NETWORK_PROTOCOL}://${NETWORK_HOST}/${TABLE_ROWS_SUFFIX}`;

export const GET_TABLE_ROWS = async (
  config: TableRowsConfig
): Promise<{ rows: any[] }> => {
  const { data } = await axios({
    url: TABLE_ROWS_ENDPOINT,
    method: "post",
    headers: {
      "content-type": "application/json"
    },
    data: {
      index_position: "1",
      json: true,
      key_type: "i64",
      limit: 100,
      lower_bound: null,
      reverse: false,
      table_key: "",
      ...config
    }
  });
  return data;
};

export const FETCH_CONFIG = async (): Promise<Config[]> => {
  const {
    rows: [config]
  } = await GET_TABLE_ROWS({
    code: ARBITRATION_CONTRACT,
    scope: ARBITRATION_CONTRACT,
    table: "config",
    reverse: true
  });
  return config;
};
