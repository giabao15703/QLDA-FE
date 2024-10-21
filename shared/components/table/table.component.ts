import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';
import { NestedValuePipe } from '#shared/pipes';
import { FormService } from '#shared/services';
import { I_FieldConfig, I_PaginationState, I_TableColumnItem, T_Any } from '#shared/types';
import { deepUpdate } from '#shared/utils';
import { LoadingComponent } from '../loading/loading.component';
import { TableFormComponent } from '../table-form/table-form.component';

@Component({
    standalone: true,
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('detailExpand', [
            state('collapsed,void', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    imports: [LoadingComponent, CommonModule, TableFormComponent, MaterialModules, TranslateModule, NestedValuePipe],
})
export class TableComponent {
    @Input() form: FormService;
    @Input() config: I_FieldConfig;
    @Input() isLoading: boolean = false;
    @Input() onShowFilter: () => void;
    @Input() extendHeight: number = 0;
    @Input() class: string;
    @Input() columns: I_TableColumnItem<T_Any>[];
    @Input() data: T_Any[];
    @Input() pagination: I_PaginationState;
    @Input() onPageChange: (event: T_Any) => void;
    @Input() onSort: (event: T_Any) => void;
    @Input() onSelectionInit: (selection: SelectionModel<T_Any>) => void;
    @Input() onExpandInit: (expand: SelectionModel<T_Any>) => void;
    @Input() dataNested: string;

    emptyFormGroup = new FormGroup({
        table: new FormArray([]),
    });
    selection = new SelectionModel(true);
    expand = new SelectionModel(true);
    tableClass: string = '';
    tableColumns: I_TableColumnItem<T_Any>[] = [];
    tableData: T_Any[] = [];

    ngOnInit() {
        this.initializeSelectionAndExpansion();

        if (this.form) {
            this.form.onChange((oldValues, newValues) => {
                if (oldValues[this.config.name] !== newValues[this.config.name]) {
                    this.updateTableData(newValues[this.config.name]);
                }
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.form || changes.config) {
            this.updateTablePropertiesFromConfig();
        } else {
            this.updateTablePropertiesFromInputs(changes);
        }
    }

    private initializeSelectionAndExpansion = () => {
        if (this.onSelectionInit) {
            this.onSelectionInit(this.selection);
        }

        if (this.onExpandInit) {
            this.onExpandInit(this.expand);
        }
    };

    private updateTableData = (newData = []) => {
        if (this.tableData.length === 0) {
            this.tableData = newData;
        } else {
            deepUpdate(this.tableData, newData);
        }
    };

    private updateTablePropertiesFromConfig = () => {
        if (this.config?.table) {
            this.tableClass = this.config.table.class || '';
            this.tableColumns = this.config.table.columns || [];
        }

        this.updateTableData(this.form.getFieldValue(this.config));
    };

    private updateTablePropertiesFromInputs = (changes: SimpleChanges) => {
        if (changes.class) {
            this.tableClass = changes.class.currentValue;
        }

        if (changes.columns) {
            this.tableColumns = changes.columns.currentValue;
        }

        if (changes.data) {
            this.tableData = changes.data.currentValue;
        }
    };

    getExpandColumns = () => this.tableColumns.filter((column) => !!column.expand);

    getExpandColumnsName = () => this.getExpandColumns().map((column) => column.name);

    getAllColumns = () => this.tableColumns;

    getAllColumnsName = () => this.tableColumns.map((column) => column.name);

    handleSort = ({ direction, active }: { direction: string; active: string }) => {
        this.onSort({ ...(direction && { orderBy: `${direction === 'desc' ? '-' : ''}${active}` }) });
    };

    isAllSelected = () => {
        const numSelected = this.selection.selected.length;
        const numRows = this.tableData.length;

        return numRows > 0 && numSelected === numRows;
    };

    toogleSelect = (row: T_Any) => {
        this.selection.toggle(row);
    };

    private selectAllRows = () => {
        this.tableData.forEach((row) => this.selection.select(row));
    };

    toogleSelectAll = (value: { checked: boolean }) => {
        if (value.checked) {
            this.selectAllRows();
        } else {
            this.selection.clear();
        }
    };

    isAllExpanded = () => {
        const numExpanded = this.expand.selected.length;
        const numRows = this.tableData.length;

        return numRows > 0 && numExpanded === numRows;
    };

    toogleExpand = (row: T_Any) => {
        this.expand.toggle(row);
    };

    private selectAllRowsForExpansion = () => {
        this.tableData.forEach((row) => this.expand.select(row));
    };

    toogleExpandAll = () => {
        if (this.isAllExpanded()) {
            this.expand.clear();
        } else {
            this.selectAllRowsForExpansion();
        }
    };

    handleFormCreateRow = (e: Event) => {
        this.form.tableCreateRow(e, this.config);
        this.updateTableData();
    };
}
