import axios from 'axios';
import { HyperionDelta, HyperionAction } from '../types/blockchain';

export const FETCH_DELTAS = async (context: any, params: any) => {
    const { data } = await axios(
        'https://testnet.telos.caleos.io/v2/history/get_deltas',
        {
            params: {
                limit: 200,
                skip: params.skip,
                code: process.env.ARB_CONTRACT,
                sort: 'desc',
                ...params
            }
        }
    );
    return data;
};

export const FETCH_ACTIONS = async (context: any, params: any) => {
    const { data } = await axios(
        'https://testnet.telos.caleos.io/v2/history/get_actions',
        {
            params: {
                limit: 100,
                skip: params.skip,
                account: process.env.ARB_CONTRACT,
                code: process.env.ARB_CONTRACT,
                sort: 'desc',
                ...params
            }
        }
    );
    return data;
};

export const UPDATE_CASE_EARLIEST_BLOCK = (deltas: HyperionDelta[], case_id: number, earliestBlock: number) => {
    let newEarliestBlock = earliestBlock;
    deltas.forEach(
        ({ table, primary_key, block_num }: HyperionDelta) => {
            if (
                table === 'casefiles' &&
                parseInt(primary_key) === case_id
            ) {
                if (!newEarliestBlock || newEarliestBlock > block_num) {
                    newEarliestBlock = block_num;
                }
            }
        }
    );
    return newEarliestBlock;
};

export const FETCH_CASE_ACTIONS_HISTORY = async (
    context: any,
    case_id: number,
    setProgress?: any
) => {
    setProgress && setProgress(5);
    let deltaIterator = 1;
    try {
        let skipDeltas = 0;
        let skipActions = 0;
        let earliestBlock: number = 99999999999999;
        const totalActions = [];
        let shouldDeltasContinue = true;
        while (shouldDeltasContinue) {
            const { deltas } = await FETCH_DELTAS(context, {
                skip: skipDeltas
            });
            earliestBlock = UPDATE_CASE_EARLIEST_BLOCK(deltas, case_id, earliestBlock);
            if (deltas.length === 0) {
                shouldDeltasContinue = false;
                break;
            }
            skipDeltas += 200;
            const newProgress = 5 + (25 * deltaIterator) / (deltaIterator + 1);
            setProgress && setProgress(newProgress);
            deltaIterator++;
        }
        setProgress && setProgress(50);

        let actionIterator = 1;
        let shouldActionsContinue = true;
        while (shouldActionsContinue) {
            const { actions } = await FETCH_ACTIONS(context, {
                skip: skipActions
            });
            earliestBlock = UPDATE_CASE_EARLIEST_BLOCK(actions, case_id, earliestBlock);
            totalActions.push(...actions);
            if (actions.block_num < earliestBlock || !actions.length) {
                shouldActionsContinue = false;
                break;
            }
            skipActions += 100;
            const newProgress =
                30 + (70 * actionIterator) / (actionIterator + 1);
            setProgress && setProgress(newProgress);
            actionIterator++;
        }
        setProgress && setProgress(100);
        const caseActionsHistory = FILTER_CASE_FILE_ACTIONS(
            totalActions,
            case_id
        );
        return caseActionsHistory;
    } catch (err) {
        console.log('FETCH_ACTIONS_HISTORY-> fetchCaseFiles error: ', err);
    }
};

// filecase, readycase, makeoffer, respondoffer, startcase, assignarb, respond, acceptclaim
export const FILTER_CASE_FILE_ACTIONS = (
    actions: any[],
    case_id: number
): HyperionAction[] => {
    const filteredActions = actions.filter((action: HyperionAction) => {
        if (
            action.act &&
            action.act.data &&
            action.act.data.case_id === case_id
        ) {
            return true;
        }
        return false;
    });
    return filteredActions;
};
