import { FormComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { FormService, LocalStorageService } from '#shared/services';
import { E_ContainerType, E_FieldType } from '#shared/types';
import { DetailedFooterComponent, NavbarComponent } from '#user/layout';
import { CartComponent } from '#user/pages/product/cart/cart.component';
import { RecommendationComponent } from '#user/pages/product/recommendation/recommendation.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SupplierPaymentAccountBalanceComponent } from './account-balance/account-balance.component';
import { SupplierPaymentBankTransferComponent } from './bank-transfer/bank-transfer.component';
import { formatMoney } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'app-supplier-payment-account',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
    providers: [FormService],
    imports: [
        CommonModule,
        CartComponent,
        FormsModule,
        NavbarComponent,
        DetailedFooterComponent,
        RecommendationComponent,
        TranslateModule,
        RouterModule,
        MaterialModules,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatStepperModule,
        ReactiveFormsModule,
        FormComponent,
        TableComponent,
        SupplierPaymentAccountBalanceComponent,
        SupplierPaymentBankTransferComponent,
    ],
})
export class SupplierPaymentAccountPage {
    constructor(
        public form: FormService,
        public router: Router,
        private _formBuilder: FormBuilder,
        private translateService: TranslateService,
        private localStorageService: LocalStorageService,
    ) {
        this.updateStepTitle(0);
        this.form.config = [
            {
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.DIV,
                children: [
                    {
                        fieldType: E_FieldType.TABLE,
                        name: 'orderConfirmationTable',
                        table: {
                            class: '!h-auto my-8',
                            columns: [
                                {
                                    headerStyle: {
                                        background: '#dbdbdb',
                                        borderRight: '1px solid #c0bcbc',
                                        textAlign: 'center',
                                    },
                                    cellStyle: { width: '50px' },
                                    name: 'no',
                                    label: 'paymentAccount.firstStep.table.noNumber',
                                    render: (_, index) => {
                                        return index + 1;
                                    },
                                },
                                {
                                    headerStyle: {
                                        background: '#dbdbdb',
                                        borderRight: '1px solid #c0bcbc',
                                        textAlign: 'center',
                                    },
                                    name: 'description',
                                    label: 'paymentAccount.firstStep.table.description',
                                },
                                {
                                    headerStyle: {
                                        background: '#dbdbdb',
                                        borderRight: '1px solid #c0bcbc',
                                        textAlign: 'center',
                                    },
                                    name: 'fee',
                                    label: 'paymentAccount.firstStep.table.fee',
                                },
                                {
                                    headerStyle: {
                                        background: '#dbdbdb',
                                        borderRight: '1px solid #c0bcbc',
                                        textAlign: 'center',
                                    },
                                    name: 'promotion',
                                    label: 'paymentAccount.firstStep.table.promotion',
                                },
                                {
                                    headerStyle: {
                                        background: '#dbdbdb',
                                        borderRight: '1px solid #c0bcbc',
                                        textAlign: 'center',
                                    },
                                    name: 'vat',
                                    label: 'paymentAccount.firstStep.table.vat',
                                },
                                {
                                    headerStyle: {
                                        background: '#dbdbdb',
                                        borderRight: '1px solid #c0bcbc',
                                        textAlign: 'center',
                                    },
                                    name: 'total',
                                    label: 'paymentAccount.firstStep.table.total',
                                },
                                {
                                    headerStyle: {
                                        background: '#dbdbdb',
                                        borderRight: '1px solid #c0bcbc',
                                        textAlign: 'center',
                                    },
                                    name: 'notes',
                                    label: 'paymentAccount.firstStep.table.notes',
                                },
                            ],
                        },
                    },
                    {
                        name: 'invoiceInfoContainer',
                        class: 'my-8 grid gap-2 grid-cols-1 lg:grid-cols-2',
                        fieldType: E_FieldType.CONTAINER,
                        containerType: E_ContainerType.FIELDSET,
                        label: 'paymentAccount.firstStep.form.title',
                        children: [
                            {
                                label: 'paymentAccount.firstStep.form.codeSupplier',
                                placeholder: 'paymentAccount.firstStep.form.codeSupplier',
                                name: 'codeSupplier',
                                disabled: true,
                            },
                            {
                                label: 'paymentAccount.firstStep.form.nameSupplier',
                                placeholder: 'paymentAccount.firstStep.form.nameSupplier',
                                name: 'nameSupplier',
                                disabled: true,
                            },
                            {
                                label: 'paymentAccount.firstStep.form.taxCode',
                                placeholder: 'paymentAccount.firstStep.form.taxCode',
                                name: 'taxCode',
                                disabled: true,
                            },
                            {
                                label: 'paymentAccount.firstStep.form.registeredAddress',
                                placeholder: 'paymentAccount.firstStep.form.registeredAddress',
                                name: 'registeredAddress',
                                disabled: true,
                            },
                        ],
                    },
                ],
            },
        ];
    }

    firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required],
    });
    secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
    });

    stepTitle: string;
    isTermAccept = false;
    selectedPaymentMethod: string;

    ngOnInit(): void {
        this.loadAccountPaymentInfo();
        this.updateStepTitle(0);
    }

    loadAccountPaymentInfo(): void {
        const acc = this.localStorageService.get('AccountPaymentInfo');
        if (acc) {
            this.form.patchValue({
                codeSupplier: acc.accountCode,
                nameSupplier: acc.accountName,
                taxCode: acc.taxCode,
                registeredAddress: acc.registeredAddress,
                orderConfirmationTable: [
                    {
                        description: acc.description,
                        fee: formatMoney(acc.paymentFee),
                        promotion: formatMoney(acc.promotionPaymentFee),
                        vat: acc.vat + '%',
                        total: formatMoney(acc.grandTotal),
                        notes: acc.notes,
                    },
                ],
            });
        } else {
            console.log('No Account Payment Info found in localStorage');
        }
    }

    ngOnDestroy(): void {
        localStorage.removeItem('AccountPaymentInfo');
        console.log('AccountPaymentInfo removed from localStorage.');
    }

    onStepChange(event: StepperSelectionEvent): void {
        this.updateStepTitle(event.selectedIndex);
    }

    updateStepTitle(index: number): void {
        const titles = [
            'paymentAccount.firstStep.paymentInformation',
            'paymentAccount.secondStep.paymentMethod',
            'paymentAccount.firstStep.payment',
        ];
        this.translateService.get(titles[index]).subscribe((res: string) => {
            this.stepTitle = res;
        });
    }

    onIsTermAcceptChange = (event) => {
        this.isTermAccept = event.checked;
    };

    handleClose = () => {
        this.router.navigateByUrl('');
    };

    selectPaymentMethod(method: string): void {
        this.selectedPaymentMethod = method;
    }
    grandTotal(paymentFee: number, promotionPaymentFee: number, VAT: number): number {
        const discountPrice = paymentFee - promotionPaymentFee;
        const vat = (discountPrice * VAT) / 100;
        return discountPrice + vat;
    }
}
