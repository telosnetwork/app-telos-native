export type AuthenticationReducer = {
	identity: string,
	profiles: any[],
	chain: string
}

export type RootState = {
	auth: AuthenticationReducer,
	App: any,
	LanguageSwitcher: any,
	ThemeSwitcher: any
}