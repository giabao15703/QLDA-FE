// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiUrl: 'http://localhost:8000/',
    socketUrl: 'ws://localhost:8000/ws/',
    graphQL: 'http://localhost:8000/graphql/',
    wsGraphQL: 'ws://localhost:8000/graphql/',
};

/* export const environment = {
    production: false,
    apiUrl: 'https://uat.e-auction.api.nextpro.io/',
    socketUrl: 'ws://uat.e-auction.api.nextpro.io/ws/',
    graphQL: 'https://uat.e-auction.api.nextpro.io/graphql/',
    wsGraphQL: 'ws://uat.e-auction.api.nextpro.io/graphql/',
}; */

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
