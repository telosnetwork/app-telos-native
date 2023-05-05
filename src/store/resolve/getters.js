export const isResolveStoresAvailable = (resolve) => {
    if (!resolve) return false;
    const { config, arbitrators, elections, nominees, case_files, offers } =
    resolve;
    const isAvailable = !!(
        config &&
    arbitrators &&
    elections &&
    nominees &&
    case_files &&
    offers
    );
    return isAvailable;
};

export const arbSeatsAvailable = ({ config, arbitrators }) => {
    if (!config || !arbitrators) return 0;
    const { max_elected_arbs } = config;
    let occupiedSeats = 0;

    const nowTimestamp = Math.floor(Date.now() / 1000);
    arbitrators.forEach(({ term_expiration }) => {
        const expirationTimestamp =
      new Date(term_expiration + 'Z').getTime() / 1000;
        if (expirationTimestamp > nowTimestamp) {
            occupiedSeats++;
        }
    });

    const availableSeats = max_elected_arbs - occupiedSeats;
    return availableSeats;
};

export const isResolveAdmin = (resolve, getters, rootState) => {
    if (!resolve.config) return false;
    const {
        config: { admin },
    } = resolve;
    if (!admin) return false;
    const { account } = rootState.accounts;
    return account === admin;
};

export const isArbitrator = (resolve, getters, rootState) => {
    if (!resolve.arbitrators) return false;
    const { arbitrators } = resolve;
    const foundArbitrator = arbitrators.find(
        (arbitrator) => arbitrator.arb === rootState.accounts.account
    );
    return foundArbitrator;
};

export const getCurrentElection = ({ elections, config }) => {
    if (!elections || !config) return null;
    const { current_election_id } = config;
    const currentElection = elections.find(
        (election) => election.election_id === current_election_id
    );
    return currentElection;
};

export const isPastAddCandidates = ({ elections, config }) => {
    if (!elections || !config) return true;
    const currentElection = getCurrentElection({ elections, config });
    if (!currentElection) return true;
    const { end_add_candidates_ts } = currentElection;
    const nowTimestamp = Math.floor(Date.now() / 1000);
    const addCandidatesEndTime =
    new Date(end_add_candidates_ts + 'Z').getTime() / 1000;
    const isPast = nowTimestamp > addCandidatesEndTime;
    return isPast;
};

export const isPastNomination = ({ elections, config }) => {
    if (!elections || !config) return true;
    const currentElection = getCurrentElection({ elections, config });
    if (!currentElection) return true;
    const { begin_add_candidates_ts } = currentElection;
    const nowTimestamp = Math.floor(Date.now() / 1000);
    const beginAddCandidatesTime =
    new Date(begin_add_candidates_ts + 'Z').getTime() / 1000;
    const isPast = nowTimestamp > beginAddCandidatesTime;
    return isPast;
};
