module.exports = {
  extends: [
    '@linters/eslint-config-node',
    '@linters/eslint-config-typescript',
    '@linters/eslint-config-vitest',
    'prettier',
  ],
  rules: {
    'no-void': 1,
    'vitest/prefer-to-be': 0,
    'no-invalid-this': 1,
    'no-underscore-dangle': 1
  },
}
