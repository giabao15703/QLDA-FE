const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        'apps/nextpro-admin/**/*.{ts,html}',
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
    // safelist: ['grid-cols-3'],
};
