// interface ENV {
//     API_URL: string;
//     WS_URL: string;
// }

// declare const $ENV: ENV;

// export const environment = {
//     production: true,
//     apiUrl: $ENV.API_URL || 'https://api.nextpro.io/',
//     socketUrl: $ENV.WS_URL ? $ENV.WS_URL + 'ws/' : 'ws://api.nextpro.io/ws/',
//     graphQL: $ENV.API_URL
//         ? $ENV.API_URL + 'graphql/'
//         : 'https://api.nextpro.io/graphql/',
// };

// export const environment = {
//     production: true,
//     apiUrl: process.env['NX_APP_API_URL'] || 'https://api.nextpro.io/',
//     socketUrl: process.env['NX_APP_WS_URL'] ? process.env['NX_APP_WS_URL'] + 'ws/' : 'ws://api.nextpro.io/ws/',
//     graphQL: process.env['NX_APP_API_URL']
//         ? process.env['NX_APP_API_URL'] + 'graphql/'
//         : 'https://api.nextpro.io/graphql/',
// };

export const environment = {
    production: true,
    apiUrl: 'https://uat.e-auction.api.nextpro.io/',
    socketUrl: 'ws://uat.e-auction.api.nextpro.io/',
    graphQL: 'https://uat.e-auction.api.nextpro.io/graphql/',
};
