export type TableRowsConfig = {
  code: string | undefined;
  table: string | undefined;
  scope: string | undefined;
  limit?: string;
  upper_bound?: string | null;
  lower_bound?: string | null;
  reverse?: boolean;
  index_position?: string;
  key_type?: string;
};

export type CaseFile = {
  approvals: any[];
  arbitrators: string[];
  case_id: number;
  case_ruling: string;
  case_status: number;
  claimant: string;
  update_ts: number;
  required_langs: number[];
  respondant: string;
  number_claims: number;
};

export type Claim = {
  claim_id: number;
  claim_summary: string;
  decision_link: string;
  response_link: string;
  status: number;
  decision_class: number;
};

export type Election = {
  election_id: 3;
  ballot_name: string;
  info_url: string;
  candidates: { name: string; value: string }[];
  available_seats: number;
  begin_add_candidates_ts: string;
  end_add_candidates_ts: string;
  begin_voting_ts: string;
  end_voting_ts: string;
  status: number;
};

export type Nominee = {
  nominee_name: string;
  credentials_link: string;
  application_time: string;
};

export type Config = {
  admin: string;
  arb_term_length: number;
  available_funds: string;
  contract_version: string;
  current_election_id: number;
  election_add_candidates_ts: number;
  election_voting_ts: number;
  fee_structure: number[];
  max_elected_arbs: number;
  runoff_election_voting_ts: number;
};

export type Arbitrator = {
  arb: string;
  arb_status: number;
  open_case_ids: number[];
  closed_case_ids: number[];
  credentials_link: string;
  elected_time: string;
  term_expiration: string;
  languages: number[];
};

export interface SymbolInfo {
  tokenSyntax: string;
  decimalCount: number;
  whole: string;
  decimal: string;
  amount: string;
  symbol: string;
}

export type HyperionDelta = {
  timestamp: string;
  present: number;
  code: string;
  scope: string;
  table: string;
  primary_key: string;
  payer: string;
  block_num: number;
  block_id: string;
  data: any;
};

export type HyperionAct = {
  account: string;
  name: string;
  authorization: Authorization[];
  data: any;
};

export type HyperionAction = {
  "@timestamp": string;
  timestamp: string;
  block_num: number;
  trx_id: string;
  act: HyperionAct;
  notified: string[];
  cpu_usage_us: number;
  net_usage_words: number;
  account_ram_deltas: { account: string; delta: number }[];
  global_sequence: number;
  receiver: string;
  producer: string;
  action_ordinal: 1;
  creator_action_ordinal: number;
  signatures: string[];
};

export type Authorization = {
  actor: string;
  permission: string;
};
