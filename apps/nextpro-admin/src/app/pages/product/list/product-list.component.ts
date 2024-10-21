import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ProductDetailComponent } from '#admin/pages/product/detail/product-detail.component';
import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, NotificationService, ProductService, RouteService, TableService } from '#shared/services';
import {
    E_FieldType,
    E_Form_Mode,
    E_ProductConfirmStatus,
    E_ProductType,
    E_TableColumnType,
    I_Product,
    I_QueryVariables,
} from '#shared/types';
import { getQueryVariables, makeTableCellClamp } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-product-list',
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        ProductDetailComponent,
        RouterModule,
    ],
})
export class ProductListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Product>,
        private routeService: RouteService,
        private translateService: TranslateService,
        private notificationService: NotificationService,
        private productService: ProductService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'flash-sale.name',
                name: 'productName_Icontains',
            },
            {
                label: 'flash-sale.description',
                name: 'description_Icontains',
            },
            {
                label: 'flash-sale.skuNumber',
                name: 'skuNumber_Icontains',
            },
            {
                label: 'flash-sale.supplierNo',
                name: 'supplierNo',
            },
            {
                label: 'flash-sale.companyName',
                name: 'companyNameSelected',
                loadingName: 'getSupplierProductListSimple',
                fieldType: E_FieldType.SELECT,
                multiple: true,
                getOptions: () =>
                    this.productService
                        .getSupplierProductListSimple({ type: 'product', first: 50 })
                        .then((res) => res.data),
                mapOption: (item: I_Product) => ({
                    label: item.userSupplier.companyFullName,
                    value: item.userSupplier.companyFullName,
                }),
            },
            {
                label: 'flash-sale.status',
                placeholder: 'flash-sale.status',
                name: 'isVisibility',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'flash-sale.show', value: true },
                    { label: 'flash-sale.hide', value: false },
                ],
            },
            {
                label: 'flash-sale.statusOfApproval',
                placeholder: 'flash-sale.statusOfApproval',
                name: 'confirmedStatus',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'flash-sale.waiting', value: 'waiting' },
                    { label: 'flash-sale.approved', value: 'approved' },
                    { label: 'flash-sale.rejected', value: 'rejected' },
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
                label: 'flash-sale.picture',
            },
            {
                cellContentStyle: makeTableCellClamp({ width: '200px' }, 3),
                name: 'productName',
                label: 'flash-sale.name',
            },
            {
                cellContentStyle: makeTableCellClamp({ width: '200px' }, 3),
                sort: 'description',
                name: 'description',
                label: 'flash-sale.description',
            },
            {
                sort: 'sku_number',
                name: 'skuNumber',
                label: 'flash-sale.skuNumber',
            },
            {
                cellContentStyle: makeTableCellClamp({ width: '100px' }, 3),
                name: 'userSupplier.username',
                label: 'flash-sale.supplierNo',
            },
            {
                cellContentStyle: makeTableCellClamp({ width: '100px' }, 3),
                sort: 'company_name_filter',
                name: 'userSupplier.companyFullName',
                label: 'flash-sale.supplierName',
            },
            {
                cellContentStyle: makeTableCellClamp({ width: '200px' }, 3),
                sort: 'specification',
                name: 'specification',
                label: 'flash-sale.specification',
            },
            {
                sort: 'moq',
                name: 'minimumOrderQuantity',
                label: 'flash-sale.moq',
            },
            {
                type: E_TableColumnType.HTML,
                sort: 'is_visibility',
                name: 'isVisibility',
                label: 'flash-sale.status',
                render: (cell) => {
                    return `<div class="text-white text-center p-[10px] bg-${cell ? 'show' : 'hide'}">
                        ${this.translateService.instant(cell ? 'flash-sale.show' : 'flash-sale.hide')}
                    </div>`;
                },
            },
            {
                type: E_TableColumnType.HTML,
                sort: 'confirmed_status',
                name: 'confirmedStatus',
                label: 'flash-sale.adminConfirm',
                render: (cell) => {
                    let text = cell;

                    switch (cell) {
                        case E_ProductConfirmStatus.WAITING:
                            text = 'flash-sale.waiting';
                            break;
                        case E_ProductConfirmStatus.APPROVED:
                            text = 'flash-sale.approved';
                            break;
                        case E_ProductConfirmStatus.REJECTED:
                            text = 'flash-sale.rejected';
                            break;
                        default:
                            break;
                    }

                    return `<div class="text-white text-center p-[10px] bg-${cell.toLowerCase()}">${this.translateService.instant(text)}</div>`;
                },
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
        this.table.config.refetch = this.getProducts;

        this.routeService.onChange(({ hash }) => {
            this.getProduct(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getProduct();
        this.getProducts();
    }

    getProduct = async (hash?: string) => {
        const productDetail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.productService.getSupplierProduct({
                    id,
                }),
        });

        if (productDetail) {
            this.detail = {
                type: E_ProductType.PRODUCT,
                ...productDetail,
            };
        }
    };

    getProducts = async (variables?: I_QueryVariables) => {
        const supplierProductList = await this.productService.getSupplierProductList(
            {
                type: 'product',
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
