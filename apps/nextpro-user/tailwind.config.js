const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        'apps/nextpro-user/**/*.{ts,html}',
        'shared/**/*.{ts,html}',
        ...createGlobPatternsForDependencies(__dirname),
    ],
    theme: {
        container: {
            center: true,
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1380px', // Correct syntax for "2xl"
            },
        },
        extend: {},
    },
    plugins: [],
};
