import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
// import { WebSocketLink } from '@apollo/client/link/ws';
// import { getMainDefinition } from '@apollo/client/utilities';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import extractFiles from 'extract-files/extractFiles.mjs';
import isExtractableFile from 'extract-files/isExtractableFile.mjs';
// import { createPersistedQueryLink } from 'apollo-angular/persisted-queries';
// import { sha256 } from 'crypto-hash';

import { NotificationService } from '#shared/services';
import { T_Any } from '#shared/types';
import { environment } from '../../apps/nextpro-user/src/environments/environment';

/*
  how to use multiple endpoints: https://stackoverflow.com/questions/56212486/connect-an-angular-app-to-multiple-apollo-clients
*/

// const uriWSGraphQL = environment.wsGraphQL;
const token = localStorage.getItem('token');

function createDefaultApollo(
    httpLink: HttpLink,
    notificationService: NotificationService,
    uri: string,
): ApolloClientOptions<T_Any> {
    const cache = new InMemoryCache({
        possibleTypes: {
            UserInterface: ['BuyerNode', 'SupplierNode', 'BuyerSubAccountsNode', 'SupplierSubAccountNode', 'AdminNode'],
        },
    });

    const basicContext = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                Authorization: `Token ${token}`,
            },
        };
    });

    const errorLink = onError(({ graphQLErrors, networkError }) => {
        // React only on graphql errors
        if (graphQLErrors && graphQLErrors.length > 0) {
            if ((graphQLErrors[0] as T_Any)?.statusCode >= 400 && (graphQLErrors[0] as T_Any)?.statusCode < 500) {
                // user rejected request error from server
                const message = Array.isArray(graphQLErrors[0].message)
                    ? graphQLErrors[0].message[0]
                    : graphQLErrors[0].message;
                notificationService.error(message);
            } else {
                // server error with status 500 (do not display text)
                notificationService.error('An error happened on the server, we will be fixing it soon');
            }

            // log errors in console
            graphQLErrors.forEach(({ message, locations, path }) =>
                console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
            );
        }

        if (networkError) {
            console.error(`[Network error]:`, networkError);

            notificationService.error(
                'A network error occurred while executing the operation. Try refreshing the page.',
            );
        }
    });

    const http = httpLink.create({
        uri,
        useMultipart: true,
        extractFiles: (body) => extractFiles(body, isExtractableFile),
    });

    // create http with persisten queries
    // https://apollo-angular.com/docs/recipes/automatic-persisted-queries
    // const http = createPersistedQueryLink({
    //     sha256,
    // }).concat(
    //     httpLink.create({
    //         uri: graphqlURI,
    //     }),
    // );

    // add token to WS connections
    // const ws = new WebSocketLink({
    //     uri: uriWSGraphQL,
    //     options: {
    //         reconnect: true,
    //         connectionParams: {
    //             authorization: `Bearer ${token}`,
    //         },
    //     },
    // });

    // depending on what kind of operation is being sent
    // const link = split(
    //     // split based on operation type
    //     ({ query }) => {
    //         const { kind, operation } = getMainDefinition(query) as T_Any;
    //         return (
    //             kind === 'OperationDefinition' && operation === 'subscription'
    //         );
    //     },
    //     ws,
    //     http,
    // );

    return {
        connectToDevTools: !environment.production,
        assumeImmutableResults: true,
        cache,
        link: ApolloLink.from([basicContext, errorLink, http]),
        defaultOptions: {
            watchQuery: {
                errorPolicy: 'all',
            },
        },
    };
}

// export function createNamedApollo(
//     httpLink: HttpLink,
// ): Record<string, ApolloClientOptions<T_Any>> {
//     return {
//         spaceX: {
//             name: 'spaceX',
//             link: httpLink.create({ uri: 'https://api.spacex.land/graphql/' }),
//             cache: new InMemoryCache(),
//         },
//     };
// }

export const createGraphqlProviders = (uri: string) => [
    {
        provide: APOLLO_OPTIONS,
        useFactory: (httpLink: HttpLink, notificationService: NotificationService) =>
            createDefaultApollo(httpLink, notificationService, uri),
        deps: [HttpLink, NotificationService],
    },
    // {
    //     provide: APOLLO_NAMED_OPTIONS,
    //     deps: [HttpLink],
    //     useFactory: createNamedApollo,
    // },
    Apollo,
];
