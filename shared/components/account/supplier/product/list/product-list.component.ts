import { MaterialModules } from '#shared/modules';
import { LoadingService, NotificationService, ProductService, RouteService, TableService } from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_Product, I_QueryVariables } from '#shared/types';
import { getQueryVariables, makeTableCellClamp } from '#shared/utils';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FilterComponent } from '../../../../filter/filter.component';
import { LoadingComponent } from '../../../../loading/loading.component';
import { TableComponent } from '../../../../table/table.component';
import { SupplierProductFormComponent } from '../form/product-form.component';
@Component({
    standalone: true,
    selector: 'app-supplier-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
    providers: [TableService],
    imports: [
        CommonModule,
        MaterialModules,
        TranslateModule,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        RouterModule,
        SupplierProductFormComponent,
    ],
})
export class SupplierProductListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Product>,
        private routeService: RouteService,
        // private translateService: TranslateService,
        private notificationService: NotificationService,
        private productService: ProductService,
        private cdr: ChangeDetectorRef,
    ) {
        this.table.config.filterForm = [
            {
                label: 'filter.productsType.title',
                name: 'productName_Icontains',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'filter.productsType.product', value: 'product' },
                    { label: 'filter.productsType.featuredProduct', value: 'featured-product' },
                ],
            },
            {
                label: 'filter.productsDescription',
                name: 'productDescription_Icontains',
            },
            {
                label: 'filter.skuNumber',
                name: 'skuNumber_Icontains',
            },
            {
                label: 'filter.status.title',
                placeholder: 'filter.status.title',
                name: 'isVisibility',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'filter.status.view', value: true },
                    { label: 'filter.status.hide', value: false },
                ],
            },
            {
                label: 'filter.adminConfirm.title',
                placeholder: 'filter.adminConfirm.title',
                name: 'confirmedStatus',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'filter.adminConfirm.waiting', value: 'waiting' },
                    { label: 'filter.adminConfirm.approved', value: 'approved' },
                    { label: 'filter.adminConfirm.rejected', value: 'rejected' },
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
                label: 'masterData.no',
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
                cellContentStyle: { textAlign: 'center' },
                name: 'productName',
                label: 'table.productName',
            },
            {
                cellContentStyle: { textAlign: 'center' },
                name: 'type',
                label: 'table.productType',
            },
            {
                cellContentStyle: makeTableCellClamp({ width: '200px' }, 3),
                sort: 'description',
                name: 'description',
                label: 'table.description',
            },
            {
                cellContentStyle: { textAlign: 'center' },
                name: 'skuNumber',
                label: 'table.skuNumber',
            },
            {
                cellContentStyle: { textAlign: 'center' },
                name: 'minimumOrderQuantity',
                label: 'table.MOQ',
            },
            {
                name: 'status',
                label: 'table.status',
            },
            {
                cellContentStyle: {
                    border: '1px solid #e0e0e0',
                    padding: '5px',
                    backgroundColor: '#f39c12',
                    color: 'white',
                    textAlign: 'center',
                },
                sort: 'adminConfirm',
                name: 'confirmedStatus',
                label: 'table.adminConfirm',
            },
            {
                cellContentStyle: { textAlign: 'center' },
                sort: 'reachNumber',
                name: 'reachNumber',
                label: 'table.reachNumber',
            },
            {
                cellContentStyle: { textAlign: 'center' },
                sort: 'clickNumber',
                name: 'clickNumber',
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
                            this.detail = {
                                type: row.type,
                                mode: E_Form_Mode.UPDATE,
                                data: row,
                            };
                            this.cdr.detectChanges();
                        },
                    },
                ],
            },
        ];
    }

    detail = null;
    @Input() supplierId: string;

    ngOnInit() {
        this.getProducts();
    }

    getProducts = async (variables?: I_QueryVariables) => {
        if (!this.supplierId) {
            return;
        }

        const supplierProductList = await this.productService.getSupplierProductList(
            {
                type: 'product',
                userSupplier: this.supplierId,
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = supplierProductList.data;
        this.table.state.pagination = supplierProductList.pagination;
        this.table.state.selection?.clear();
    };

    handleFilter = (values) => {
        this.table.handleFilter({
            ...values,
            ...(values.companyNameSelected && {
                companyNameSelected: values.companyNameSelected.join(','),
            }),
        });
    };

    handleCreateProduct = () => {
        this.detail = {
            type: null,
            mode: E_Form_Mode.CREATE,
            data: {
                supplierId: this.supplierId,
            },
        };
    };

    handleUpdateProduct = (row: I_Product) => {
        this.detail = {
            type: row.type,
            mode: E_Form_Mode.UPDATE,
            data: {
                ...row,
                supplierId: this.supplierId,
            },
        };
        this.cdr.detectChanges();
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

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash();
        this.detail = null;
    };
}
