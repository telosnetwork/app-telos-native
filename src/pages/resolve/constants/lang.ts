export const LANG_CODES: {[key: string]: string} = {
		ENGL: '0',
		FRCH: '1',
		GRMN: '2',
		KREA: '3',
		JAPN: '4',
		CHNA: '5',
		SPAN: '6',
		PGSE: '7',
		SWED: '8'
}

export const LANG_CODES_LIST = ['ENGL', 'FRCH', 'GRMN', 'KREA', 'JAPN', 'CHNA', 'SPAN', 'PGSE', 'SWED']

export const GET_LANG_CODES = (): { lang: string, code: string }[] => {
	const langList: { lang: string, code: string }[] = []
	for (const lang in LANG_CODES) {
		langList.push({
			lang,
			code: LANG_CODES[lang]
		})
	}
	return langList
}