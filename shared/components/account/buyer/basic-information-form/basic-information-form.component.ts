import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    ModalService,
    PromotionService,
} from '#shared/services';
import {
    E_ContainerType,
    E_FieldType,
    E_Form_Mode,
    E_InputType,
    I_Buyer,
    I_City,
    I_Country,
    I_Currency,
    I_Gender,
    I_Industry,
    I_NumberOfEmployee,
    T_Any,
} from '#shared/types';
import { translateData } from '#shared/utils';
import { FormComponent } from '../../../form/form.component';
import { IndustrySelectComponent } from '../../../industry-select/industry-select.component';
import { LoadingComponent } from '../../../loading/loading.component';
import { TableComponent } from '../../../table/table.component';

const FORM_NAME = 'ACCOUNT_BUYER_BASIC_INFORMATION_FORM';

@Component({
    standalone: true,
    selector: 'app-account-buyer-basic-information-form',
    templateUrl: './basic-information-form.component.html',
    styleUrl: './basic-information-form.component.scss',
    encapsulation: ViewEncapsulation.None,
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, TableComponent, FormComponent],
})
export class BuyerBasicInformationFormComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService,
        private modalService: ModalService,
        private localStorageService: LocalStorageService,
        private promotionService: PromotionService,
        private masterDataService: MasterDataService,
        private accountService: AccountService,
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
                        placeholder: 'auth.register.become-buyer.form-buyer.fullName',
                        name: 'companyFullName',
                        loadingName: 'getBuyers',
                        inputType: E_InputType.AUTOCOMPLETE,
                        maxLength: 255,
                        getOptions: (text: string) =>
                            this.accountService.getBuyers({ first: 100, usernameExact: text }).then((res) => res.data),
                        mapOption: (item: I_Buyer) => ({
                            label: item.companyFullName,
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
                        placeholder: 'auth.register.become-buyer.form-buyer.address',
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
                        label: 'auth.register.become-buyer.form-buyer.industry',
                        placeholder: 'auth.register.become-buyer.form-buyer.industry',
                        name: 'industries',
                        loadingName: 'getIndustries',
                        inputType: E_InputType.CHIP,
                        suffix: {
                            icon: 'search',
                            onClick: (e) => {
                                e.preventDefault();
                                this.openIndustryDialog();
                            },
                        },
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'notification.selectIndustry',
                            },
                        ],
                    },
                    {
                        label: 'auth.register.become-buyer.form-buyer.logo',
                        name: 'companyLogo',
                        fieldType: E_FieldType.UPLOAD,
                        uploadType: 'single',
                    },
                    {
                        label: 'auth.register.become-buyer.form-buyer.country',
                        placeholder: 'auth.register.become-buyer.form-buyer.country',
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
                        placeholder: 'auth.register.become-buyer.form-buyer.city',
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
                        label: 'auth.register.become-buyer.form-buyer.taxCode',
                        placeholder: 'auth.register.become-buyer.form-buyer.taxCode',
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
                        label: 'auth.register.become-buyer.form-buyer.noEmployee',
                        placeholder: 'auth.register.become-buyer.form-buyer.noEmployee',
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
                        label: 'auth.register.become-buyer.form-buyer.currency',
                        placeholder: 'auth.register.become-buyer.form-buyer.currency',
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
                        placeholder: 'auth.register.become-buyer.form-buyer.fullName',
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
                        placeholder: 'auth.register.become-buyer.form-buyer.gender',
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
                        placeholder: 'auth.register.become-buyer.form-buyer.position',
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
                        placeholder: 'auth.register.become-buyer.form-buyer.email',
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
                        label: 'auth.register.become-buyer.form-buyer.picture',
                        name: 'picture',
                        fieldType: E_FieldType.UPLOAD,
                        uploadType: 'single',
                    },
                    {
                        label: 'auth.register.become-buyer.form-buyer.password',
                        placeholder: 'auth.register.become-buyer.form-buyer.password',
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
                        placeholder: 'auth.register.become-buyer.form-buyer.confirmPassword',
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
                        placeholder: 'auth.register.become-buyer.form-buyer.referralCode',
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
                ],
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_Buyer;
    @Input() onSave: (values, callback) => void;
    @Input() showTerms: boolean = false;
    @Input() showMainInfo: boolean = false;
    @Input() isLoading: boolean;

    buyerNumber: string;
    profile: string;
    registerDate = new Date();
    industriesSelected: I_Industry[] = [];
    language: string;
    isTermAccept = false;

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
                        'industries',
                        'companyLogo',
                        'companyCountry',
                        'companyCountryState',
                        'companyTax',
                        'companyNumberOfEmployee',
                        'currency',
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
                this.buyerNumber = null;
                this.profile = null;
                this.registerDate = new Date();
                break;
            }
            case E_Form_Mode.READ: {
                this.form.mutate({
                    disableAll: [
                        'companyFullName',
                        'companyAddress',
                        'industries',
                        'companyLogo',
                        'companyCountry',
                        'companyCountryState',
                        'companyTax',
                        'companyNumberOfEmployee',
                        'currency',
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
                    disableAll: ['email', 'companyReferralCode'],
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
        this.buyerNumber = values?.username ?? null;
        this.profile = values?.profileFeatures?.name ?? null;
        this.registerDate = values?.created ?? new Date();
    };

    setFormData = async (values) => {
        this.form.patchValue({
            password: null,
            confirmPassword: null,
            companyFullName: values.companyFullName,
            companyTax: values.companyTax,
            companyAddress: values.companyAddress,
            companyCountry: values.companyCountry,
            companyCountryState: values.companyCountryState,
            companyNumberOfEmployee: values.companyNumberOfEmployee,
            companyReferralCode: values.companyReferralCode ?? '',
            gender: values.gender,
            phone: values.phone,
            position: values.position,
            currency: values.currency,
            email: values.email,
            fullName: values.fullName,
            companyLogo: values.companyLogo,
            picture: values.picture,
            industries: values.industries,
        });

        this.industriesSelected = values.industries;
    };

    onTermAcceptChange = (event) => {
        this.isTermAccept = event.checked;
    };

    openIndustryDialog = () => {
        this.modalService.show({
            modal: {
                height: 'auto',
                title: 'auth.register.become-buyer.form-buyer.industry',
                content: IndustrySelectComponent,
                footer: {
                    onSubmit: (industriesSelected: I_Industry[]) => {
                        this.form.getField('industries').setValue(
                            industriesSelected.map((industry) => ({
                                label: industry.name,
                                value: industry.id,
                            })),
                        );

                        this.industriesSelected = industriesSelected;
                        this.modalService.hide();
                    },
                },
            },
            data: {
                industriesSelected: this.industriesSelected,
            },
        });
    };

    handleSave = () => {
        this.form.submit(
            async ({
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
                password,
                fullName,
                companyLogo,
                picture,
                industries,
            }) => {
                if (password !== confirmPassword) {
                    this.form.setFieldError('confirmPassword', 'VALIDATE_DESCRIPTION.password.notMatch');
                    return;
                }

                const submitData = {
                    companyFullName,
                    companyTax,
                    companyAddress,
                    companyCountry,
                    companyCity: companyCountryState,
                    companyCountryState,
                    companyNumberOfEmployee,
                    companyWebsite: companyWebsite ?? '',
                    companyReferralCode: companyReferralCode ?? '',
                    gender,
                    phone,
                    position,
                    currency,
                    language: this.language,
                    email,
                    password,
                    fullName,
                    companyLogo,
                    picture,
                    industries: industries.map((industry) => industry.value),
                };

                this.onSave(submitData, () => {
                    this.localStorageService.remove(FORM_NAME);
                });
            },
            FORM_NAME,
        );
    };
}
