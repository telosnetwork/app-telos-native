// import PPP from '@smontero/ppp-client-api'

const getAuthenticator = function (ual, wallet = null) {
  wallet = wallet || localStorage.getItem('autoLogin');
  const idx = ual.authenticators.findIndex(
    (auth) => auth.constructor.name === wallet
  );
  return {
    authenticator: ual.authenticators[idx],
    idx,
  };
};

export const login = async function (
  { commit, dispatch },
  { idx, account, returnUrl }
) {
  const authenticator = this.$ual.authenticators[idx];
  try {
    commit('setLoadingWallet', authenticator.getStyle().text);
    await authenticator.init();
    if (!account) {
      const requestAccount = await authenticator.shouldRequestAccountName();
      if (requestAccount) {
        await dispatch('fetchAvailableAccounts', idx);
        commit('setRequestAccount', true);
        return;
      }
    }
    const users = await authenticator.login(account);
    if (users.length) {
      this.$ualUser = users[0];
      const accountName = await users[0].getAccountName();
      commit('setAccount', accountName);
      commit('setUser', this.$ualUser);

      // PPP.setActiveUser(this.$ualUser)
      const defaultReturnUrl = localStorage.getItem('returning')
        ? '/'
        : `/profiles/display/${accountName}`;
      localStorage.setItem('autoLogin', authenticator.constructor.name);
      localStorage.setItem('account', accountName);
      localStorage.setItem('returning', true);
      this.$router.push({ path: returnUrl || defaultReturnUrl });
      await dispatch('getAccount');
    }
  } catch (e) {
    const error =
      (authenticator.getError() && authenticator.getError().message) ||
      e.message ||
      e.reason ||
      e.cause
        ? e.cause.message
        : toString(e);
    console.log('Login error: ', error);
  } finally {
    commit('setLoadingWallet');
  }
};

export const memoryAutoLogin = async function ({
  dispatch,
  rootState,
}) {
  const account = localStorage.getItem('account');

  if (account) {
    // check state and set account
    if (!rootState.accounts.account) {
      await dispatch('autoLogin', location.pathname);
    }
  } else {
    return null;
  }
};

export const logout = async function ({ commit }) {
  // await PPP.authApi().signOut()
  const { authenticator } = getAuthenticator(this.$ual);
  try {
    authenticator && (await authenticator.logout());
  } catch (error) {
    console.log('Authenticator logout error', error);
  }
  commit('profiles/setProfile', undefined, { root: true });
  commit('setAccount');

  localStorage.removeItem('account');
  localStorage.removeItem('autoLogin');
  if (this.$router.path !== '/') {
    this.$router.push({ path: '/' });
  }
};

export const autoLogin = async function ({ dispatch, commit }, returnUrl) {
  const { authenticator, idx } = getAuthenticator(this.$ual);
  if (authenticator) {
    commit('setAutoLogin', true);
    await dispatch('login', {
      idx,
      returnUrl,
      account: localStorage.getItem('account'),
    });
    commit('setAutoLogin', false);
  }
};

export const isAccountFree = async function (context, accountName) {
  try {
    await this.$axios.get(`/v1/accounts/${accountName}`);
    return true;
  } catch (e) {
    // Catch the 404 error if the account doesn't exist
    return false;
  }
};

export const sendOTP = async function ({ commit }, form) {
  try {
    const response = await this.$axios.post('/v1/registrations', {
      smsNumber: form.internationalPhone,
      telosAccount: form.account,
    });
    if (response) {
      commit('setSignUpForm', form);
    }
    return true;
  } catch (e) {
    return {
      error: e.message,
    };
  }
};

export const verifyOTP = async function (
  { state },
  { password, publicKey }
) {
  try {
    await this.$axios.post('/v1/accounts', {
      smsOtp: password,
      smsNumber: state.signUpForm.internationalPhone,
      telosAccount: state.signUpForm.account,
      ownerKey: publicKey,
      activeKey: publicKey,
    });
    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
};

export const createAccount = async function (

  { account, recaptchaResponse, publicKey }
) {
  try {
    await this.$axios.post('/v1/recaptchaCreate', {
      recaptchaResponse: recaptchaResponse,
      accountName: account,
      ownerKey: publicKey,
      activeKey: publicKey,
    });
    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
};

export const fetchAvailableAccounts = async function ({ commit }, idx) {
  commit('resetAvailableAccounts');
  const chainId = process.env.NETWORK_CHAIN_ID;
  const authenticator = this.$ual.authenticators[idx];
  const map = await authenticator.getAccountNamesPerChain();
  const accounts = map.has(chainId) ? map.get(chainId) : [];
  commit('setAvailableAccounts', accounts);
};

export const isAccountClaimed = async function ( accountName) {
  const unstake = await this.$api.getTableRows({
    code: 'tlosrecovery',
    scope: 'tlosrecovery',
    table: 'unstake',
    limit: 1,
    lower_bound: accountName,
    upper_bound: accountName,
  });

  if (unstake.rows.length) {
    return 'unstake';
  }

  const recover = await this.$api.getTableRows({
    code: 'tlosrecovery',
    scope: 'tlosrecovery',
    table: 'recover',
    limit: 1,
    lower_bound: accountName,
    upper_bound: accountName,
  });

  if (recover.rows.length) {
    return 'recover';
  }

  return 'claimed';
};

export const claimAccount = async function ({ commit }, accountName) {
  const removeMeAction = [
    {
      account: 'tlosrecovery',
      name: 'removeme',
      data: {
        account_name: accountName,
      },
    },
  ];
  const notification = {
    icon: 'fas fa-shopping-bag',
    title: 'claim.claimAccount',
    content: `Claim account ${accountName}`,
  };
  try {
    const transaction = await this.$api.signTransaction(removeMeAction);
    notification.status = 'success';
    notification.transaction = transaction;
  } catch (e) {
    notification.status = 'error';
    notification.error = e;
  }
  commit('notifications/addNotification', notification, { root: true });
  return notification.status === 'success';
};

export const getAccount = async function ({ rootState, commit }) {
  let accountData = null;
  if (rootState.accounts.account) {
    accountData = await this.$api.getAccount(rootState.accounts.account);
    accountData.core_liquid_balance = accountData.core_liquid_balance || '0.0000 TLOS';
  }
  commit('setAccountData', accountData);
  return accountData;
};
