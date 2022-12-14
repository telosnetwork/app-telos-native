import { GET_TABLE_ROWS } from './';

const NEXT_PUBLIC_ARBITRATION_CONTRACT =
    process.env.NEXT_PUBLIC_ARBITRATION_CONTRACT;

export const CASE_STATUS = {
    0: 'Case Setup',
    1: 'Awaiting Arbs',
    2: 'Arbs Assigned',
    3: 'Case Investigation',
    4: 'Decision',
    5: 'Enforcement',
    6: 'Resolved',
    7: 'Dismissed',
    8: 'Cancelled',
    9: 'Mistrial'
};

export const CASE_STATUS_LIST = [
    'Case Setup',
    'Awaiting Arbs',
    'Arbs Assigned',
    'Case Investigation',
    'Decision',
    'Enforcement',
    'Resolved',
    'Dismissed',
    'Cancelled',
    'Mistrial'
];

export const OFFER_STATUS_LIST = [
    '',
    'Pending',
    'Accepted',
    'Rejected',
    'Dismissed'
];

export const FETCH_CASE_FILES = async (case_id?: number): Promise<any> => {
    const { rows } = await GET_TABLE_ROWS({
        code: NEXT_PUBLIC_ARBITRATION_CONTRACT,
        scope: NEXT_PUBLIC_ARBITRATION_CONTRACT,
        table: 'casefiles',
        upper_bound: (case_id && case_id.toString()) || null,
        lower_bound: (case_id && case_id.toString()) || null
    });
    return rows;
};
