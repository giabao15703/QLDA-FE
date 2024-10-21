import { FilterComponent, FormComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { FormService, TableService } from '#shared/services';
import { E_FieldType, I_TopUp } from '#shared/types';
import { NavbarComponent } from '#user/layout';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';
import { SupplierPaymentAccountBalanceComponent } from 'shared/components/account/supplier/upgrade-profile/payment/account-balance/account-balance.component';
import { SupplierPaymentBankTransferComponent } from 'shared/components/account/supplier/upgrade-profile/payment/bank-transfer/bank-transfer.component';

const TABLE_HEADER_STYLE = { background: '#dbdbdb', borderRight: '1px solid #c0bcbc' };
@Component({
    standalone: true,
    selector: 'nextpro-user-top-up',
    templateUrl: './top-up.component.html',
    styleUrls: ['./top-up.component.scss'],
    providers: [{ provide: 'invoiceInfoSupplierForm', useClass: FormService }, TableService, FormService],
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
        SupplierPaymentAccountBalanceComponent,
        SupplierPaymentBankTransferComponent,
    ],
})
export class TopUpComponent {
    constructor(
        @Inject('invoiceInfoSupplierForm') public invoiceInfoSupplierForm: FormService,
        public table: TableService<I_TopUp>,
        private _formBuilder: FormBuilder,
    ) {
        this.invoiceInfoSupplierForm.config = [
            {
                name: 'invoiceInfoSupplierContainer',
                fieldType: E_FieldType.CONTAINER,
                class: 'grid lg:grid-cols-2 grid-cols-1 gap-x-8 mt-4',
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
                        name: 'registeredAddress',
                    },
                ],
            },
        ];
        this.table.config.columns = [
            {
                cellStyle: { width: '50px' },
                name: 'no',
                label: 'NO.',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                cellStyle: { width: '100px' },
                name: 'orderNo',
                label: 'ORDER NO.',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                cellStyle: { width: '200px' },
                name: 'description',
                label: 'DESCRIPTION',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                cellStyle: { width: '150px' },
                name: 'roundedTopUpAmount',
                label: 'ROUNDED TOP-UP AMOUNT (VND)',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                cellStyle: { width: '150px' },
                name: 'notes',
                label: 'NOTES',
                headerStyle: TABLE_HEADER_STYLE,
            },
            {
                cellStyle: { width: '150px' },
                name: 'totalAmount',
                label: 'Total Amount',
                headerStyle: TABLE_HEADER_STYLE,
            },
        ];
    }
    isTermAccept = false;
    selectedPaymentMethod: string;

    firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required],
    });
    secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
    });

    onTermAcceptChange = (event) => {
        this.isTermAccept = event.checked;
    };
    selectPaymentMethod(method: string): void {
        this.selectedPaymentMethod = method;
    }
}
