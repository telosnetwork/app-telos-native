export default () => ({
  ballots: {
    list: {
      open_ballots: [],
      rows: [],
      pagination: {
        pages: 0,
        next_key: '',
        limit: 250,
        more: true,
        lastQuery: false,
      },
    },
    view: {
      ballot: null,
    },
  },
  ballotVoters: null,
  userVotes: {},
  userTreasuries: null,
  treasuries: {
    list: {
      data: [],
      loaded: false,
      pagination: {
        limit: 100,
      },
    },
    view: {
      treasury: null,
    },
  },
  fees: [],
});
