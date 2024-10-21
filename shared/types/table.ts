import { SelectionModel } from '@angular/cdk/collections';

import { T_Any } from './common';
import { E_FieldAppearance, I_FieldConfig } from './form';

export interface I_TableColumnItemCtas<D> {
    onClick: (row?: D, index?: number, config?: I_FieldConfig) => void;
    shouldShow?: (row?: D, index?: number, config?: I_FieldConfig) => boolean;
    color?: string;
    icon?: string;
    text?: string;
}

export enum E_TableColumnType {
    SELECTION = 'selection',
    EXPAND = 'expand',
    ACTION = 'action',
    IMAGE = 'image',
    HTML = 'html',
    FORM = 'form',
    UPLOAD = 'upload',
    NUMBER = 'NUMBER',
    TEXT = 'TEXT',
}

export interface I_NestedForm {
    class?: string;
    name?: string;
    config?: I_FieldConfig[];
}

export interface I_TableColumnItem<D> {
    name: string;
    ctas?: I_TableColumnItemCtas<D>[];
    label?: string;
    render?: (cell?: T_Any, index?: number, row?: D) => T_Any;
    sort?: string;
    sticky?: 'left' | 'right';
    headerStyle?: T_Any;
    cellStyle?: T_Any;
    cellContentStyle?: T_Any;
    type?: E_TableColumnType;
    form?: I_NestedForm;
    upload?: { label?: string; appearance?: E_FieldAppearance; accept?: string; preview?: boolean };
    expand?: {
        type?: 'html';
        render: (cell?: T_Any, index?: number, row?: D) => T_Any;
    };
    footer?: {
        label?: string;
        type?: E_TableColumnType;
        cellStyle?: T_Any;
        form?: I_NestedForm;
    };
    directive?: {
        iconSrc: string;
        tooltip: string;
    };
}
export interface I_PaginationState {
    endCursor?: string;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    page?: number;
    pageSize?: number;
    startCursor?: string;
    totalCount?: number;
}

export interface I_TableConfig<D> {
    showFilter?: boolean;
    filterForm?: I_FieldConfig[];
    columns?: I_TableColumnItem<D>[];
    refetch?: (variables: I_QueryVariables) => Promise<void>;
}

export interface I_FormTableConfig<D> {
    columns?: I_TableColumnItem<D>[];
    data?: D;
    class?: string;
    createButton?: {
        text?: string;
    };
}

export interface I_TableQuery {
    filter?;
    sort?: I_TableSort;
    pagination?: I_TablePagination;
}

export interface I_TableQueryVariables {
    filter?: boolean;
    sort?: boolean;
    pagination?: boolean;
}

export interface I_TableState<D> {
    data?: D[];
    pagination?: I_PaginationState;
    selection?: SelectionModel<D>;
    expand?: SelectionModel<D>;
}

export interface I_TablePagination {
    pageIndex?: number;
    pageSize?: number;
}

export interface I_TableSort {
    orderBy?: string;
}

export interface I_QueryVariables extends I_TableSort, I_TablePagination {
    orderRandom?: boolean;
    excludeIdList?: string;
    [key: string]: T_Any;
}

export interface I_NormalizeExtra {
    variables?: I_QueryVariables;
}
