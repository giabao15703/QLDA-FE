import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

/* import { PositionDetailComponent } from '#admin/pages/master-data/position/detail/position-detail.component'; */
import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService, NotificationService, RouteService, TableService } from '#shared/services';
import { E_FieldType, E_Form_Mode, E_InputType, E_TableColumnType, I_Position, I_QueryVariables } from '#shared/types';
import { PurchaseOrderListDetailComponent } from '../detail/purchase-order-list-detail.component';

import { getQueryVariables } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-purchase-order-list-list',
    templateUrl: './purchase-order-list-list.component.html',
    styleUrl: './purchase-order-list-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        PurchaseOrderListDetailComponent,
        /* PositionDetailComponent, */
        RouterModule,
    ],
})
export class PurchaseOrderListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Position>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private masterDataService: MasterDataService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'purchaseOrderList.purchaseOrderNo',
                name: 'purchaseOrderNo',
            },
            {
                label: 'purchaseOrderList.buyerNo',
                name: 'buyerNo',
            },
            {
                label: 'purchaseOrderList.buyerName',
                name: 'buyerName',
            },
            {
                label: 'purchaseOrderList.supplierNo',
                name: 'supplierNo',
            },
            {
                label: 'purchaseOrderList.supplierName',
                name: 'supplierName',
            },
            {
                label: 'purchaseOrderList.paymentTerm',
                name: 'paymentTerm',
            },
            {
                label: 'purchaseOrderList.deliveryTerm',
                name: 'deliveryTerm',
            },
            {
                label: 'purchaseOrderList.transporterNo',
                name: 'transporterNo',
            },
            {
                label: 'purchaseOrderList.transporterName',
                name: 'transporterName',
            },
            {
                label: 'purchaseOrderList.deliveryTerm',
                name: 'deliveryTerm',
            },
            {
                label: 'purchaseOrderList.claimRequest',
                name: 'claimRequest',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'purchaseOrderList.yes',
                        value: true,
                    },
                    {
                        label: 'purchaseOrderList.no',
                        value: false,
                    },
                ],
            },
            {
                label: 'purchaseOrderList.orderDate',
                name: 'orderDate',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'purchaseOrderList.deliveryDate',
                name: 'deliveryDate',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'purchaseOrderList.actualPaymentDate',
                name: 'actualPaymentDate',
                inputType: E_InputType.TEXT,
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'purchaseOrderList.referralNo',
                name: 'referralNo',
            },
            {
                label: 'purchaseOrderList.referralName',
                name: 'referralName',
            },
        ];
        this.table.config.columns = [
            {
                cellStyle: { width: '50px' },
                sticky: 'left',
                type: E_TableColumnType.SELECTION,
                name: 'selection',
            },
            /* {
                cellStyle: { width: '50px' },
                sticky: 'left',
                name: 'orderNo',
                label: 'purchaseOrderList.oderNo',
                render: (_, index) => {
                    return (this.table.state.pagination.page - 1) * this.table.state.pagination.pageSize + index + 1;
                },
            }, */
            {
                cellStyle: { width: '200px' },
                sort: 'orderNo',
                name: 'orderNo',
                label: 'purchaseOrderList.orderNo',
                /* render: (_, __, row) => {
                    return translateData(row, 'en', 'name');
                }, */
            },
            {
                cellStyle: { width: '200px' },
                sort: 'orderLine',
                name: 'orderLine',
                label: 'purchaseOrderList.orderLine',
                /* render: (_, __, row) => {
                    return translateData(row, 'en', 'name');
                }, */
            },
            {
                cellStyle: { width: '200px' },
                sort: 'buyerNo',
                name: 'buyerNo',
                label: 'purchaseOrderList.buyerNo',
                /* render: (_, __, row) => {
                    return translateData(row, 'en', 'name');
                }, */
            },
            {
                cellStyle: { width: '200px' },
                sort: 'buyerName',
                name: 'buyerName',
                label: 'purchaseOrderList.buyerName',
                /* render: (_, __, row) => {
                    return translateData(row, 'en', 'name');
                }, */
            },
            {
                cellStyle: { width: '200px' },
                sort: 'productName',
                name: 'productName',
                label: 'purchaseOrderList.productName',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'orderedQTY',
                name: 'orderedQTY',
                label: 'purchaseOrderList.orderedQTY',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'unitPrice',
                name: 'unitPrice',
                label: 'purchaseOrderList.unitPrice',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'ordAmount',
                name: 'ordAmount',
                label: 'purchaseOrderList.ordAmount',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'currency',
                name: 'currency',
                label: 'purchaseOrderList.currency',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'weighted',
                name: 'weighted',
                label: 'purchaseOrderList.weighted',
            },
            /*{
                cellStyle: { width: '200px' },
                sort: 'unitPrice',
                name: 'unitPrice',
                label: 'purchaseOrderList.unitPrice',
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'left',
                name: 'supplierNo',
                label: 'purchaseOrderList.supplierNo',
                render: (_, index) => {
                    return (this.table.state.pagination.page - 1) * this.table.state.pagination.pageSize + index + 1;
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'supplierName',
                name: 'supplierName',
                label: 'purchaseOrderList.supplierName',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'paymentTerm',
                name: 'paymentTerm',
                label: 'purchaseOrderList.paymentTerm',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'deliveryTerm',
                name: 'deliveryTerm',
                label: 'purchaseOrderList.deliveryTerm',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'initialTransporterNo',
                name: 'initialTransporterNo',
                label: 'purchaseOrderList.initialTransporterNo',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'switchTransporterNo',
                name: 'switchTransporterNo',
                label: 'purchaseOrderList.switchTransporterNo',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'serviceFee',
                name: 'serviceFee',
                label: 'purchaseOrderList.serviceFee',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'moneyTransferFee',
                name: 'moneyTransferFee',
                label: 'purchaseOrderList.serviceFee',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'buyerClub',
                name: 'buyerClub',
                label: 'purchaseOrderList.buyerClub',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'voucherDiscount',
                name: 'voucherDiscount',
                label: 'purchaseOrderList.voucherDiscount',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'voucherAmount',
                name: 'voucherAmount',
                label: 'purchaseOrderList.voucherAmount',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'minOrderAmt',
                name: 'minOrderAmt',
                label: 'purchaseOrderList.minOrderAmt',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'maxDiscountAmt',
                name: 'maxDiscountAmt',
                label: 'purchaseOrderList.maxDiscountAmt',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'discount',
                name: 'discount',
                label: 'purchaseOrderList.discount',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'cashback',
                name: 'cashback',
                label: 'purchaseOrderList.cashback',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'amount',
                name: 'amount',
                label: 'purchaseOrderList.amount',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'cashBackRefund',
                name: 'cashBackRefund',
                label: 'purchaseOrderList.cashBackRefund',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'cashBackRefundDate',
                name: 'cashBackRefundDate',
                label: 'purchaseOrderList.cashBackRefundDate',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'updatedBy',
                name: 'updatedBy',
                label: 'purchaseOrderList.updatedBy',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'referral',
                name: 'referral',
                label: 'purchaseOrderList.referral',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'referralAmount',
                name: 'referralAmount',
                label: 'purchaseOrderList.ReferralAmount',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'referralReferralNo',
                name: 'referralReferralNo',
                label: 'purchaseOrderList.ReferralReferralNo',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'referralReferralName',
                name: 'referralReferralName',
                label: 'purchaseOrderList.referralReferralName',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'refundRefundRequest',
                name: 'refundRefundRequest',
                label: 'purchaseOrderList.refundRefundRequest',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'refundSupplierConfirmation',
                name: 'refundSupplierConfirmation',
                label: 'purchaseOrderList.refundSupplierConfirmation',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'refundRefundedAmount',
                name: 'refundRefundedAmount',
                label: 'purchaseOrderList.refundRefundedAmount',
            },

            {
                cellStyle: { width: '200px' },
                sort: 'refundRefundedDate',
                name: 'refundRefundedDate',
                label: 'purchaseOrderList.refundRefundedDate',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'refundUpdatedBy',
                name: 'refundUpdatedBy',
                label: 'purchaseOrderList.refundUpdatedBy',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'rating',
                name: 'rating',
                label: 'purchaseOrderList.rating',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'poCreatedDate',
                name: 'poCreatedDate',
                label: 'purchaseOrderList.poCreatedDate',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'securedDelDate',
                name: 'securedDelDate',
                label: 'purchaseOrderList.securedDelDate',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'deliveryDate',
                name: 'deliveryDate',
                label: 'purchaseOrderList.deliveryDate',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'invoice',
                name: 'invoice',
                label: 'purchaseOrderList.invoice',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'status',
                name: 'status',
                label: 'purchaseOrderList.status',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'deliveryCost',
                name: 'deliveryCost',
                label: 'purchaseOrderList.deliveryCost',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'paymentSettlementPaymentAmount',
                name: 'paymentSettlementpaymentAmount',
                label: 'purchaseOrderList.paymentSettlementpaymentAmount',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'paymentSettlementdocNo',
                name: 'paymentSettlementdocNo',
                label: 'purchaseOrderList.paymentSettlementdocNo',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'paymentSettlementActualPMTDate',
                name: 'paymentSettlementActualPMTDate',
                label: 'purchaseOrderList.paymentSettlementActualPMTDate',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'paymentSettlementUpdateBy',
                name: 'paymentSettlementUpdateBy',
                label: 'purchaseOrderList.paymentSettlementUpdateBy',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'deliveryCost',
                name: 'deliveryCost',
                label: 'purchaseOrderList.deliveryCost',
            },

            {
                cellStyle: { width: '200px' },
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'purchaseOrderList.status',
                render: (cell) => {
                    return `<div class="text-white text-center p-[10px] bg-${cell ? 'active' : 'inactive'}">
                    ${this.translateService.instant(cell ? 'purchaseOrderList.active' : 'purchaseOrderList.inactive')}
                    </div>`;
                },
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'action',
                label: 'purchaseOrderList.actions',
                ctas: [
                    {
                        icon: 'edit',
                        onClick: (row: I_Position) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            }, */
        ];
        this.table.config.refetch = this.getPositions;

        this.routeService.onChange(({ hash }) => {
            this.getPosition(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getPosition();
        this.getPositions();
    }

    getPosition = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.masterDataService.getPosition({
                    id,
                }),
        });
    };

    getPositions = async (variables?: I_QueryVariables) => {
        const positions = await this.masterDataService.getPositions(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = positions.data;
        this.table.state.pagination = positions.pagination;
        this.table.state.selection?.clear();
    };

    handleSort = (values) => {
        this.table.handleSort({
            ...values,
            ...(values.orderBy && {
                orderBy: values.orderBy.replace('subName', 'name'),
            }),
        });
    };

    handleUpdateStatus = async (status) => {
        const selectedPositions = this.table.state.selection.selected;

        const { positionUpdateStatus } = await this.masterDataService.updatePositionStatus({
            listStatus: selectedPositions.map((position) => ({
                positionId: position.id,
                status,
            })),
        });

        if (positionUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(positionUpdateStatus.error?.message);
        }
    };

    handleCreate = () => {
        this.routeService.goTo({ mode: E_Form_Mode.CREATE });
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash();
        this.detail = null;
    };
}
