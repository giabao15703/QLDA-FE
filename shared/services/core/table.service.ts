import { SelectionModel } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import {
    I_TableConfig,
    I_TablePagination,
    I_TableQuery,
    I_TableQueryVariables,
    I_TableSort,
    I_TableState,
    T_Any,
} from '#shared/types';

@Injectable()
export class TableService<D = T_Any> {
    public name: string = uuidv4();
    private configValue: I_TableConfig<D> = {
        columns: [],
        showFilter: false,
        filterForm: [],
        refetch: null,
    };
    private queryValue: I_TableQuery = {
        filter: {},
        sort: {},
        pagination: {},
    };
    private stateValue: I_TableState<D> = {
        data: [],
        pagination: {},
        selection: null,
        expand: null,
    };

    get config(): I_TableConfig<D> {
        return this.configValue;
    }

    set config(value: Partial<I_TableConfig<D>>) {
        this.configValue = { ...this.configValue, ...value };
    }

    get query(): I_TableQuery {
        return this.queryValue;
    }

    set query(value: Partial<I_TableQuery>) {
        this.queryValue = { ...this.queryValue, ...value };
    }

    get state(): I_TableState<D> {
        return this.stateValue;
    }

    set state(value: Partial<I_TableState<D>>) {
        this.stateValue = { ...this.stateValue, ...value };
    }

    onSelectionInit = (selection: SelectionModel<D>) => {
        this.state = { selection };
    };

    onExpandInit = (expand: SelectionModel<D>) => {
        this.state = { expand };
    };

    getQueryVariables = ({ filter, sort, pagination }: I_TableQueryVariables) => ({
        ...(filter && { ...this.query.filter }),
        ...(sort && { ...this.query.sort }),
        ...(pagination && { ...this.query.pagination }),
    });

    refetch = ({ filter = true, sort = true, pagination = true }: I_TableQueryVariables = {}) => {
        this.config?.refetch?.(this.getQueryVariables({ filter, sort, pagination }));
    };

    toggleFilterDrawer = () => {
        this.config = { showFilter: !this.config?.showFilter };
    };

    handleFilter = (values) => {
        this.query = { filter: values };
        this.refetch({ pagination: false });
    };

    handleSort = (values: I_TableSort) => {
        this.query = { sort: values };
        this.refetch();
    };

    handlePageChange = (values: I_TablePagination) => {
        this.query = { pagination: values };
        this.refetch();
    };
}
