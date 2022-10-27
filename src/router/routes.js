const routes = [
    {
        path: '/login',
        component: () => import('pages/login/LoginPage.vue'),
        meta: { layout: 'guest', title: 'pages.login.title', guest: true },
    },
    // { path: '/accounts/add', component: () =>
    // import('pages/accounts/add/SendOtp.vue'),
    // meta: { layout: 'guest', title: 'pages.accounts.add.title', guest: true } },
    {
        path: '/accounts/add',
        component: () => import('pages/accounts/add/CreateAccount.vue'),
        meta: { layout: 'guest', title: 'pages.accounts.add.title', guest: true },
    },
    // { path: '/accounts/add/verifyOTP', component:
    // () => import('pages/accounts/add/VerifyOtp.vue'),
    // meta: { layout: 'guest', title: 'pages.accounts.add.title', guest: true } },
    {
        path: '/accounts/add/congratulations',
        component: () => import('pages/accounts/add/CongratulationsPage.vue'),
        meta: { layout: 'empty', guest: true },
    },

    // Works
    {
        path: '/works/proposals',
        component: () => import('pages/works/ProposalsPage.vue'),
        meta: { guest: false },
    },

    // Elections
    {
        name: 'Elections',
        path: '/trails/elections/:id?/:hash?',
        component: () => import('pages/trails/ballots/list/BallotsList.vue'),
        meta: { guest: false },
    },

    // Proposals
    {
        name: 'Proposals',
        path: '/trails/ballots',
        component: () => import('pages/trails/ballots/list/BallotsList.vue'),
        meta: { guest: false },
        alias: '/',
    },

    // Ballot
    {
        name: 'Ballot',
        path: '/trails/ballot/:id?/:hash?',
        component: () => import('pages/trails/ballots/list/BallotsList.vue'),
        meta: { guest: false },
    },

    // DAOs
    {
        name: 'DAOs',
        path: '/trails/treasuries',
        component: () => import('pages/trails/treasuries/list/TreasuriesList.vue'),
        meta: { guest: false },
    },

    // Trails
    {
        path: '/transfers/add',
        component: () => import('pages/transfers/add/SendTokens.vue'),
    },

    // Testnet
    {
        path: '/testnet/rotation',
        component: () => import('pages/testnet/RotationPage.vue'),
        meta: {
            layout: 'empty',
            title: 'pages.testnetRotation.title',
            guest: true,
        },
    },
    {
        path: '/testnet/developers',
        component: () => import('pages/testnet/DevelopersPage.vue'),
        meta: {
            layout: 'empty',
            title: 'pages.testnetDevelopers.title',
            guest: true,
        },
    },

    // Tokens
    {
        path: '/tokens',
        component: () => import('pages/tokens/TokensPage.vue'),
        meta: { title: 'pages.tokens.title', guest: false },
    },

    // Validators
    {
        path: '/validators',
        component: () => import('pages/validators/ValidatorData.vue'),
        meta: { title: 'pages.validators.title', guest: false },
    },

    // POC
    {
        path: '/poc/smartsafe',
        component: () => import('pages/poc/smartsafe/SmartSafe.vue'),
        meta: { title: 'pages.poc.smartSafe.title' },
    },
    {
        path: '/profiles/contacts',
        component: () => import('pages/profiles/list/ContactList.vue'),
        meta: { needVerifyComm: true, needBackendLogin: false },
    },
    {
        path: '/profiles/display/:id',
        component: () => import('pages/profiles/read/ProfileDetail.vue'),
        meta: { needBackendLogin: false },
        name: 'myProfile',
    },
    {
        path: '/profiles/edit/:id',
        component: () => import('pages/profiles/add/SignUp.vue'),
        meta: { needBackendLogin: false },
        name: 'userRegister',
    },
    {
        path: '/profiles/contacts/profileDetail',
        component: () => import('pages/profiles/read/ProfileDetail.vue'),
        meta: { needVerifyComm: true, needBackendLogin: false },
        name: 'profileDetail',
    },
    {
        path: '/profiles/add/profileLogin',
        component: () => import('pages/profiles/read/ProfileLogin.vue'),
        name: 'profileLogin',
    },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes.push({
        path: '/(.*)*',
        component: () => import('pages/404.vue'),
        meta: { layout: 'empty' },
    });
}

export default routes;