# Telos App (app-telos-net)

Native App

[https://app-telos-native.pages.dev/](https://app-telos-native.pages.dev/)

### Note regarding Node version

It is recommended to use Node version >= 16.0.0

Using nvm: `nvm use 16`

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
