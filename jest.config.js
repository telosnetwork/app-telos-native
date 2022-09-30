module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  transform: {
    '^.+\\.vue$': 'vue3-jest',
    '^.+\\.js?$': 'babel-jest'
  },
  testMatch:["**/tests/unit/*.spec.[jt]s?(x)"],

  verbose: true,
}
