# Telos App (app-telos-net)

[https://app-telos-native.pages.dev/](https://app-telos-native.pages.dev/)

[Main Net](https://telos-app-native-mainnet.netlify.app/) [![Netlify Status](https://api.netlify.com/api/v1/badges/df3130e3-6286-4f92-8079-47e56acd0abc/deploy-status)](https://app.netlify.com/sites/telos-app-native-mainnet/deploys)

[Test Net](https://telos-app-native-testnet.netlify.app/) [![Netlify Status](https://api.netlify.com/api/v1/badges/9d23d56c-fa1f-4107-acd1-cbcc6805e445/deploy-status)](https://app.netlify.com/sites/telos-app-native-testnet/deploys)

[Staging](https://telos-app-native-staging.netlify.app/) [![Netlify Status](https://api.netlify.com/api/v1/badges/877a1f21-5a5d-42b0-9e8c-3f95cc4b0e69/deploy-status)](https://app.netlify.com/sites/telos-app-native-staging/deploys)

## Recent Contributions

![Alt](https://repobeats.axiom.co/api/embed/fd48297dd5ff515d3c79d35bf68de2f2061d11b9.svg "Repobeats analytics image")

## Note regarding Node version

It is recommended to use Node version 16.10.0

Using nvm: `nvm use 16.10.0`

Do not use uneven versions of Node i.e. 13, 15, etc. These versions are not tested with Quasar and often cause issues due to their experimental nature. We highly recommend always using the LTS version of Node.

## Set up Environment variables

network environment variables (testnet or mainnet) are set by a single variable in `.env` and loaded into `quasar.conf.js` from `env.js`.

```bash
cp .env.example .env
```

## Install the dependencies

Note: requires Node version >=16.0.0

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
yarn dev
```

### Lint the files

```bash
yarn lint

yarn lint:fix
```

### Build the app for production

```bash
yarn build
```

### Environment variables

Mainnet or testnet settings are toggled via the `MAINNET` var in `.env` which loads the tesnet or mainnet variables set in `env.js` into `quasar.config.js`

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).
