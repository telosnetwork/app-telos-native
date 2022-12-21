import { ELECTION_STATUS } from './elections';

export const ADMIN_STATUS_MAP = {
    'nominee-registration': 'pages.resolve.admin_status_nominee_reg',
    'election-preparation': 'pages.resolve.admin_status_election_prep',
    voting: 'Voting',
    'election-finalization': 'pages.resolve.admin_status_election_finalization'
};

export const GET_ADMIN_STATUS = (state: any) => {
    const {
        config: { current_election_id }
    } = state;
    const { status: currentElectionStatus } = state.elections.find(
        (e: any) => e.id === current_election_id
    );
    const currentElectionStatusSyntax = ELECTION_STATUS[currentElectionStatus];
    if (currentElectionStatusSyntax === 'Ended') return 'nominee-registration';
};