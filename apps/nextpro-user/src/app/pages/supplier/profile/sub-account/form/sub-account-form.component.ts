import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import {
    FormComponent,
    LoadingComponent,
    SupplierBasicInformationFormComponent,
    TableComponent,
} from '#shared/components';
import { REGEX_EMAIL, REGEX_NO_NUMBERS_SPECIAL, REGEX_NUMERIC_SPACE_PLUS_MINUS } from '#shared/constants';
import { MaterialModules } from '#shared/modules';
import {
    AccountService,
    FormService,
    LoadingService,
    LocalStorageService,
    MasterDataService,
    NotificationService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, E_InputType, I_Currency, I_Gender, I_Position } from '#shared/types';
import { getFile, translateData } from '#shared/utils';

const FORM_NAME = 'FORM_SUPPLIER_SUB_ACCOUNT';

@Component({
    standalone: true,
    selector: 'nextpro-user-supplier-profile-sub-account-form',
    templateUrl: './sub-account-form.component.html',
    styleUrl: './sub-account-form.component.scss',
    providers: [FormService],
    imports: [
        CommonModule,
        TranslateModule,
        LoadingComponent,
        MaterialModules,
        TableComponent,
        FormComponent,
        SupplierBasicInformationFormComponent,
    ],
})
export class UserSupplierProfileSubAccountFormComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService,
        private localStorageService: LocalStorageService,
        private masterDataService: MasterDataService,
        private accountService: AccountService,
        private el: ElementRef,
        private notificationService: NotificationService,
    ) {
        this.form.config = [
            {
                label: 'auth.register.become-buyer.form-buyer.fullName',
                name: 'fullName',
                maxLength: 255,
                validate: [
                    {
                        rule: Validators.required,
                        message: 'VALIDATE_DESCRIPTION.fullName.required',
                    },
                    {
                        rule: Validators.pattern(REGEX_NO_NUMBERS_SPECIAL),
                        message: 'VALIDATE_DESCRIPTION.fullName.pattern',
                    },
                ],
            },
            {
                label: 'auth.register.become-buyer.form-buyer.phone',
                name: 'phone',
                validate: [
                    {
                        rule: Validators.required,
                        message: 'VALIDATE_DESCRIPTION.phone.required',
                    },
                    {
                        rule: Validators.pattern(REGEX_NUMERIC_SPACE_PLUS_MINUS),
                        message: 'VALIDATE_DESCRIPTION.phone.pattern',
                    },
                ],
            },
            {
                label: 'auth.register.become-buyer.form-buyer.position',
                name: 'position',
                loadingName: 'getPositions',
                fieldType: E_FieldType.SELECT,
                getOptions: () => this.masterDataService.getPositions().then((res) => res.data),
                mapOption: (item: I_Position) => ({
                    label: translateData(item, this.localStorageService.get('languageCode'), 'name'),
                    value: item.id,
                }),
                translateOptions: true,
                validate: [
                    {
                        rule: Validators.required,
                        message: 'VALIDATE_DESCRIPTION.position.required',
                    },
                ],
            },
            {
                label: 'auth.register.become-buyer.form-buyer.gender',
                name: 'gender',
                loadingName: 'getGenders',
                fieldType: E_FieldType.SELECT,
                getOptions: () => this.masterDataService.getGenders().then((res) => res.data),
                mapOption: (item: I_Gender) => {
                    return {
                        label: translateData(item, this.localStorageService.get('languageCode'), 'name'),
                        value: item.id,
                    };
                },
                translateOptions: true,
                validate: [
                    {
                        rule: Validators.required,
                        message: 'VALIDATE_DESCRIPTION.gender.required',
                    },
                ],
            },
            {
                label: 'auth.register.become-buyer.form-buyer.email',
                name: 'email',
                validate: [
                    {
                        rule: Validators.required,
                        message: 'VALIDATE_DESCRIPTION.email.required',
                    },
                    {
                        rule: Validators.pattern(REGEX_EMAIL),
                        message: 'VALIDATE_DESCRIPTION.email.pattern',
                    },
                ],
            },
            {
                label: 'auth.register.become-buyer.form-buyer.currency',
                name: 'currency',
                loadingName: 'getCurrencies',
                fieldType: E_FieldType.SELECT,
                getOptions: () => this.masterDataService.getCurrencies().then((res) => res.data),
                mapOption: (item: I_Currency) => ({
                    label: translateData(item, this.localStorageService.get('languageCode'), 'name'),
                    value: item.id,
                }),
                translateOptions: true,
                validate: [
                    {
                        rule: Validators.required,
                        message: 'VALIDATE_DESCRIPTION.currency.required',
                    },
                ],
            },
            {
                label: 'auth.register.become-buyer.form-buyer.password',
                name: 'password',
                inputType: E_InputType.PASSWORD,
                validate: [
                    {
                        rule: Validators.required,
                        message: 'VALIDATE_DESCRIPTION.password.required',
                    },
                ],
            },
            {
                label: 'auth.register.become-buyer.form-buyer.confirmPassword',
                name: 'confirmPassword',
                inputType: E_InputType.PASSWORD,
                validate: [
                    {
                        rule: Validators.required,
                        message: 'VALIDATE_DESCRIPTION.confirmPassword.required',
                    },
                ],
            },
            {
                label: 'auth.register.become-buyer.form-buyer.picture',
                name: 'picture',
                fieldType: E_FieldType.UPLOAD,
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data;
    @Input() onCloseDrawer;
    @Input() refetch;

    language: string;
    supplierSubAccount;

    ngOnInit() {
        this.masterDataService.getLanguages().then((languages) => (this.language = languages?.data?.[0]?.id));
    }

    ngOnChanges(changes) {
        if (changes?.mode?.currentValue === E_Form_Mode.CREATE) {
            this.form.reset();
        } else {
            if (
                changes?.data?.currentValue?.id &&
                changes?.data?.currentValue?.id !== changes?.data?.previousValue?.id
            ) {
                this.getSupplierSubAccount(changes?.data?.currentValue?.id);
            }
        }
    }

    getSupplierSubAccount = async (id: string) => {
        const supplierSubAccount = await this.accountService.getSupplierSubAccount({
            id,
        });
        this.form.patchValue({
            fullName: supplierSubAccount.fullName,
            phone: supplierSubAccount.phone,
            position: supplierSubAccount.position.id,
            gender: supplierSubAccount.gender.id,
            email: supplierSubAccount.email,
            picture: await getFile(supplierSubAccount.picture),
            password: null,
            confirmPassword: null,
            currency: supplierSubAccount.currency.id,
        });
    };

    handleSave = () => {
        this.form.submit(
            async ({ gender, phone, position, picture, currency, password, confirmPassword, email, fullName }) => {
                if (password !== confirmPassword) {
                    this.form.setFieldError('confirmPassword', 'VALIDATE_DESCRIPTION.password.notMatch');

                    return;
                }

                switch (this.mode) {
                    case E_Form_Mode.CREATE: {
                        const { supplierSubAccountsCreate } = await this.accountService.createSupplierSubAccount({
                            supplierSubAccount: {
                                gender,
                                phone,
                                language: this.language,
                                position,
                                picture,
                                currency,
                                user: {
                                    password,
                                    email,
                                    fullName,
                                },
                            },
                        });

                        if (supplierSubAccountsCreate.status) {
                            this.localStorageService.remove(FORM_NAME);
                            this.onCloseDrawer();
                            this.notificationService.success('notification.createSuccessfully');
                        } else {
                            this.notificationService.error(supplierSubAccountsCreate.error.message);
                        }
                        break;
                    }
                    case E_Form_Mode.UPDATE: {
                        const { supplierSubAccountsUpdate } = await this.accountService.updateSupplierSubAccount({
                            input: {
                                id: this.data.id,
                                fullName,
                                email,
                                picture,
                                password,
                                phone,
                                gender,
                                language: this.language,
                                position,
                                currency,
                            },
                        });

                        if (supplierSubAccountsUpdate.status) {
                            this.notificationService.success('notification.updateSuccessfully');
                        } else {
                            this.notificationService.error(supplierSubAccountsUpdate.error.message);
                        }
                        break;
                    }
                }

                this.refetch();
            },
            FORM_NAME,
        );
    };
}
