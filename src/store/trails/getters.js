export const ballotsPagination = ({ ballots }) => ballots.list.pagination;
export const ballots = ({ ballots }) => ballots.list.rows;
export const ballot = ({ ballots }) => ballots.view.ballot;

export const treasuries = ({ treasuries }) => treasuries.list.data;
export const treasuriesOptions = ({ treasuries }) =>
    treasuries.list.data.map((treasury) => ({
        label: `${treasury.title} (${treasury.symbol})`,
        value: treasury.symbol,
    }));
export const treasuriesLoaded = ({ treasuries }) => treasuries.list.loaded;
export const treasury = ({ treasuries }) => treasuries.view.treasury;
export const voters = ({ ballotVoters }) => ballotVoters;
export const userVotes = ({ userVotes }) => userVotes;
export const userTreasury = ({ userTreasuries }) => userTreasuries?userTreasuries.rows:[];
export const treasuryFees = ({ fees }) =>
    fees.find((fee) => fee.key === 'treasury');
export const ballotFees = ({ fees }) =>
    fees.find((fee) => fee.key === 'ballot');
