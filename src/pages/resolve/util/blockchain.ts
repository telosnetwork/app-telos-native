import { Arbitrator, SymbolInfo } from '../types';

const VALID_CHARACTERS = 'abcdefghijklmnopqrstuvwxyz12345';

export const validateId = (name: string) => {
    const validCharacterList = VALID_CHARACTERS.split('');
    let isValid = true;
    if (name.includes('.')) {
        if (name.length < 3 || name.length > 12) {
            isValid = false;
        }
    } else {
        if (name.length !== 12) {
            isValid = false;
        }
    }
    const nameCharacterList = name.split('');
    for (const character of nameCharacterList) {
        if (!validCharacterList.includes(character)) {
            isValid = false;
        }
    }
    return isValid;
};

export const generateRandomId = (length: number = 12) => {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz12345';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        const char = characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
        result += char;
    }
    return result;
};

export const validateIpfsHash = (url: string) => {
    if (url.length !== 46 && url.length !== 49) return false;
    return true;
};

export const fetchArbConfig = async (context: any) => {
    const { rows } = await context.$store.$api.getTableRows({
        code: process.env.ARB_CONTRACT,
        scope: process.env.ARB_CONTRACT,
        table: 'config'
    });
    const [config] = rows;
    return config;
};

export const fetchArbitrators = async (context: any) => {
    const { rows } = await context.$store.$api.getTableRows({
        code: process.env.ARB_CONTRACT,
        scope: process.env.ARB_CONTRACT,
        table: 'arbitrators'
    });
    return rows;
};

export const fetchElections = async (context: any) => {
    const { rows } = await context.$store.$api.getTableRows({
        code: process.env.ARB_CONTRACT,
        scope: process.env.ARB_CONTRACT,
        table: 'elections',
        reverse: true
    });
    return rows;
};

export const fetchNominees = async (context: any) => {
    const { rows } = await context.$store.$api.getTableRows({
        code: process.env.ARB_CONTRACT,
        scope: process.env.ARB_CONTRACT,
        table: 'nominees'
    });
    return rows;
};

export const fetchCaseFiles = async (context: any, case_id?: number) => {
    const { rows } = await context.$store.$api.getTableRows({
        code: process.env.ARB_CONTRACT,
        scope: process.env.ARB_CONTRACT,
        table: 'casefiles',
        upper_limit: case_id || null,
        lower_limit: case_id || null,
        reverse: true
    });
    return rows;
};

export const fetchOffers = async (context: any) => {
    const { rows } = await context.$store.$api.getTableRows({
        code: process.env.ARB_CONTRACT,
        scope: process.env.ARB_CONTRACT,
        table: 'offers',
        limit: 1000
    });
    return rows;
};

export const fetchClaims = async (context: any, id: number) => {
    const { rows } = await context.$store.$api.getTableRows({
        code: process.env.ARB_CONTRACT,
        scope: id,
        table: 'claims'
    });
    return rows;
};

export const getBallot = async (context: any, ballot_name: string) => {
    const {
        rows: [ballot]
    } = await context.$store.$api.getTableRows({
        code: 'telos.decide',
        scope: 'telos.decide',
        table: 'ballots',
        lower_bound: ballot_name,
        upper_bound: ballot_name
    });
    return ballot;
};

export const getSymbolInfo = (balance: string): SymbolInfo => {
    if (balance.includes('.')) {
        const [amount, symbol] = balance.split(' ');
        const [whole, decimal] = amount.split('.');
        const decimalCount = decimal.length;
        const tokenSyntax = `${decimalCount},${symbol}`;
        return {
            tokenSyntax,
            decimalCount,
            whole,
            decimal,
            symbol,
            amount
        };
    }
    const [amount, symbol] = balance.split(' ');
    const whole = amount;
    const decimal = '';
    const decimalCount = 0;
    const tokenSyntax = `${decimalCount},${symbol}`;
    return {
        tokenSyntax,
        decimalCount,
        whole,
        decimal,
        symbol,
        amount
    };
};

export const getAvailableArbitratorStatus = (arbitrator: Arbitrator) => {
    if (!arbitrator) return null;
    if (
        new Date(arbitrator.term_expiration + 'Z') < new Date() &&
        [1, 2].includes(arbitrator.arb_status)
    ) {
        return 4;
    }
    return arbitrator.arb_status;
};
