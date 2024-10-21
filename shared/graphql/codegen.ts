import type { CodegenConfig } from '@graphql-codegen/cli';

const FOLDER = './shared/graphql';
const appUrl = process.env['NX_APP_API_URL'] || 'http://localhost:8000/';
const config: CodegenConfig = {
    overwrite: true,
    schema: `${appUrl}graphql/`,
    documents: `${FOLDER}/schema/**/*.graphql`,
    generates: {
        [`${FOLDER}/generated/graphql.ts`]: {
            plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular'],
            config: {
                addExplicitOverride: true,
            },
        },
        [`${FOLDER}/generated/graphql.schema.json`]: {
            plugins: ['introspection'],
        },
    },
};

export default config;
