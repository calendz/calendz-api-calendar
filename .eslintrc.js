module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    use: true,
    make: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
  }
}
