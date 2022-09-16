# Telos Resolve Sequence

## Election

1. Administrator initializes configuration: `setconfig`

Before any elections are initiated or nominees submitted, the contract administrator should set the config with the following values
- `max_elected_arbs`: the maximum number of arbitrators that can be elected. This should represent the maximum number of arbitrators that will serve during any given term
- `election_duration`: the amount of time (in seconds) that an election, not including runoff, should consist of. This does *not* include the nomination period (precedes "add candidate" period).
- `runoff_duration`: same as `election_duration` except would only occur after an election that results in a tie
- `election_add_candidates_duration`: the amount of time during which nominees can be added as a candidate for the election.
- `arbitrator_term_length`: the amount of time, in seconds, that a winning election candidate will have arbitrator authority. After this period the contract administrator will have to initiate the next "add candidate" period.
- `max_claims_per_case`: maximum number of claims that a claimant can submit for a case
- `fee_usd`: todo
- `claimant_accepting_offers_duration`: todo

2. Users start nominating themselves

At any given time a user can nominate themselves for an upcoming election with the `regarb` action. **User will still have to add themselves as an official candidate once the next election is initiated (before voting)**. Users who have **not** nominated themselves during this period will **not** be able to add themselves as a candidate once the next election is initiated. During this stage a user can also remove themselves as a nomninee with the `unregnominee` action.

3. Admin initiates election with `initelection`

This action creates a **draft** election ballot (type "leaderboard") in the `telos.decide` smart contract. During this time period any nominees can add themselves as a **candidate** to the ballot with the `candaddlead` action, and remove themselves with the `candrmvlead` action.

4. Admin starts the voting period with `beginvoting`

At this point the election becomes live and users are able to vote for candidates.

5. Admin finalizes the election results with `endelection` action after voting period ends

Assuming no tie, the winning candidate(s) immediately become arbitrators and the countdown for the duration of the arbitrator's term begins.

If no tie then skip next step

6. If tie, admin starts runoff election with `beginvoting` action (`runoff` value of `true`)

## Arbitration

7. 