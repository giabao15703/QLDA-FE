const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        'apps/nextpro-user/**/*.{ts,html}',
        'shared/**/*.{ts,html}',
        ...createGlobPatternsForDependencies(__dirname),
    ],
    theme: {
        extend: {},
        screens: {
            lg: '1024px',
        },
    },
    plugins: [],
};
