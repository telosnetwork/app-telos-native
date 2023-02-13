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

export const fetchArbTable = async (context: any, table: string, options: any = {}) => {
    const { rows } = await context.$store.$api.getTableRows({
        code: process.env.ARB_CONTRACT,
        scope: process.env.ARB_CONTRACT,
        table,
        ...options,
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