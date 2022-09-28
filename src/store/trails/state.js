export default () => ({
  ballots: {
    list: {
      open_ballots: [],
      data: [],
      loaded: false,
      pagination: {
        limit: 200
      }
    },
    view: {
      ballot: null
    }
  },
  ballotVoters: null,
  userVote: null,
  userTreasuries: null,
  treasuries: {
    list: {
      data: [],
      loaded: false,
      pagination: {
        limit: 100
      }
    },
    view: {
      treasury: null
    }
  },
  fees: []
})
