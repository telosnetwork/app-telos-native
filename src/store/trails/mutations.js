import { supplyToSymbol } from "~/utils/assets";

const VOTE_SYMBOL = "VOTE";

export const setFees = (state, config) => {
  state.fees = config.fees;
};

export const addBallots = (state, { rows, more, next_key }) => {

  let before_count = state.ballots.list.rows.length;
  let currentKey = parseInt(state.ballots.list.pagination.next_key);
  let nextKey = parseInt(next_key);
  if (isNaN(currentKey) || isNaN(nextKey) || currentKey < nextKey) {
    state.ballots.list.pagination.pages++;
    state.ballots.list.pagination.next_key = next_key;    
  } else {
    state.ballots.list.pagination.next_key = new Number(nextKey + 1).toString();
  }
  
  // create a ballot name list from incoming rows
  let incoming_names = rows.map(x => x.ballot_name);

  // merging together
  state.ballots.list.rows = state.ballots.list.rows
    // take out old versions of incoming ones
    .filter(ballot => incoming_names.indexOf(ballot.ballot_name) == -1)
    // concat new ones
    .concat(rows);

  let NOW = new Date().getTime();
  state.ballots.list.rows.sort( (A, B) => {
    let A_time = new Date(A.end_time).getTime();
    let B_time = new Date(B.end_time).getTime();
    if (A_time > NOW && B_time > NOW) {
      // Active ballots are sorted to show the next to end first.
      return A_time - B_time;
    } else {
      // Non-active ballots are sorted to show the most recent first.
      return B_time - A_time;
    }
  });

  state.ballots.list.open_ballots = state.ballots.list.rows.filter(b => Date.now() < Date.parse(b.end_time));

  let current_count = state.ballots.list.rows.length;

  if (!more && current_count == before_count) {
    state.ballots.list.pagination.more = false;
  } else {
    state.ballots.list.pagination.more = true;
  }
  
};

export const setBallots = (state, { rows, more }) => {
  if (rows) {
    state.ballots.list.rows = rows;
  }
};

export const setBallot = (state, ballot) => {
  state.ballots.view.ballot = ballot;
};

export const setUserTreasuries = (state, treasuries) => {
  state.userTreasuries = treasuries;
};

export const setUserVotes = (state, votes) => {
  state.userVotes = votes;
};

export const setBallotVotes = (state, voters) => {
  state.ballotVoters = voters;
};

export const updateTreasuries = (state) => {
  // mark every treasury.isRegistered if the current user treasuries (userTreasuries) includes that treasury
  let open_ballots = state.ballots.list.open_ballots;
  let userTreasuries = state.userTreasuries ? state.userTreasuries.rows : [];
  
  state.treasuries.list.data.forEach(t => {
    t.symbol = supplyToSymbol(t.max_supply);
    t.open_ballots = open_ballots.filter( b => b.treasury.max_supply == t.max_supply ).length;
    t.isRegistered = userTreasuries.some( v => supplyToSymbol(v.liquid) === t.symbol );
  });
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
