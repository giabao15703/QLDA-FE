const { merge } = require('./node_modules/cyberskill/dist/configs/index.cjs').default;
const config = require('./node_modules/cyberskill/dist/configs/eslint/eslint.base.cjs').default;

module.exports = merge(
    'eslint',
    config,
    {
        ignores: [
            'shared/graphql/generated/graphql.ts',
            'shared/graphql/generated/graphql.schema.json',
            '.nx',
            '.angular',
            'dist',
        ],
    },
    {
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
);
