module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
    extends: ['@nuxtjs', 'plugin:nuxt/recommended'],
    plugins: [],
    // add your custom rules here
    rules: {
        // 'no-console': 'error',
        // 'no-debugger': 'error',
        indent: 'off',
        'vue/attribute-hyphenation': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/html-self-closing': 'off',
        'space-before-function-paren': ['error', 'never'],
        curly: ['error', 'multi-line'],
        'comma-dangle': ['error', 'always-multiline'],
        'no-extra-semi': 'error',
        semi: ['error', 'never'],
        'no-extra-parens': 'error',
        'no-param-reassign': 'error',
        quotes: ['error', 'single'],
        // "linebreak-style": [
        //   "error",
        //   "unix"
        // ],
        'max-len': [
            'error',
            {
                code: 100,
                tabWidth: 4,
                ignoreComments: true,
                ignoreTrailingComments: true,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            },
        ],
    },
}
