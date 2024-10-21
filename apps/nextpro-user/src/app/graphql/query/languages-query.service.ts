import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { Query as ParentQuery, QueryLanguagesArgs } from '#shared/graphql/types';

const QUERY = gql`
    query Languages(
        $before: string
        $after: string
        $first: Int
        $last: Int
        $id: ID
        $itemCode_Icontains: string
        $status: Boolean
        $name: string
        $nameVi: string
        $nameEn: string
        $orderBy: string
    ) {
        languages(
            before: $before
            after: $after
            first: $first
            last: $last
            id: $id
            itemCode_Icontains: $itemCode_Icontains
            status: $status
            name: $name
            nameVi: $nameVi
            nameEn: $nameEn
            orderBy: $orderBy
        ) {
            edges {
                node {
                    id
                    name
                    itemCode
                }
            }
        }
    }
`;

@Injectable({
    providedIn: 'root',
})
export class LanguagesQuery extends Query<ParentQuery, QueryLanguagesArgs> {
    override document = QUERY;
}
