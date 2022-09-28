import { supplyToSymbol } from "~/utils/assets";

const VOTE_SYMBOL = "VOTE";

export const setFees = (state, config) => {
  state.fees = config.fees;
};

export const addBallots = (state, { rows, more }) => {
  if (rows) {

    // create a ballot name list from incoming rows
    let incoming_names = rows.map(x => x.ballot_name);

    // merging together
    state.ballots.list.data = state.ballots.list.data
      // take out old versions of incoming ones
      .filter(ballot => incoming_names.indexOf(ballot.ballot_name) == -1)
      // concat new ones
      .concat(rows);

    state.ballots.list.data.sort( (A, B) => {
      return new Date(B.end_time).getTime() - new Date(A.end_time).getTime();
    });

  }
  state.ballots.list.loaded = !more;
};

export const setBallots = (state, { rows, more }) => {
  if (rows) {
    state.ballots.list.data = rows;
  }
  state.ballots.list.loaded = !more;
};

export const stopAddBallots = (state) => {
  state.ballots.list.loaded = true;
};

export const setBallot = (state, ballot) => {
  state.ballots.view.ballot = ballot;
};

export const setUserTreasuries = (state, treasuries) => {
  state.userTreasuries = treasuries;
};

export const setUserVote = (state, vote) => {
  state.userVote = vote;
};

export const setBallotVotes = (state, voters) => {
  state.ballotVoters = voters;
};

export const markRegisteredTreasuries = (state) => {
  // mark every treasury.isRegistered if the current user treasuries (userTreasuries) includes that treasury
  let userTreasuries = state.userTreasuries ? state.userTreasuries.rows : [];
  if (userTreasuries) {
    state.treasuries.list.data.forEach(t => t.isRegistered = userTreasuries.some(
      (v) => supplyToSymbol(v.liquid) === supplyToSymbol(t.max_supply)
    ));
  }
}

export const addTreasuries = (state, { rows, more }) => {
  if (rows) {

    // create a ballot name list from incoming rows
    let incoming_symbols = rows.map(treasury => supplyToSymbol(treasury.max_supply));

    // merging together
    state.treasuries.list.data = state.treasuries.list.data
      // take out old versions of incoming ones
      .filter(treasury => incoming_symbols.indexOf( supplyToSymbol(treasury.max_supply) ) == -1)
      // concat new ones
      .concat(rows);
      
    // sort them by voters but allways put VOTE first
    state.treasuries.list.data.sort( (A, B) => {
      if (A.symbol === VOTE_SYMBOL) return 1;
      if (B.symbol === VOTE_SYMBOL) return -1;
      return B.voters - A.voters;
    });

  }
  state.treasuries.list.loaded = !more;
};

export const updateTreasury = (state, { title, description, treasury }) => {
  const obj = state.treasuries.list.data.find(
    (t) => t.max_supply === treasury.max_supply
  );
  obj.title = title;
  obj.description = description;
};

export const setTreasury = (state, treasury) => {
  state.treasuries.view.treasury = treasury;
};

export const increaseVoters = (state, idx) => {
  state.treasuries.list.data[idx].voters++;
  state.treasuries.list.data[idx].isRegistered = true;
};
