import { GET_TABLE_ROWS } from './';

const NEXT_PUBLIC_ARBITRATION_CONTRACT =
    process.env.NEXT_PUBLIC_ARBITRATION_CONTRACT;

export const CASE_STATUS = {
    0: 'pages.resolve.case_status_setup',
    1: 'pages.resolve.case_status_awaiting',
    2: 'pages.resolve.case_status_arbs_assigned',
    3: 'pages.resolve.case_status_investigation',
    4: 'pages.resolve.case_status_decision',
    5: 'pages.resolve.case_status_enforcement',
    6: 'pages.resolve.case_status_resolved',
    7: 'pages.resolve.case_status_dismissed',
    8: 'pages.resolve.case_status_cancelled',
    9: 'pages.resolve.case_status_mistrial'
};

export const CASE_STATUS_LIST = [
    'pages.resolve.case_status_setup',
    'pages.resolve.case_status_awaiting',
    'pages.resolve.case_status_arbs_assigned',
    'pages.resolve.case_status_investigation',
    'pages.resolve.case_status_decision',
    'pages.resolve.case_status_enforcement',
    'pages.resolve.case_status_resolved',
    'pages.resolve.case_status_dismissed',
    'pages.resolve.case_status_cancelled',
    'pages.resolve.case_status_mistrial'
];

export const OFFER_STATUS_LIST = [
    '',
    'pages.resolve.offer_status_pending',
    'pages.resolve.offer_status_accepted',
    'pages.resolve.offer_status_rejected',
    'pages.resolve.offer_status_dismissed'
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