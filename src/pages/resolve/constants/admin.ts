import { ELECTION_STATUS } from "./elections";

export const ADMIN_STATUS_MAP = {
  "nominee-registration": "Nominee Registration",
  "election-preparation": "Election Preparation",
  voting: "Voting",
  "election-finalization": "Election Finalization",
};

export const GET_ADMIN_STATUS = (state: any) => {
  const {
    config: { current_election_id },
  } = state;
  const { status: currentElectionStatus } = state.elections.find(
    (e: any) => e.id === current_election_id
  );
  const currentElectionStatusSyntax = ELECTION_STATUS[currentElectionStatus];
  if (currentElectionStatusSyntax === "Ended") return "nominee-registration";
};
