import { MaterialModules } from '#shared/modules';
import { LoadingService, NotificationService, ProductService, RouteService, TableService } from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_Product } from '#shared/types';
import { makeTableCellClamp } from '#shared/utils';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FilterComponent } from '../../../filter/filter.component';
import { LoadingComponent } from '../../../loading/loading.component';
import { TableComponent } from '../../../table/table.component';
import { CreateAdvertisementComponent } from './create/create.component';

@Component({
    standalone: true,
    selector: 'app-supplier-advertisement',
    templateUrl: './advertisement.component.html',
    styleUrls: ['./advertisement.component.scss'],
    providers: [TableService],
    imports: [
        CommonModule,
        MaterialModules,
        TranslateModule,
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        RouterModule,
    ],
})
export class SupplierAdvertisementComponent {
    constructor(
        public dialog: MatDialog,
        public loadingService: LoadingService,
        public table: TableService<I_Product>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private productService: ProductService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'table.description',
                name: 'description',
            },
            {
                label: 'table.validFrom',
                name: 'validFrom',
            },
            {
                label: 'table.validTo',
                name: 'validTo',
            },
            {
                label: 'table.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'filter.active', value: true },
                    { label: 'filter.inactive', value: false },
                ],
            },
            {
                label: 'table.adminConfirm',
                name: 'adminConfirm',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'filter.waiting', value: 'waiting' },
                    { label: 'filter.approved', value: 'approved' },
                    { label: 'filter.rejected', value: 'rejected' },
                ],
            },
        ];
        this.table.config.columns = [
            {
                cellStyle: { width: '50px' },
                sticky: 'left',
                type: E_TableColumnType.SELECTION,
                name: 'selection',
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'left',
                name: 'no',
                label: 'table.no',
                render: (_, index) => {
                    return (this.table.state.pagination.page - 1) * this.table.state.pagination.pageSize + index + 1;
                },
            },
            {
                cellStyle: { width: '60px' },
                type: E_TableColumnType.IMAGE,
                name: 'picture',
                label: 'table.picture',
            },
            {
                cellContentStyle: makeTableCellClamp({ width: '200px' }, 3),
                name: 'description',
                sort: 'description',
                label: 'table.description',
            },
            {
                name: 'validFrom',
                sort: 'validFrom',
                label: 'table.validFrom',
            },
            {
                name: 'validTo',
                sort: 'validTo',
                label: 'table.validTo',
            },
            {
                name: 'status',
                sort: 'status',
                label: 'table.status',
            },
            {
                name: 'adminConfirm',
                sort: 'adminConfirm',
                label: 'table.adminConfirm',
            },
            {
                name: 'reachNumber',
                sort: 'reachNumber',
                label: 'table.reachNumber',
            },
            {
                name: 'clickNumber',
                sort: 'clickNumber',
                label: 'table.clickNumber',
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'action',
                label: 'masterData.actions',
                ctas: [
                    {
                        icon: 'edit',
                        onClick: (row: I_Product) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
    }

    detail = null;

    openCreateAdvertisement(): void {
        const dialogRef = this.dialog.open(CreateAdvertisementComponent, {
            width: '900px',
            panelClass: 'custom-dialog',
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Dialog was closed. Result:', result);
        });
    }

    handleFilter = (values) => {
        this.table.handleFilter({
            ...values,
            ...(values.companyNameSelected && {
                companyNameSelected: values.companyNameSelected.join(','),
            }),
        });
    };

    handleUpdateStatus = async (confirmedStatus) => {
        const selectedProducts = this.table.state.selection.selected;

        const { supplierProductConfirmedStatusUpdate } = await this.productService.updateSupplierProductStatus({
            listIsConfirmed: selectedProducts.map((product) => ({
                id: product.id,
                confirmedStatus,
            })),
        });

        if (supplierProductConfirmedStatusUpdate.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(supplierProductConfirmedStatusUpdate.error?.message);
        }
    };
}
