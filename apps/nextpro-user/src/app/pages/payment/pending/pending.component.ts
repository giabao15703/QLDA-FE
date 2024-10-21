import { FilterComponent, FormComponent, TableComponent } from '#shared/components';
import { SyncTabsWithAnchorDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';
import { FormService, TableService } from '#shared/services';
import { E_FieldType, I_Product } from '#shared/types';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';
const TABLE_HEADER_STYLE = { background: '#dbdbdb', borderRight: '1px solid #c0bcbc' };
@Component({
    standalone: true,
    selector: 'nextpro-user-pending-payment',
    templateUrl: './pending.component.html',
    styleUrl: './pending.component.scss',
    providers: [
        DatePipe,
        { provide: 'accountInformationForm', useClass: FormService },
        { provide: 'transactionStatementForm', useClass: FormService },
        { provide: 'reportForm', useClass: FormService },
        TableService,
    ],
    imports: [
        MaterialModules,
        MatStepperModule,
        CommonModule,
        TranslateModule,
        SyncTabsWithAnchorDirective,
        ReactiveFormsModule,
        FormsModule,
        FormComponent,
        TableComponent,
        FilterComponent,
    ],
})
export class PendingPaymentComponent {
    constructor(
        @Inject('reportForm') public reportForm: FormService,
        @Inject('transactionStatementForm') public transactionStatementForm: FormService,
        public table: TableService<I_Product>,
        private _formBuilder: FormBuilder,
    ) {
        this.table.config.filterForm = [
            {
                label: 'payment.pages.pending.orderNo',
                name: 'orderNo',
            },
            {
                label: 'payment.pages.my-account.type',
                options: [
                    { label: 'payment.pages.deposit.payment', value: 'product' },
                    { label: 'payment.pages.my-account.deposit', value: 'product' },
                    { label: 'payment.pages.my-account.topup', value: 'featured-product' },
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
        ];
        this.table.config.columns = [
            {
                name: 'date',
                label: 'payment.pages.my-account.date',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'orderNo',
                label: 'payment.pages.my-account.orderNo',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'type',
                label: 'payment.pages.my-account.type',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'description',
                label: 'payment.pages.my-account.transactionDescription',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'transferAmount',
                label: 'payment.pages.my-account.transferAmount',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'debitAmount',
                label: 'payment.pages.my-account.debitAmountFrom',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'accountBalance',
                label: 'payment.pages.my-account.accountBalance',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'status',
                label: 'payment.pages.my-account.status',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'paidBy',
                label: 'payment.pages.my-account.paidBy',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'invoiceReceipt',
                label: 'payment.pages.my-account.invoiceReceipt',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                name: 'draftInvoice',
                label: 'payment.pages.my-account.draftInvoice',
                headerStyle: TABLE_HEADER_STYLE,
            },
        ];
    }

    firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required],
    });
    secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
    });
}
