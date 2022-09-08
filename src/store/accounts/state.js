export default () => ({
  signUpForm: {
    account: null,
    smsNumber: null,
  },
  account: null,
  user: null,
  autoLogin: false,
  loading: {}, // Wallets loading status
  requestAccount: false,
  availableAccounts: {
    list: {
      data: [],
      loaded: true,
    },
  },
});
