import { GET_TABLE_ROWS } from './';
import { Claim } from '../types';

const NEXT_PUBLIC_ARBITRATION_CONTRACT =
    process.env.NEXT_PUBLIC_ARBITRATION_CONTRACT;

export const CLAIM_STATUS_LIST = [
    '',
    'pages.resolve.claim_filed',
    'pages.resolve.claim_responded',
    'pages.resolve.claim_accepted',
    'pages.resolve.claim_dismissed'
];

export const CLAIM_CATEGORY_LIST = [
    '',
    'pages.resolve.claim_category_undecided',
    'pages.resolve.claim_category_lost',
    'pages.resolve.claim_category_reversal',
    'pages.resolve.claim_category_emergency',
    'pages.resolve.claim_category_contested',
    'pages.resolve.claim_category_relief',
    'pages.resolve.claim_category_breach',
    'pages.resolve.claim_category_ip',
    'pages.resolve.claim_category_tort',
    'pages.resolve.claim_category_bp',
    'pages.resolve.claim_category_arb',
    'pages.resolve.claim_category_exec',
    'pages.resolve.claim_category_works',
    'pages.resolve.claim_category_tbnoa',
    'pages.resolve.claim_category_misc'
];

export const DECISION_CLASS_LIST = [
    'pages.resolve.claim_category_undecided',
    'pages.resolve.claim_category_lost',
    'pages.resolve.claim_category_reversal',
    'pages.resolve.claim_category_emergency',
    'pages.resolve.claim_category_contested',
    'pages.resolve.claim_category_relief',
    'pages.resolve.claim_category_breach',
    'pages.resolve.claim_category_ip',
    'pages.resolve.claim_category_tort',
    'pages.resolve.claim_category_bp',
    'pages.resolve.claim_category_arb',
    'pages.resolve.claim_category_exec',
    'pages.resolve.claim_category_works',
    'pages.resolve.claim_category_tbnoa',
    'pages.resolve.claim_category_misc'
];

export const FETCH_CLAIMS = async (case_id: string): Promise<Claim[]> => {
    const { rows } = await GET_TABLE_ROWS({
        code: NEXT_PUBLIC_ARBITRATION_CONTRACT,
        scope: case_id,
        table: 'claims'
    });
    return rows;
};