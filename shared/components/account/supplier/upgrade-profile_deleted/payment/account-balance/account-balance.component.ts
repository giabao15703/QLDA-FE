import { FormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { FormService } from '#shared/services';
import { E_ContainerType, E_FieldAppearance, E_FieldType } from '#shared/types';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'app-supplier-payment-account-balance',
    templateUrl: './account-balance.component.html',
    styleUrls: ['./account-balance.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        RouterModule,
        MaterialModules,
        MatButtonModule,
        FormComponent,
    ],
})
export class SupplierPaymentAccountBalanceComponent {
    constructor(
        public form: FormService,
        public router: Router,
    ) {
        this.form.config = [
            {
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.DIV,
                children: [
                    {
                        name: 'accountBalanceContainer',
                        class: 'my-8 grid gap-2 grid-cols-1 lg:grid-cols-2',
                        fieldType: E_FieldType.CONTAINER,
                        containerType: E_ContainerType.FIELDSET,
                        label: 'paymentAccount.secondStep.paymentAccountBalance.titleForm',
                        children: [
                            {
                                label: 'paymentAccount.secondStep.form.codeSupplier',
                                placeholder: 'paymentAccount.secondStep.form.codeSupplier',
                                name: 'codeSupplier',
                            },
                            {
                                label: 'paymentAccount.secondStep.form.nameSupplier',
                                placeholder: 'paymentAccount.secondStep.form.nameSupplier',
                                name: 'nameSupplier',
                            },
                            {
                                label: 'paymentAccount.secondStep.form.taxCode',
                                placeholder: 'paymentAccount.secondStep.form.taxCode',
                                name: 'taxCode',
                            },
                            {
                                label: 'paymentAccount.secondStep.form.registeredAddress',
                                placeholder: 'paymentAccount.secondStep.form.registeredAddress',
                                name: 'registeredAddress',
                            },
                            {
                                name: 'accountBalance',
                                class: 'text-lg font-semibold',
                                fieldType: E_FieldType.CONTAINER,
                                containerType: E_ContainerType.DIV,
                                label: 'paymentAccount.secondStep.form.accountBalance',
                                children: [
                                    {
                                        fieldType: E_FieldType.RADIO,
                                        appearance: E_FieldAppearance.FILL,
                                        // label: 'paymentAccount.secondStep.form.paymentMethod',
                                        class: 'mt-2 flex justify-around',
                                        options: [
                                            {
                                                label: 'paymentAccount.secondStep.form.creditCardLocalATM',
                                                value: 'creditCard',
                                            },
                                            {
                                                label: 'paymentAccount.secondStep.form.bankTransfer',
                                                value: 'bankTransfer',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                label: 'paymentAccount.secondStep.form.accountHolder',
                                placeholder: 'paymentAccount.secondStep.form.accountHolder',
                                name: 'accountHolder',
                            },
                            {
                                label: 'paymentAccount.secondStep.form.amountToPay',
                                placeholder: 'paymentAccount.secondStep.form.amountToPay',
                                name: 'amountToPay',
                            },
                            {
                                label: 'paymentAccount.secondStep.form.desciption',
                                placeholder: 'paymentAccount.secondStep.form.desciption',
                                name: 'desciption',
                            },
                            {
                                label: 'paymentAccount.secondStep.form.processingFee',
                                placeholder: 'paymentAccount.secondStep.form.processingFee',
                                name: 'processingFee',
                            },
                            {
                                fieldType: E_FieldType.TEXTAREA,
                                label: 'paymentAccount.secondStep.form.noteLabel',
                                placeholder: 'paymentAccount.secondStep.form.noteLabel',
                                name: 'note',
                            },
                            {
                                label: 'paymentAccount.secondStep.form.refundedBalance',
                                placeholder: 'paymentAccount.secondStep.form.refundedBalance',
                                name: 'refundedBalance',
                            },
                        ],
                    },
                ],
            },
        ];
    }

    handleClose = () => {
        this.router.navigateByUrl('');
    };
}
