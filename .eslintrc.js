module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:cypress/recommended'
    ],
    rules: {
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'space-before-function-paren': ['error', 'never'],
        'no-console': ['error', { 'allow': ['warn', 'error'] }],
        'object-curly-spacing': ['error', 'always', { 'objectsInObjects': false }],
        'no-constant-condition': ['off'],
        'no-undef': ['error'],
        'quotes': ['error', 'single', { 'avoidEscape': true }],
        semi: [2, 'always'],
        // react
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
    },
    parserOptions: {
        restParams: true,
        spread: true,
        ecmaVersion: 9,
        sourceType: 'module',
    },
    env: {
        browser: true,
        node: true,
        es6: true
    },
    globals: {},
    overrides: [],
    settings: {
        react: {
            version: 'detect'
        }
    }
};
