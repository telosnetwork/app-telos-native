import { GET_TABLE_ROWS } from "./blockchain"

export const FETCH_PROFILE = async (account_name: string) => {
	const { rows: [profile] } = await GET_TABLE_ROWS({
		code: 'profiles',
		scope: 'profiles',
		table: 'profiles',
		upper_bound: account_name,
		lower_bound: account_name,
	})
	return profile
}