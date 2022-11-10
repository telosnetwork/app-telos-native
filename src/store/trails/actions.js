import {
    supplyToAsset,
    supplyToDecimals,
    supplyToSymbol,
} from '~/utils/assets';
// Fees
export const fetchFees = async function ({ commit }) {
    const result = await this.$api.getTableRows({
        code: 'telos.decide',
        scope: 'telos.decide',
        table: 'config',
        limit: 1,
    });
    commit('setFees', result.rows[0]);
};
// Fees
  
// Ballots
export const fetchMoreBallots = async function ({ commit, state }, filters) {
  
    let query = {
        code: 'telos.decide',
        scope: 'telos.decide',
        table: 'ballots',
        limit: state.ballots.list.pagination.limit,
        index_position: 5,
        reverse: true,
        key_type: 'i64',
        lower_bound: state.ballots.list.pagination.next_key,
    };
  
    if (filters.includes('not_started')) {
        query.index_position = 3;
        query.lower_bound = 'setup';
        query.reverse = false;
    }
  
    const result = await this.$api.getTableRows(query);
  
    let treasuries = { rows: [] };
    state.treasuries.list.data.forEach((t) => (treasuries[t.symbol] = t));
  
    for await (const ballot of result.rows) {
        let symbol = supplyToSymbol(ballot.treasury_symbol);
        if (!treasuries.hasOwnProperty(symbol)) {
            const treasury = await this.$api.getTableRows({
                code: 'telos.decide',
                scope: 'telos.decide',
                table: 'treasuries',
                limit: 1,
                lower_bound: symbol,
                upper_bound: symbol,
            });
            treasuries[symbol] = treasury.rows[0];
            treasuries.rows.push(treasuries[symbol]);
        }
  
        ballot.treasury = treasuries[symbol];
    }
    commit('addBallots', result);
    if (treasuries.rows.length > 0) {
        commit('addTreasuries', treasuries);
    }
    commit('updateTreasuries');
};
  
export const fetchTreasuriesForUser = async function ({ commit }, account) {
  
    const res = await this.$api.getTableRows({
        code: 'telos.decide',
        scope: account,
        table: 'voters',
        limit: 1000,
    });
  
    commit('setUserTreasuries', res);
    commit('updateTreasuries');
};
  
export const fetchVotesForBallot = async function ({ commit }, ballot) {
    const res = await this.$api.getTableRows({
        code: 'telos.decide',
        scope: ballot.name,
        table: 'votes',
        limit: ballot.limit,
    });
  
    commit('setBallotVotes', res.rows);
};
  
export const resetUserVotes = async function ({ commit }) {
    commit('setUserVotes', {});
};
  
export const fetchUserVotesForThisBallot = async function (
    { rootState, commit },
    ballot
) {
    let res = { rows: [] };
    if (rootState.accounts.account) {
        res = await this.$api.getTableRows({
            code: 'telos.decide',
            scope: ballot,
            table: 'votes',
            upper_bound: rootState.accounts.account,
            lower_bound: rootState.accounts.account,
            limit: 1,
        });
    }
  
    let userVotes = Object.assign({}, rootState.trails.userVotes);
    userVotes[ballot] = res.rows[0];
  
    for (const [key, value] of Object.entries(userVotes)) {
        if (!value || value.voter !== rootState.accounts.account) {
            delete userVotes[key];
        }
    }
  
    let list = rootState.trails.ballotVoters || [];
    list = list
        .filter((a) => a.voter !== rootState.accounts.account)
        .concat(res.rows);
  
    commit('setUserVotes', userVotes);
    commit('setBallotVotes', list);
};
  
export const setBallot = async function ({ commit }, ballot) {
    commit('setBallot', ballot);
};
  
export const fetchBallot = async function ({ commit }, ballot) {
    const result = await this.$api.getTableRows({
        code: 'telos.decide',
        scope: 'telos.decide',
        table: 'ballots',
        limit: 1,
        lower_bound: ballot,
        upper_bound: ballot,
    });
  
    const treasury = await this.$api.getTableRows({
        code: 'telos.decide',
        scope: 'telos.decide',
        table: 'treasuries',
        limit: 1,
        lower_bound: supplyToSymbol(result.rows[0].treasury_symbol),
        upper_bound: supplyToSymbol(result.rows[0].treasury_symbol),
    });
  
    if (result.rows[0].category === 'proposal') {
        const proposalInfo = await this.$api.getTableRows({
            code: 'works.decide',
            scope: 'works.decide',
            table: 'proposals',
            limit: 1,
            lower_bound: ballot,
            upper_bound: ballot,
        });
  
        result.rows[0].proposal_info = proposalInfo.rows[0];
    }
  
    result.rows[0].treasury = treasury.rows[0];
    commit('addBallots', result);
    commit('setBallot', result.rows[0]);
};
  
const createTogglebalFor = function(ballotName, text) {
    return {
        account: 'telos.decide',
        name: 'togglebal',
        data: {
            ballot_name: ballotName,
            setting_name: text,
        },
    };
};
  
export const openBallotForVoting = async function ({ commit }, params) {
  
    let {ballot_name, endTime} = params;
  
    const notification = {
        icon: 'fas fa-person-booth',
        title: 'notifications.trails.addBallot',
        content: 'Ballot opened for voting successfully',
    };
  
    try {
        const actions = [{
            account: 'telos.decide',
            name: 'openvoting',
            data: {
                ballot_name: ballot_name,
                end_time: new Date(endTime).toISOString().slice(0, -5),
            },
        }];
  
        const transaction = await this.$api.signTransaction(actions);
        notification.status = 'success';
        notification.transaction = transaction;
    } catch (e) {
        notification.status = 'error';
        notification.error = e;
    }
    commit('notifications/addNotification', notification, { root: true });
    return notification.status === 'success';
};
  
export const addBallot = async function ({ commit, state, rootState }, ballot) {
    const ballotName = ballot.title
        .toLowerCase()
        .replace(/[^a-z12345]/gi, '')
        .substring(0,12);
  
    const deposit = state.fees.find((fee) => fee.key === 'ballot').value;
  
    let togglebal = {
        account: 'telos.decide',
        name: 'togglebal',
        data: {
            ballot_name: ballotName,
            setting_name: null,
        },
    };
  
    const notification = {
        icon: 'fas fa-person-booth',
        title: 'notifications.trails.addBallot',
        content: `Ballot: ${ballot.title}, deposit: ${deposit}`,
    };
    try {
        const actions = [
            {
                account: 'eosio.token',
                name: 'transfer',
                data: {
                    from: rootState.accounts.account,
                    to: 'telos.decide',
                    quantity: deposit,
                    memo: 'fees-deposit',
                },
            },
            {
                account: 'telos.decide',
                name: 'newballot',
                data: {
                    ballot_name: ballotName,
                    category: ballot.category,
                    publisher: rootState.accounts.account,
                    treasury_symbol: supplyToAsset(ballot.treasurySymbol.value),
                    voting_method: ballot.votingMethod,
                    initial_options: ballot.initialOptions,
                },
            },
            {
                account: 'telos.decide',
                name: 'editdetails',
                data: {
                    ballot_name: ballotName,
                    title: ballot.title,
                    description: ballot.description,
                    content: ballot.content,
                },
            },
            {
                account: 'telos.decide',
                name: 'editminmax',
                data: {
                    ballot_name: ballotName,
                    new_min_options: parseInt(ballot.minOptions),
                    new_max_options: parseInt(ballot.maxOptions),
                },
            }
        ];
        if (ballot.treasurySymbol.symbol === 'VOTE') {
            actions.splice(2, 0, createTogglebalFor(ballotName, 'votestake'));
        } else if (!ballot.settings) {
            actions.splice(2, 0, createTogglebalFor(ballotName, 'voteliquid'));
        } else if (ballot.settings && ballot.config) {
            if (ballot.config === 'both') {
                actions.splice(2, 0, createTogglebalFor(ballotName, 'votestake'));
                actions.splice(2, 0, createTogglebalFor(ballotName, 'voteliquid'));
            } else {
                togglebal.data.setting_name = ballot.config;
            }
        }
  
        // do the user want to open the ballot immediatelly ?
        if (ballot.endTime > new Date() ) {
            actions.push({
                account: 'telos.decide',
                name: 'openvoting',
                data: {
                    ballot_name: ballotName,
                    end_time: new Date(ballot.endTime).toISOString().slice(0, -5),
                },
            });
        }
  
        const transaction = await this.$api.signTransaction(actions);
        notification.status = 'success';
        notification.transaction = transaction;
    } catch (e) {
        notification.status = 'error';
        notification.error = e;
    }
    commit('notifications/addNotification', notification, { root: true });
    return notification.status === 'success';
};
  
export const deleteBallot = async function ({ commit }, ballot) {
    const notification = {
        icon: 'fas fa-person-booth',
        title: 'notifications.trails.deleteBallot',
        content: `Ballot: ${ballot.title}`,
    };
    try {
        const actions = [
            {
                account: 'telos.decide',
                name: 'closevoting',
                data: {
                    ballot_name: ballot.ballot_name,
                    broadcast: true,
                },
            },
            {
                account: 'telos.decide',
                name: 'deleteballot',
                data: {
                    ballot_name: ballot.ballot_name,
                },
            },
        ];
        const transaction = await this.$api.signTransaction(actions);
        notification.status = 'success';
        notification.transaction = transaction;
    } catch (e) {
        notification.status = 'error';
        notification.error = e;
    }
    commit('notifications/addNotification', notification, { root: true });
    return notification.status === 'success';
};
  
export const cancelBallot = async function ({ commit }, ballot) {
    const notification = {
        icon: 'fas fa-person-booth',
        title: 'notifications.trails.cancelBallot',
        content: `Ballot: ${ballot.title}`,
    };
    try {
        const actions = [
            {
                account: 'telos.decide',
                name: 'cancelballot',
                data: {
                    ballot_name: ballot.ballot_name,
                    memo: 'Cancel ballot',
                },
            },
        ];
        const transaction = await this.$api.signTransaction(actions);
        notification.status = 'success';
        notification.transaction = transaction;
    } catch (e) {
        notification.status = 'error';
        notification.error = e;
    }
    commit('notifications/addNotification', notification, { root: true });
    return notification.status === 'success';
};
  
export const castVote = async function (
    { commit, rootState },
    { register, ballotName, options }
) {
    const notification = {
        icon: 'fas fa-person-booth',
        title: 'notifications.trails.castVote',
        content: `${ballotName} ${options}`,
    };
    try {
        let actions = [
            {
                account: 'telos.decide',
                name: 'refresh',
                data: {
                    voter: rootState.accounts.account,
                },
            },
            {
                account: 'telos.decide',
                name: 'castvote',
                data: {
                    voter: rootState.accounts.account,
                    ballot_name: ballotName,
                    options,
                },
            },
        ];
  
        if (register) {
            let ballot = rootState.trails.ballots.list.rows.find(
                (b) => b.ballot_name === ballotName
            );
            let treasury_symbol = ballot.treasury_symbol;
            actions.unshift({
                account: 'telos.decide',
                name: 'regvoter',
                data: {
                    voter: rootState.accounts.account,
                    treasury_symbol,
                    referrer: null,
                },
            });
        }
        const transaction = await this.$api.signTransaction(actions);
        transaction === null
            ? (notification.status = 'error')
            : (notification.status = 'success');
        notification.transaction = transaction;
    } catch (e) {
        notification.status = 'error';
        notification.error = e;
    }
  
    commit('notifications/addNotification', notification, { root: true });
    return notification.status === 'success';
};
  
export const registerVoter = async function (
    { commit, state, rootState },
    supply
) {
    const notification = {
        icon: 'fas fa-user-plus',
        title: 'notifications.trails.registerVoter',
        content: `Treasury: ${supply}`,
    };
  
    try {
        const actions = [
            {
                account: 'telos.decide',
                name: 'regvoter',
                data: {
                    voter: rootState.accounts.account,
                    treasury_symbol: supplyToAsset(supply),
                    referrer: null,
                },
            },
        ];
        const transaction = await this.$api.signTransaction(actions);
        commit(
            'increaseVoters',
            state.treasuries.list.data.findIndex((t) => t.max_supply === supply)
        );
        notification.status = 'success';
        notification.transaction = transaction;
    } catch (e) {
        notification.status = 'error';
        notification.error = e;
    }
    commit('notifications/addNotification', notification, { root: true });
    return notification.status === 'success';
};
  
// Ballots
  
// Treasuries
export const fetchTreasuries = async function ({ commit, state }) {
    const result = await this.$api.getTableRows({
        code: 'telos.decide',
        scope: 'telos.decide',
        table: 'treasuries',
        limit: state.treasuries.list.pagination.limit,
    });
  
    commit('addTreasuries', result);
    commit('updateTreasuries');
};
  
export const fetchTreasury = async function ({ commit }, treasury) {
    const result = await this.$api.getTableRows({
        code: 'telos.decide',
        scope: 'telos.decide',
        table: 'treasuries',
        limit: 1,
        lower_bound: treasury,
        upper_bound: treasury,
    });
    commit('addTreasuries', result);
    commit('setTreasury', result.rows[0]);
    commit('updateTreasuries');
};
  
export const addTreasury = async function (
    { commit, state, rootState },
    { manager, maxSupply, access, title, description, settings }
) {
    const deposit = state.fees.find((fee) => fee.key === 'treasury').value;
    const notification = {
        icon: 'fas fa-users',
        title: 'notifications.trails.addTreasury',
        content: `Treasury manager: ${manager}, supply: ${maxSupply}, deposit: ${deposit}`,
    };
    try {
        let actions = [
            {
                account: 'eosio.token',
                name: 'transfer',
                data: {
                    from: rootState.accounts.account,
                    to: 'telos.decide',
                    quantity: deposit,
                    memo: 'fees-deposit',
                },
            },
            {
                account: 'telos.decide',
                name: 'newtreasury',
                data: {
                    manager,
                    max_supply: maxSupply,
                    access,
                },
            },
            {
                account: 'telos.decide',
                name: 'edittrsinfo',
                data: {
                    treasury_symbol: supplyToAsset(maxSupply),
                    title,
                    description,
                    icon: null,
                },
            },
        ];
  
        let toggles = settings.filter(x => x.value).map(x => ({
            account: 'telos.decide',
            name: 'toggle',
            data: {
                treasury_symbol: supplyToAsset(maxSupply),
                setting_name: x.key
            },
        }));
  
        actions = actions.concat(toggles);
  
        const transaction = await this.$api.signTransaction(actions);
        notification.status = 'success';
        notification.transaction = transaction;
    } catch (e) {
        notification.status = 'error';
        notification.error = e;
    }
    commit('notifications/addNotification', notification, { root: true });
    return notification.status === 'success';
};
  
export const editTreasury = async function (
    { commit },
    { title, description, treasury }
) {
    const notification = {
        icon: 'fas fa-edit',
        title: 'notifications.trails.editTreasury',
        content: `Treasury: ${title}`,
    };
    try {
        const actions = [
            {
                account: 'telos.decide',
                name: 'edittrsinfo',
                data: {
                    treasury_symbol: supplyToAsset(treasury.max_supply),
                    title,
                    description,
                    icon: null,
                },
            },
        ];
        const transaction = await this.$api.signTransaction(actions);
        commit('updateTreasury', { title, description, treasury });
        notification.status = 'success';
        notification.transaction = transaction;
    } catch (e) {
        notification.status = 'error';
        notification.error = e;
    }
    commit('notifications/addNotification', notification, { root: true });
    return notification.status === 'success';
};
  
export const editTreasurySettings = async function (
    { commit, dispatch},
    { settings, treasury }
) {
    const notification = {
        icon: 'fas fa-edit',
        title: 'notifications.trails.editTreasury',
        content: `Treasury: ${treasury.title}`,
    };
    try {
        let actions = settings.filter((x,i) => treasury.settings[i].value !== x.value)
            .map(x => ({
                account: 'telos.decide',
                name: 'toggle',
                data: {
                    treasury_symbol: supplyToAsset(treasury.symbol),
                    setting_name: x.key
                },
            }));
  
        const transaction = await this.$api.signTransaction(actions);
        commit('updateTreasurySettings', { settings, treasury });
        await dispatch('fetchTreasury', supplyToSymbol(treasury.max_supply));
  
        notification.status = 'success';
        notification.transaction = transaction;
    } catch (e) {
        notification.status = 'error';
        notification.error = e;
    }
    commit('notifications/addNotification', notification, { root: true });
    return notification.status === 'success';
};
  
export const mint = async function (
    { commit },
    { to, quantity, memo, supply }
) {
    const notification = {
        icon: 'fas fa-comment-dollar',
        title: 'notifications.trails.mintTokens',
        content: `Mint ${quantity} ${supplyToSymbol(supply)} to ${to}`,
    };
    try {
        const actions = [
            {
                account: 'telos.decide',
                name: 'mint',
                data: {
                    to,
                    quantity: `${parseFloat(quantity).toFixed(
                        supplyToDecimals(supply)
                    )} ${supplyToSymbol(supply)}`,
                    memo,
                },
            },
        ];
        const transaction = await this.$api.signTransaction(actions);
        notification.status = 'success';
        notification.transaction = transaction;
    } catch (e) {
        notification.status = 'error';
        notification.error = e;
    }
    commit('notifications/addNotification', notification, { root: true });
    return notification.status === 'success';
};