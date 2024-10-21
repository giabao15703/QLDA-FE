import { NavbarComponent } from '#user/layout';
import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import {
    FilterComponent,
    FormComponent,
    LoadingComponent,
    SupplierProductFormComponent,
    TableComponent,
} from '#shared/components';
import { ROUTES } from '#shared/constants';
import { SyncTabsWithAnchorDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';
import {
    FormService,
    LoadingService,
    NotificationService,
    PaymentDataService,
    ProductService,
    RouteService,
    TableService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_Product, I_QueryVariables, I_UserPayment } from '#shared/types';
import { getQueryVariables } from '#shared/utils';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

const TABLE_HEADER_STYLE = { background: '#dbdbdb', borderRight: '1px solid #c0bcbc', textAlign: 'center' };

@Component({
    standalone: true,
    selector: 'nextpro-user-my-payment-account',
    templateUrl: './my-account.component.html',
    styleUrl: './my-account.component.scss',
    providers: [
        DatePipe,
        { provide: 'accountInformationForm', useClass: FormService },
        { provide: 'transactionStatementForm', useClass: FormService },
        { provide: 'refundForm', useClass: FormService },
        TableService,
        FormService,
    ],
    imports: [
        MaterialModules,
        CommonModule,
        TranslateModule,
        SyncTabsWithAnchorDirective,
        ReactiveFormsModule,
        FormsModule,
        FormComponent,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        RouterModule,
        SupplierProductFormComponent,
        NavbarComponent,
    ],
})
export class MyPaymentAccountComponent {
    constructor(
        @Inject('accountInformationForm') public accountInformationForm: FormService<I_UserPayment>,
        @Inject('transactionStatementForm') public transactionStatementForm: FormService,
        @Inject('refundForm') public refundForm: FormService,
        public loadingService: LoadingService,
        public table: TableService<I_Product>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private productService: ProductService,
        private cdr: ChangeDetectorRef,
        private paymentDataService: PaymentDataService,
        private router: Router,
        public form: FormService,
    ) {
        this.accountInformationForm.config = [
            {
                name: 'accountInformationContainer',
                fieldType: E_FieldType.CONTAINER,
                children: [
                    {
                        label: 'payment.pages.my-account.code',
                        name: 'userName',
                    },
                    {
                        fieldType: E_FieldType.TEXT,
                        value: 'payment.pages.my-account.totalAmount',
                        class: 'mb-3 font-medium',
                    },
                    {
                        label: 'payment.pages.my-account.onePayAmount',
                        name: 'onePayAmount',
                    },
                    {
                        label: 'payment.pages.my-account.bankTransferAmount',
                        name: 'bankTransferAmount',
                    },
                ],
            },
        ];
        this.table.config.filterForm = [
            {
                label: 'payment.pages.my-account.orderNo',
                name: 'orderNo',
            },
            {
                label: 'payment.pages.my-account.type',
                options: [
                    { label: 'filter.productsType.product', value: 'product' },
                    { label: 'filter.productsType.featuredProduct', value: 'featured-product' },
                ],
                fieldType: E_FieldType.SELECT,
                name: 'type',
            },
            {
                label: 'payment.pages.my-account.transactionDescription',
                name: 'description',
            },
            {
                label: 'payment.pages.my-account.transferAmount',
                name: 'transferAmount',
            },
            {
                label: 'payment.pages.my-account.debitAmountFrom',
                name: 'debitAmountFrom',
            },
            {
                label: 'payment.pages.my-account.debitAmountTo',
                name: 'debitAmountTo',
            },
            {
                label: 'payment.pages.my-account.paidBy',
                options: [
                    { label: 'filter.productsType.product', value: 'product' },
                    { label: 'filter.productsType.featuredProduct', value: 'featured-product' },
                ],
                fieldType: E_FieldType.SELECT,
                name: 'paidBy',
            },
            {
                label: 'payment.pages.my-account.date',
                fieldType: E_FieldType.DATEPICKER,
                name: 'date',
            },
            {
                label: 'payment.pages.my-account.accountBalance',
                name: 'accountBalance',
            },
            {
                label: 'payment.pages.my-account.status',
                options: [
                    { label: 'filter.productsType.product', value: 'product' },
                    { label: 'filter.productsType.featuredProduct', value: 'featured-product' },
                ],
                fieldType: E_FieldType.SELECT,
                name: 'status',
            },
        ];
        this.transactionStatementForm.config = [
            {
                name: 'transactionStatementContainer',
                fieldType: E_FieldType.TABLE,
                table: {
                    class: '!h-auto mt-8',
                    columns: [
                        {
                            name: 'openingBalance',
                            label: 'payment.pages.my-account.openingBalance',
                            headerStyle: TABLE_HEADER_STYLE,
                        },
                        {
                            name: 's',
                            label: 'payment.pages.my-account.raisingBalance',
                            headerStyle: TABLE_HEADER_STYLE,
                        },
                        {
                            name: 'a',
                            label: 'payment.pages.my-account.closingBalance',
                            headerStyle: TABLE_HEADER_STYLE,
                        },
                        {
                            name: 'd',
                            label: 'payment.pages.my-account.totalPending',
                            headerStyle: TABLE_HEADER_STYLE,
                        },
                        {
                            name: 'g',
                            label: 'payment.pages.my-account.currentBalance',
                            headerStyle: TABLE_HEADER_STYLE,
                        },
                    ],
                },
            },
        ];
        this.table.config.columns = [
            {
                sticky: 'left',
                type: E_TableColumnType.SELECTION,
                name: 'selection',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'date',
                label: 'payment.pages.my-account.date',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'picture',
                label: 'payment.pages.my-account.orderNo',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'productName',
                label: 'payment.pages.my-account.type',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'type',
                label: 'payment.pages.my-account.transactionDescription',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                sort: 'description',
                name: 'description',
                label: 'payment.pages.my-account.transferAmount',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'skuNumber',
                label: 'payment.pages.my-account.debitAmountFrom',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'minimumOrderQuantity',
                label: 'payment.pages.my-account.accountBalance',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'status',
                label: 'payment.pages.my-account.paidBy',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                sort: 'reachNumber',
                name: 'reachNumber',
                label: 'payment.pages.my-account.status',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                sort: 'clickNumber',
                name: 'clickNumber',
                label: 'requirement.dateInvoice',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                sort: 'clickNumber',
                name: 'invoidReceipt',
                label: 'requirement.invoidReceipt',
                headerStyle: TABLE_HEADER_STYLE,
            },
        ];
        this.refundForm.config = [
            {
                fieldType: E_FieldType.TEXT,
                value: 'payment.components.popups.refundMethod',
                class: 'my-3 font-semibold uppercase',
            },
            {
                label: 'payment.components.popups.selectMethod',
                name: '5',
                class: 'w-[640px]',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'payment.components.popups.bankTransfer',
                        value: 1,
                    },
                    {
                        label: 'payment.components.popups.onePay',
                        value: 2,
                    },
                ],
            },
            {
                fieldType: E_FieldType.TEXT,
                value: 'payment.pages.my-account.accountInformation',
                class: 'my-3 font-semibold uppercase',
            },
            {
                name: 'accountInformationContainer',
                fieldType: E_FieldType.CONTAINER,
                class: 'grid lg:grid-cols-2 grid-cols-1 lg:gap-x-8 mt-4',
                children: [
                    {
                        label: 'paymentAccount.firstStep.form.codeSupplier',
                        name: 'userName',
                    },

                    {
                        label: 'paymentAccount.firstStep.form.nameSupplier',
                        name: 'nameSupplier',
                    },

                    {
                        label: 'paymentAccount.firstStep.form.taxCode',
                        name: 'taxCode',
                    },
                    {
                        label: 'paymentAccount.firstStep.form.registeredAddress',
                        name: '5',
                    },
                    {
                        label: 'payment.components.popups.balance',
                        name: '1',
                    },
                    {
                        label: 'payment.components.popups.bankName',
                        name: '2',
                        fieldType: E_FieldType.SELECT,
                    },
                    {
                        label: 'payment.components.popups.bankNumber',
                        name: '3',
                    },
                    {
                        label: 'payment.components.popups.refundedBalance',
                        name: '4',
                    },
                ],
            },
        ];
    }

    @Input() supplierId: string;
    detail = null;
    showRefundForm = false;

    ngOnInit() {
        this.getUserPayments();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.supplierId && changes.supplierId.currentValue) {
            this.getUserPayments();
        }
    }

    getUserPayments = async (variables?: I_QueryVariables) => {
        if (!this.supplierId) {
            return;
        }

        const userPayments = await this.paymentDataService.getUserPayments(
            {
                id: this.supplierId,
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.accountInformationForm.state.data = userPayments.data;
        this.accountInformationForm.state.pagination = userPayments.pagination;
        this.accountInformationForm.state.selection?.clear();
    };

    setFormData = async (values) => {
        this.accountInformationForm.patchValue({
            userName: values.userName,
            onePayAmount: values.onePayAmount,
            bankTransferAmount: values.bankTransferAmount,
        });
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

    onSubmit = () => {
        this.router.navigateByUrl(ROUTES.USER.TOPUP.ROOT);
    };

    openRefundRequest() {
        this.showRefundForm = true;
    }

    closeRefundForm() {
        this.showRefundForm = false;
    }

    handleRefundSubmit() {
        this.showRefundForm = false;
    }
}
