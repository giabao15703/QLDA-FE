import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';

import {
    REGEX_ALPHANUMERIC,
    REGEX_EMAIL,
    REGEX_NO_NUMBERS_SPECIAL,
    REGEX_NUMERIC_SPACE_PLUS_MINUS,
} from '#shared/constants';
import { MaterialModules } from '#shared/modules';
import {
    AccountService,
    FormService,
    LoadingService,
    LocalStorageService,
    MasterDataService,
    NotificationService,
    PromotionService,
} from '#shared/services';
import {
    E_ContainerType,
    E_FieldType,
    E_Form_Mode,
    E_InputType,
    E_LoadingType,
    I_City,
    I_Country,
    I_Currency,
    I_Gender,
    I_Industry,
    I_NumberOfEmployee,
    I_Supplier,
    I_SupplierLists,
    T_Any,
} from '#shared/types';
import { translateData } from '#shared/utils';
import { environment } from '#user/environment';
import { FormComponent } from '../../../form/form.component';
import { LoadingComponent } from '../../../loading/loading.component';
import { TableComponent } from '../../../table/table.component';

const FORM_NAME = 'ACCOUNT_SUPPLIER_BASIC_INFORMATION_FORM';

@Component({
    standalone: true,
    selector: 'app-account-supplier-basic-information-form',
    templateUrl: './basic-information-form.component.html',
    styleUrl: './basic-information-form.component.scss',
    encapsulation: ViewEncapsulation.None,
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, TableComponent, FormComponent],
})
export class SupplierBasicInformationFormComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService,
        private localStorageService: LocalStorageService,
        private promotionService: PromotionService,
        private masterDataService: MasterDataService,
        private accountService: AccountService,
        private httpClient: HttpClient,
        private notificationService: NotificationService,
        private translateService: TranslateService,
    ) {
        this.translateService.use(JSON.parse(localStorage.getItem('languageCode') || 'en') === 'vi' ? 'vi' : 'en');
        this.form.config = [
            {
                name: 'companyInfoContainer',
                class: 'grid gap-2 grid-cols-1 lg:grid-cols-3',
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.FIELDSET,
                label: 'auth.register.become-buyer.form-buyer.companyInformation',
                children: [
                    {
                        label: 'auth.register.become-buyer.form-buyer.fullName',
                        name: 'companyFullName',
                        loadingName: 'getSupplierLists',
                        inputType: E_InputType.AUTOCOMPLETE,
                        maxLength: 255,
                        getOptions: (text: string) =>
                            this.accountService
                                .getSupplierLists({ first: 100, name_Icontains: text })
                                .then((res) => res.data),
                        mapOption: (item: I_SupplierLists) => ({
                            label: item.name,
                            value: item.id,
                        }),
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.companyFullName.required',
                            },
                        ],
                    },
                    {
                        label: 'auth.register.become-buyer.form-buyer.address',
                        name: 'companyAddress',
                        maxLength: 255,
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.companyAddress.required',
                            },
                            {
                                rule: Validators.pattern(REGEX_NO_NUMBERS_SPECIAL),
                                message: 'VALIDATE_DESCRIPTION.companyAddress.pattern',
                            },
                        ],
                    },
                    {
                        label: 'auth.register.become-buyer.form-buyer.noEmployee',
                        name: 'companyNumberOfEmployee',
                        loadingName: 'getNumberOfEmployees',
                        fieldType: E_FieldType.SELECT,
                        getOptions: () => this.masterDataService.getNumberOfEmployees().then((res) => res.data),
                        mapOption: (item: I_NumberOfEmployee) => ({
                            label: item.name,
                            value: item.id,
                        }),
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.companyNumberOfEmployee.required',
                            },
                        ],
                    },

                    {
                        label: 'auth.register.become-buyer.form-buyer.taxCode',
                        name: 'companyTax',
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.companyTax.required',
                            },
                            {
                                rule: Validators.pattern(REGEX_ALPHANUMERIC),
                                message: 'VALIDATE_DESCRIPTION.companyTax.pattern',
                            },
                        ],
                    },
                    {
                        label: 'auth.register.become-buyer.form-buyer.country',
                        name: 'companyCountry',
                        loadingName: 'getCountries',
                        fieldType: E_FieldType.SELECT,
                        getOptions: () => this.masterDataService.getCountries().then((res) => res.data),
                        mapOption: (item: I_Country) => ({
                            label: item.name,
                            value: item.id,
                        }),
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.companyCountry.required',
                            },
                        ],
                    },
                    {
                        label: 'auth.register.become-buyer.form-buyer.city',
                        name: 'companyCountryState',
                        loadingName: 'getCities',
                        fieldType: E_FieldType.SELECT,
                        listenChangeFrom: 'companyCountry',
                        getOptions: (countryId) =>
                            this.masterDataService.getCities({ countryId }).then((res) => res.data),
                        mapOption: (item: I_City) => ({
                            label: item.name,
                            value: item.id,
                        }),
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.companyCity.required',
                            },
                            {
                                rule: Validators.pattern(REGEX_NO_NUMBERS_SPECIAL),
                                message: 'VALIDATE_DESCRIPTION.companyCity.pattern',
                            },
                        ],
                    },
                    {
                        label: 'auth.register.become-buyer.form-buyer.website',
                        name: 'companyWebsite',
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
                        label: 'auth.register.become-buyer.form-buyer.logo',
                        name: 'companyLogo',
                        fieldType: E_FieldType.UPLOAD,
                        uploadType: 'single',
                        showPreview: true,
                    },
                ],
            },
            {
                name: 'contactPersonContainer',
                class: 'grid gap-2 grid-cols-1 lg:grid-cols-3',
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.FIELDSET,
                label: 'auth.register.become-buyer.form-buyer.contactPerson',
                children: [
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
                        label: 'auth.register.become-buyer.form-buyer.gender',
                        name: 'gender',
                        loadingName: 'getGenders',
                        fieldType: E_FieldType.SELECT,
                        getOptions: () => this.masterDataService.getGenders().then((res) => res.data),
                        mapOption: (item: I_Gender) => ({
                            label: translateData(item, this.localStorageService.get('languageCode'), 'name'),
                            value: item.id,
                        }),
                        translateOptions: true,
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.gender.required',
                            },
                        ],
                    },
                    {
                        label: 'auth.register.become-buyer.form-buyer.position',
                        name: 'position',
                        loadingName: 'getPositions',
                        fieldType: E_FieldType.SELECT,
                        getOptions: () => this.masterDataService.getPositions().then((res) => res.data),
                        mapOption: (item: I_Gender) => ({
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
                        label: 'auth.register.become-buyer.form-buyer.phone',
                        placeholder: 'auth.register.become-buyer.form-buyer.phone',
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
                        label: 'auth.register.become-buyer.form-buyer.referralCode',
                        name: 'companyReferralCode',
                        maxLength: 100,
                        onBlur: async (event) => {
                            const result = await this.promotionService.checkValidReferral({
                                referralCode: event.target.value,
                            });

                            if (!result) {
                                this.form.setFieldError(
                                    'referralCode',
                                    'VALIDATE_DESCRIPTION.referralCode.doesNotExist',
                                );
                            }
                        },
                    },
                    {
                        label: 'auth.register.become-buyer.form-buyer.picture',
                        name: 'picture',
                        fieldType: E_FieldType.UPLOAD,
                        uploadType: 'single',
                        showPreview: true,
                    },
                ],
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_Supplier;
    @Input() onSave: (values, callback) => void;
    @Input() showTerms: boolean = false;
    @Input() showMainInfo: boolean = false;
    @Input() isLoading: boolean;

    supplierNumber: string;
    profile: string;
    registerDate = new Date();
    industries: I_Industry[] = [];
    language: string;
    isTermAccept = false;
    isRead = false;

    get buttonText(): string {
        const buttonTextMap = {
            [E_Form_Mode.CREATE]: 'button.create',
            [E_Form_Mode.UPDATE]: 'button.update',
        };

        return buttonTextMap[this.mode] || '';
    }

    ngOnInit() {
        this.masterDataService.getLanguages().then((languages) => (this.language = languages?.data?.[0]?.id));
    }

    ngOnChanges(changes) {
        this.updateProfileHeader(changes?.data?.currentValue);

        switch (changes?.mode?.currentValue) {
            case E_Form_Mode.CREATE: {
                this.form.reset();
                this.form.mutate({
                    enableAll: [
                        'companyFullName',
                        'companyAddress',
                        'companyLogo',
                        'companyCountry',
                        'companyCountryState',
                        'companyTax',
                        'companyNumberOfEmployee',
                        'currency',
                        'companyWebsite',
                        'fullName',
                        'gender',
                        'position',
                        'email',
                        'phone',
                        'picture',
                        'password',
                        'confirmPassword',
                        'companyReferralCode',
                    ],
                });
                this.supplierNumber = null;
                this.profile = null;
                this.registerDate = new Date();
                break;
            }
            case E_Form_Mode.READ: {
                this.form.mutate({
                    disableAll: [
                        'companyFullName',
                        'companyAddress',
                        'companyLogo',
                        'companyCountry',
                        'companyCountryState',
                        'companyTax',
                        'companyNumberOfEmployee',
                        'currency',
                        'companyWebsite',
                        'fullName',
                        'gender',
                        'position',
                        'email',
                        'phone',
                        'picture',
                        'password',
                        'confirmPassword',
                        'companyReferralCode',
                    ],
                });
                break;
            }
            case E_Form_Mode.UPDATE: {
                this.form.mutate({
                    disableAll: ['companyReferralCode'],
                    delete: ['password', 'confirmPassword'],
                });
                break;
            }
        }

        const oldData = this.localStorageService.get(FORM_NAME);

        if (oldData) {
            this.setFormData(oldData);
        } else if (changes?.data?.currentValue) {
            this.setFormData(changes.data.currentValue);
        }
    }

    updateProfileHeader = (values?: T_Any) => {
        this.supplierNumber = values?.username ?? null;
        this.profile = values?.profileFeatures?.name ?? null;
        this.registerDate = values?.created ?? new Date();
    };

    setFormData = async (values) => {
        this.form.patchValue({
            companyFullName: values.companyFullName,
            companyTax: values.companyTax,
            companyAddress: values.companyAddress,
            companyCountry: values.companyCountry,
            companyCountryState: values.companyCountryState,
            companyNumberOfEmployee: values.companyNumberOfEmployee,
            companyWebsite: values.companyWebsite ?? '',
            companyReferralCode: values.companyReferralCode ?? '',
            gender: values.gender,
            phone: values.phone,
            position: values.position,
            currency: values.currency,
            email: values.email,
            fullName: values.fullName,
            companyLogo: values.companyLogo,
            picture: values.picture,
        });
    };

    onIsReadChange = (event) => {
        this.isRead = event.checked;

        if (!this.isRead) {
            this.isTermAccept = false;
        }
    };

    onIsTermAcceptChange = (event) => {
        this.isTermAccept = event.checked;
    };

    handleSave = () => {
        this.form.submit(
            ({
                password,
                confirmPassword,
                companyFullName,
                companyTax,
                companyAddress,
                companyCountry,
                companyCountryState,
                companyNumberOfEmployee,
                companyWebsite,
                companyReferralCode,
                gender,
                phone,
                position,
                currency,
                email,
                fullName,
                companyLogo,
                picture,
            }) => {
                if (password !== confirmPassword) {
                    this.form.setFieldError('confirmPassword', 'VALIDATE_DESCRIPTION.password.notMatch');
                    return;
                }

                const submitData = {
                    companyFullName,
                    companyTax,
                    companyAddress,
                    companyCity: companyCountryState,
                    companyCountryState,
                    companyCountry,
                    companyNumberOfEmployee,
                    gender,
                    phone,
                    position,
                    currency,
                    fullName,
                    picture,
                    companyLogo,
                    companyWebsite: companyWebsite ?? '',
                    companyReferralCode: companyReferralCode ?? '',
                    companyCredentialProfiles: null,
                    language: this.language,
                    ...(email !== this.data.email && { email: email }),
                };

                this.onSave(submitData, () => {
                    this.localStorageService.remove(FORM_NAME);
                });
            },
            FORM_NAME,
        );
    };

    onClickContract() {
        const { companyFullName, companyAddress, companyTax, phone, fullName, position } = this.form.getRawValue();
        this.loadingService.show('download-cooperation-agreement', E_LoadingType.GLOBAL);
        this.httpClient
            .post(
                `${environment.apiUrl}api/supplier/download-cooperation-agreement/`,
                {
                    companyFullName,
                    companyAddress,
                    companyTax,
                    phone,
                    fullName,
                    position,
                    lang: this.localStorageService.get('languageCode'),
                },
                {
                    responseType: 'blob',
                    observe: 'response',
                },
            )
            .subscribe({
                next: (res) => {
                    FileSaver.saveAs(
                        res.body,
                        this.translateService.instant('auth.register.become-supplier.cooperation-agreement-fileName'),
                    );
                },
                error: (error) => {
                    this.notificationService.error(JSON.stringify(error.message));
                },
                complete: () => {
                    this.loadingService.hide('download-cooperation-agreement', E_LoadingType.GLOBAL);
                },
            });
    }
}
