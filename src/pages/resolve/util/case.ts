import { fetchCaseFiles } from "./blockchain";
import axios from "axios";
import { HyperionAction } from "../types";
import { HyperionDelta } from "../types/blockchain";

export const FETCH_DELTAS = async (context: any, params: any) => {
  const { data } = await axios(
    "https://testnet.telos.caleos.io/v2/history/get_deltas",
    {
      params: {
        limit: 40,
        skip: params.skip,
        code: "testtelosarb",
        // track: '',
        // filter: '',
        sort: "desc",
        // after: '',
        // before: '',
        // simple: ''
        ...params,
      },
    }
  );
  return data;
};

export const FETCH_ACTIONS = async (context: any, params: any) => {
  const { data } = await axios(
    "https://testnet.telos.caleos.io/v2/history/get_actions",
    {
      params: {
        limit: 40,
        skip: params.skip,
        account: "testtelosarb",
        code: "testtelosarb",
        // track: '',
        // filter: '',
        sort: "desc",
        // after: '',
        // before: '',
        // simple: ''
        ...params,
      },
    }
  );
  return data;
};

export const FETCH_CASE_ACTIONS_HISTORY = async (
  context: any,
  case_id: number
) => {
  try {
    let skipDeltas = 0;
    let skipActions = 0;
    let earliestBlock: number = 99999999999999;
    const totalActions = [];
    while (true) {
      const { deltas } = await FETCH_DELTAS(context, {
        skip: skipDeltas,
      });
      deltas.forEach(({ table, primary_key, block_num }: HyperionDelta) => {
        if (table === "casefiles" && parseInt(primary_key) === case_id) {
          if (!earliestBlock || earliestBlock > block_num) {
            earliestBlock = block_num;
          }
        }
      });
      if (deltas.length === 0) break;
      skipDeltas += 40;
    }

    while (true) {
      const { actions } = await FETCH_ACTIONS(context, {
        skip: skipActions,
      });
      actions.forEach(({ table, primary_key, block_num }: HyperionDelta) => {
        if (table === "casefiles" && parseInt(primary_key) === case_id) {
          if (!earliestBlock || earliestBlock > block_num) {
            earliestBlock = block_num;
          }
        }
      });
      totalActions.push(...actions);
      if (actions.block_num < earliestBlock || !actions.length) break;
      skipActions += 40;
    }
    console.log("totalActions: ", totalActions);
    const caseActionsHistory = FILTER_CASE_FILE_ACTIONS(totalActions, case_id);
    return caseActionsHistory;
  } catch (err) {
    console.log("FETCH_ACTIONS_HISTORY-> fetchCaseFiles error: ", err);
  }
};

// filecase, readycase, makeoffer, respondoffer, startcase, assignarb, respond, acceptclaim
export const FILTER_CASE_FILE_ACTIONS = (actions: any[], case_id: number) => {
  console.log("actions.length: ", actions.length);
  const filteredActions = actions.filter((action: HyperionAction) => {
    if (action.act && action.act.data && action.act.data.case_id === case_id) {
      return true;
    }
    return false;
  });
  console.log("filteredActions: ", filteredActions, case_id);
  return filteredActions;
};
