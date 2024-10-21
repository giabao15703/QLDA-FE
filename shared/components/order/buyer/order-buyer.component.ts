import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';
import { FormService, LocalStorageService, OrderService, TableService } from '#shared/services';
import { E_FieldType, I_Order, I_Profile, I_QueryVariables } from '#shared/types';
import { GlobalSearchComponent } from '#user/components/common';
import { NavbarComponent } from '#user/layout';

import { getQueryVariables } from 'shared/utils';
import { FilterComponent } from '../../filter/filter.component';
import { FormComponent } from '../../form/form.component';
import { TableComponent } from '../../table/table.component';
@Component({
    standalone: true,
    selector: 'nextpro-user-order-buyer',
    templateUrl: './order-buyer.component.html',
    styleUrls: ['./order-buyer.component.scss'],
    providers: [TableService, { provide: 'orderForm', useClass: FormService }],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModules,
        MatStepperModule,
        FormComponent,
        TableComponent,
        NavbarComponent,
        FilterComponent,
        GlobalSearchComponent,
    ],
})
export class OrderBuyerComponent {
    constructor(
        @Inject('orderForm') public orderForm: FormService<I_Order>,
        public table: TableService<I_Order>,
        private orderService: OrderService,
        private localStorageService: LocalStorageService,
    ) {
        this.table.config.columns = [
            {
                cellStyle: { width: '30px' },
                name: 'no',
                label: 'order.purchase-order.no',
                render: (_, index) => {
                    return (this.table.state.pagination.page - 1) * this.table.state.pagination.pageSize + index + 1;
                },
            },
            {
                cellStyle: { width: '109px' },
                name: 'id',
                label: 'order.purchase-order.order-no',
            },
            {
                cellStyle: { width: '140px' },
                name: 'contractPerson',
                label: 'order.purchase-order.buyer-name',
            },
            {
                cellStyle: { width: '120px' },
                name: 'supplierName',
                label: 'order.purchase-order.supplier-name',
            },
            {
                cellStyle: { width: '120px' },
                name: 'valuePerOrder',
                label: 'order.purchase-order.value-per-order',
            },
            {
                cellStyle: { width: '120px' },
                name: 'currency',
                label: 'order.purchase-order.currency',
            },
            {
                cellStyle: { width: '120px' },
                name: 'payment',
                label: 'order.purchase-order.payment',
            },
            {
                cellStyle: { width: '120px' },
                name: 'delivery',
                label: 'order.purchase-order.delivery',
            },
            {
                cellStyle: { width: '120px' },
                name: 'buyerClub',
                label: 'order.purchase-order.buyer-club',
                render: (_, __, row) => {
                    return row.orderItems[0].product?.[0]?.buyerClub;
                },
            },
            {
                cellStyle: { width: '120px' },
                name: 'discountPercent',
                label: 'order.purchase-order.discount-percent',
            },
            {
                cellStyle: { width: '120px' },
                name: 'discount',
                label: 'order.purchase-order.discount',
            },
            {
                cellStyle: { width: '120px' },
                name: 'refund',
                label: 'order.purchase-order.refund-percent',
            },
            {
                cellStyle: { width: '120px' },
                name: 'refundRequest',
                label: 'order.purchase-order.refund-request',
            },
            {
                cellStyle: { width: '100px' },
                name: 'supplierConfirmation',
                label: 'order.purchase-order.supplier-confirmation',
            },
            {
                cellStyle: { width: '120px' },
                name: 'evaluation',
                label: 'order.purchase-order.evaluation',
            },
            {
                cellStyle: { width: '120px' },
                name: 'orderDate',
                label: 'order.purchase-order.order-date',
            },
            {
                cellStyle: { width: '120px' },
                name: 'guaranteedDeliveryDate',
                label: 'order.purchase-order.order-guarantee-date',
            },
            {
                cellStyle: { width: '100px' },
                name: 'orderDeliveryDate',
                label: 'order.purchase-order.order-delivery-date',
            },
            {
                cellStyle: { width: '100px' },
                name: 'invoice',
                label: 'order.purchase-order.invoice',
            },
            {
                cellStyle: { width: '100px' },
                name: 'orderStatus',
                label: 'order.purchase-order.status',
            },
            {
                cellStyle: { width: '60px' },
                name: 'reset',
                label: 'order.purchase-order.reset',
            },
        ];
        this.orderForm.config = [
            {
                name: 'orderContainer',
                fieldType: E_FieldType.CONTAINER,
                class: 'grid lg:grid-cols-3 lg:gap-x-5 grid-col-1',
                children: [
                    {
                        label: 'order.purchase-order.order-code',
                        name: 'Order Code',
                    },
                    {
                        label: 'order.purchase-order.supplier-name',
                        name: 'supplierName',
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
                        label: 'order.purchase-order.evaluation',
                        name: 'evaluation',
                    },
                ],
            },
        ];
        this.user = this.localStorageService.get('user');
    }

    user: I_Profile = {};

    ngOnInit() {
        this.getOrders();
    }

    getOrders = async (variables?: I_QueryVariables) => {
        const orders = await this.orderService.getOrders(
            {
                buyerName: this.user.companyFullName,
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = orders.data;
        this.table.state.pagination = orders.pagination;
        this.table.state.selection?.clear();
    };
    onSubmit() {
        console.log('onSubmit');
    }
}
