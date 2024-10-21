import { MatAutocompleteOptionsScrollDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';
import { LoadingService, LocalStorageService, MasterDataService, OrderService, TableService } from '#shared/services';
import { E_FieldType, I_Order, I_QueryVariables, I_SelectOption } from '#shared/types';
import { translateData } from '#shared/utils';
import { NavbarComponent } from '#user/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { debounce } from 'lodash';

import { getQueryVariables } from 'shared/utils';
import { FilterComponent } from '../../filter/filter.component';
import { FormComponent } from '../../form/form.component';
import { TableComponent } from '../../table/table.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-order-supplier',
    templateUrl: './order-supplier.component.html',
    styleUrls: ['./order-supplier.component.scss'],
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModules,
        MatStepperModule,
        FormComponent,
        FilterComponent,
        TableComponent,
        NavbarComponent,
        FilterComponent,
        MatAutocompleteOptionsScrollDirective,
    ],
})
export class OrderSupplierComponent {
    constructor(
        public table: TableService<I_Order>,
        private masterDataService: MasterDataService,
        private loadingService: LoadingService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private oderService: OrderService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'order.purchase-order.order-code',
                name: 'orderCode',
            },
            {
                label: 'order.purchase-order.buyer-code',
                name: 'buyerCode',
            },
            {
                label: 'order.purchase-order.buyer-name',
                name: 'buyerName',
            },
            {
                label: 'order.purchase-order.payment',
                name: 'payment',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'Payment', value: 'payment' },
                    { label: 'Payment', value: 'payment' },
                ],
            },
            {
                label: 'order.purchase-order.delivery',
                name: 'delivery',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'Delivery', value: 'delivery' },
                    { label: 'Delivery', value: 'delivery' },
                ],
            },
            {
                label: 'order.purchase-order.order-date',
                fieldType: E_FieldType.DATEPICKER,
                name: 'orderDate',
            },
            {
                label: 'order.purchase-order.delivery-date',
                fieldType: E_FieldType.DATEPICKER,
                name: 'deliveryDate',
            },
            {
                label: 'order.purchase-order.order-payment-date',
                fieldType: E_FieldType.DATEPICKER,
                name: 'orderPaymentDate',
            },
            {
                label: 'order.purchase-order.refund-request',
                name: 'refundRequest',
                fieldType: E_FieldType.RADIO,
                prefix: {
                    text: 'payment.pages.my-account.refundRequest',
                    class: 'font-light mr-5',
                },
                options: [
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                ],
            },
        ];
        this.table.config.columns = [
            {
                name: 'no',
                label: 'order.purchase-order.no',
            },
            {
                name: 'orderNo',
                label: 'order.purchase-order.order-no',
            },
            {
                name: 'line',
                label: 'order.purchase-order.line',
            },
            {
                name: 'buyerCompany',
                label: 'order.purchase-order.buyer-company',
            },
            {
                name: 'contactPerson',
                label: 'order.purchase-order.buyer-name',
                render: (_, __, row) => {
                    return row.orderItems[0].product?.[0]?.contactPerson;
                },
            },
            {
                name: 'productName',
                label: 'order.purchase-order.product-name',
                render: (_, __, row) => {
                    return row.orderItems[0].product?.[0]?.productName;
                },
            },
            /* {
                name: 'quantity',
                label: 'order.purchase-order.quantity',
                render: (_, __, row) => {
                    return row.productServiceInfo?.[0]?.quantity;
                },
            }, */
            {
                name: 'unitPrice',
                label: 'order.purchase-order.unit-price',
            },
            {
                name: 'orderAmount',
                label: 'order.purchase-order.order-amount',
            },
            {
                name: 'currency',
                label: 'order.purchase-order.currency',
            },
            {
                name: 'weight',
                label: 'order.purchase-order.weight',
            },
            {
                name: 'payment',
                label: 'order.purchase-order.payment',
            },
            {
                name: 'delivery',
                label: 'order.purchase-order.delivery',
            },
            {
                name: 'address',
                label: 'order.purchase-order.address',
            },
            {
                name: 'city',
                label: 'order.purchase-order.city',
            },
            {
                name: 'country',
                label: 'order.purchase-order.country',
            },
            {
                name: 'transporter',
                label: 'order.purchase-order.transporter',
            },
            {
                name: 'serviceFee',
                label: 'order.purchase-order.service-fee',
            },
            {
                name: 'moneyTransferFee',
                label: 'order.purchase-order.money-transfer-fee',
            },
            {
                name: 'buyerClub',
                label: 'order.purchase-order.buyer-club',
                render: (_, __, row) => {
                    return row.orderItems[0].product[0].buyerClub;
                },
            },
            {
                name: 'discountPercent',
                label: 'order.purchase-order.discount-percent',
            },
            {
                name: 'discountAmount',
                label: 'order.purchase-order.discount-amount',
            },
            {
                name: 'minOrderValue',
                label: 'order.purchase-order.min-order-value',
            },
            {
                name: 'maxAmountDiscount',
                label: 'order.purchase-order.max-amount-discount',
            },
            /* {
                name: 'discount',
                label: 'order.purchase-order.discount',
                render: (_, __, row) => {
                    return row.discount;
                },
            }, */
            {
                name: 'discountAmountMoney',
                label: 'order.purchase-order.discount-amount-money',
            },
            {
                name: 'requestRefund',
                label: 'order.purchase-order.request-refund',
                render: (_, __, row) => {
                    return row.orderItems[0].refund;
                },
            },
            {
                name: 'supplierConfirmation',
                label: 'order.purchase-order.supplier-confirmation',
            },
            {
                name: 'rating',
                label: 'order.purchase-order.rating',
            },
            {
                name: 'poCreatedDate',
                label: 'order.purchase-order.po-created-date',
            },
            {
                name: 'securedDeliveryDate',
                label: 'order.purchase-order.secured-delivery-date',
            },
            {
                name: 'actualDeliveryDate',
                label: 'order.purchase-order.actual-delivery-date',
            },
            {
                name: 'invoice',
                label: 'order.purchase-order.invoice',
            },
            {
                name: 'orderStatus',
                label: 'order.purchase-order.status',
            },
            {
                name: 'shippingFee',
                label: 'order.purchase-order.shipping-fee',
            },
            {
                name: 'paymentAmount',
                label: 'order.purchase-order.payment-amount',
            },
            {
                name: 'paymentDocumentNumber',
                label: 'order.purchase-order.payment-document-number',
            },
        ];
        this.localStorageService.onChange('languageCode', async (_, newValue) => {
            if (newValue) {
                this.resetSearch();
            }
        });
    }

    searchControl = new FormControl('', [Validators.required, this.validObject]);
    options: I_SelectOption[] = [];
    searchCount = 0;

    validObject(controller: AbstractControl) {
        if (!(controller.value instanceof Object)) {
            return { '!Object': true };
        }
        return null;
    }

    ngOnInit() {
        this.getOrders();
    }

    getOrders = async (variables?: I_QueryVariables) => {
        const orders = await this.oderService.getOrders(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = orders.data;
        this.table.state.pagination = orders.pagination;
        this.table.state.selection?.clear();
    };

    appendOptions = async (data) => {
        const currentLanguage = this.localStorageService.get('languageCode');

        this.options = [
            ...this.options,
            ...data.map((option) => ({
                value: option.id,
                label: translateData(option, currentLanguage, 'name'),
                hrefType: option.hrefType,
            })),
        ];
    };

    resetSearch = () => {
        this.searchControl.reset();
        this.searchCount = 0;
        this.options = [];
    };

    search = async (searchCount?: number) => {
        if (!searchCount) {
            this.searchCount = 0;
            this.options = [];
        }

        const currentLanguage = this.localStorageService.get('languageCode');

        const searchParams = {
            nameEn: currentLanguage === 'en' ? this.searchControl.value : '',
            nameVi: currentLanguage === 'vi' ? this.searchControl.value : '',
            first: 5,
            orderBy: 'id',
            ...(searchCount && { after: (searchCount - 1).toString() }),
        };
        const [familyCodes, clusterCodes, subClusterCode, categories] = await Promise.all([
            this.masterDataService.getFamilyCodes(searchParams).then((res) => res.data),
            this.masterDataService.getClusterCodes(searchParams).then((res) => res.data),
            this.masterDataService.getSubClusterCodes(searchParams).then((res) => res.data),
            this.masterDataService.getCategories(searchParams).then((res) => res.data),
        ]);

        const newOptions = [
            ...familyCodes.map((item) => ({ ...item, hrefType: 'family-code' })),
            ...clusterCodes.map((item) => ({ ...item, hrefType: 'cluster-code' })),
            ...subClusterCode.map((item) => ({ ...item, hrefType: 'sub-cluster-code' })),
            ...categories.map((item) => ({ ...item, hrefType: 'category' })),
        ];

        this.appendOptions(newOptions);

        this.searchCount += 5;
    };

    onSearch = debounce(() => {
        this.search();
    }, 500);

    onOptionsScroll() {
        this.search(this.searchCount);
    }

    onSelectOption(option: I_SelectOption) {
        this.router.navigateByUrl(`/suppliers?${option['hrefType']}=${option.value}`);
    }
    onInputClick() {
        this.search();
    }

    onSubmit() {
        console.log('onSubmit');
    }
}
