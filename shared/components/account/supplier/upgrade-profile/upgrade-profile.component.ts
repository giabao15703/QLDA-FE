import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ROUTES } from '#shared/constants';
import { MaterialModules } from '#shared/modules';
import {
    AccountService,
    FormService,
    I_FormInstance,
    LocalStorageService,
    MasterDataService,
    NotificationService,
    PaymentDataService,
    SaleSchemeService,
} from '#shared/services';
import {
    E_ContainerType,
    E_FieldType,
    E_ProfileFeatureSupplier,
    E_PromotionScope,
    E_SicpSupplier,
    E_SupplierPromotionType,
    E_TableColumnType,
    I_ProfileFeaturesSupplier,
    I_QueryVariables,
    I_SicpRegistration,
    I_Supplier,
} from '#shared/types';
import { formatDate, formatMoney, getQueryVariables, reverseFormatMoney } from '#shared/utils';
import { Router } from '@angular/router';
import { FormComponent } from '../../../form/form.component';

const PROFILE_FEATURE_SCHEME = 'PROFILE_FEATURE_SCHEME';
const SICP_REGISTRATION_SCHEME = 'SICP_REGISTRATION_SCHEME';

@Component({
    standalone: true,
    selector: 'app-supplier-upgrade-profile',
    templateUrl: './upgrade-profile.component.html',
    styleUrl: './upgrade-profile.component.scss',
    providers: [FormService],
    imports: [CommonModule, FormComponent, MaterialModules, TranslateModule],
})
export class SupplierUpgradeProfileComponent {
    constructor(
        public form: FormService,
        public router: Router,
        private accountService: AccountService,
        private translateService: TranslateService,
        private saleSchemeService: SaleSchemeService,
        private masterDataService: MasterDataService,
        private notificationService: NotificationService,
        private paymentService: PaymentDataService,
        private el: ElementRef,
        private renderer: Renderer2,
        private localStorageService: LocalStorageService,
    ) {
        this.form.config = [
            {
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.DIV,
                children: [
                    {
                        fieldType: E_FieldType.TABLE,
                        name: 'profileFeature',
                        table: {
                            class: '!h-auto mt-3',
                            columns: [
                                {
                                    name: 'label',
                                    label: 'supplier-profile.tabs.upgrade-profile.profile-features.title',
                                    headerStyle: { fontSize: '17px', fontWeight: 'bold' },
                                    render: (cell) => {
                                        return this.translateService.instant(cell);
                                    },
                                    cellStyle: { fontWeight: '600', fontSize: '16px' },
                                    footer: {
                                        cellStyle: { fontWeight: '400', fontSize: '16px' },
                                        label: 'supplier-profile.tabs.upgrade-profile.profile-features.tick-here',
                                    },
                                },
                                {
                                    name: 'basic',
                                    label: E_ProfileFeatureSupplier.BASIC,
                                    headerStyle: {
                                        fontSize: '17px',
                                        fontWeight: 'bold',
                                        color: '#ffffff',
                                        background: '#6e569a',
                                        textAlign: 'center',
                                    },
                                    cellStyle: { textAlign: 'center', fontSize: '16px' },
                                    footer: {
                                        cellStyle: { textAlign: 'center' },
                                        type: E_TableColumnType.FORM,
                                        form: {
                                            name: PROFILE_FEATURE_SCHEME,
                                            config: [
                                                {
                                                    name: E_ProfileFeatureSupplier.BASIC,
                                                    fieldType: E_FieldType.RADIO,
                                                    options: [
                                                        {
                                                            value: E_ProfileFeatureSupplier.BASIC,
                                                        },
                                                    ],
                                                    onChange: (event) => {
                                                        this.applySchemeProfileFeature(event.value);
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                                {
                                    name: 'premium',
                                    label: E_ProfileFeatureSupplier.PREMIUM,
                                    headerStyle: {
                                        fontSize: '17px',
                                        fontWeight: 'bold',
                                        color: '#ffffff',
                                        background: '#2dcbb6',
                                        textAlign: 'center',
                                    },
                                    cellStyle: { textAlign: 'center', fontSize: '16px' },
                                    footer: {
                                        cellStyle: { textAlign: 'center' },
                                        type: E_TableColumnType.FORM,
                                        form: {
                                            name: PROFILE_FEATURE_SCHEME,
                                            config: [
                                                {
                                                    name: E_ProfileFeatureSupplier.PREMIUM,
                                                    fieldType: E_FieldType.RADIO,
                                                    options: [
                                                        {
                                                            value: E_ProfileFeatureSupplier.PREMIUM,
                                                        },
                                                    ],
                                                    onChange: (event) => {
                                                        this.applySchemeProfileFeature(event.value);
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                                {
                                    name: 'sponsor',
                                    label: E_ProfileFeatureSupplier.SPONSOR,
                                    headerStyle: {
                                        fontSize: '17px',
                                        fontWeight: 'bold',
                                        color: '#ffffff',
                                        background: '#fba435',
                                        textAlign: 'center',
                                    },
                                    cellStyle: { textAlign: 'center', fontSize: '16px' },
                                    footer: {
                                        cellStyle: { textAlign: 'center' },
                                        type: E_TableColumnType.FORM,
                                        form: {
                                            name: PROFILE_FEATURE_SCHEME,
                                            config: [
                                                {
                                                    name: E_ProfileFeatureSupplier.SPONSOR,
                                                    fieldType: E_FieldType.RADIO,
                                                    options: [
                                                        {
                                                            value: E_ProfileFeatureSupplier.SPONSOR,
                                                        },
                                                    ],
                                                    onChange: (event) => {
                                                        this.applySchemeProfileFeature(event.value);
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        class: 'mt-3 !w-96',
                        label: 'supplier-profile.tabs.upgrade-profile.profile-features.amount',
                        name: 'profileFeatureAmount',
                        disabled: true,
                    },
                    {
                        class: '!w-96',
                        label: 'supplier-profile.tabs.upgrade-profile.profile-features.promotion',
                        name: 'profileFeaturePromotionCode',
                        onBlur: (event) =>
                            this.getPromotionResults(event.target.value, E_SupplierPromotionType.PROFILE),
                    },
                    {
                        class: '!w-96',
                        label: 'supplier-profile.tabs.upgrade-profile.profile-features.total',
                        name: 'profileFeatureTotal',
                        disabled: true,
                    },
                    {
                        fieldType: E_FieldType.TABLE,
                        name: 'profileFeatureTable',
                        table: {
                            class: '!h-auto my-8',
                            columns: [
                                {
                                    name: 'name',
                                    label: 'supplier-profile.tabs.upgrade-profile.profile-features.promotion-program',
                                    headerStyle: {
                                        textAlign: 'center',
                                    },
                                },
                                {
                                    name: 'description',
                                    label: 'supplier-profile.tabs.upgrade-profile.profile-features.description',
                                    headerStyle: {
                                        background: '#dbdbdb',
                                        borderRight: '1px solid #c0bcbc',
                                        textAlign: 'center',
                                    },
                                },
                                {
                                    name: 'discount',
                                    label: 'supplier-profile.tabs.upgrade-profile.profile-features.discount',
                                    headerStyle: {
                                        background: '#dbdbdb',
                                        borderRight: '1px solid #c0bcbc',
                                        textAlign: 'center',
                                    },
                                },
                                {
                                    name: 'validFrom',
                                    label: 'supplier-profile.tabs.upgrade-profile.profile-features.valid-from',
                                    headerStyle: {
                                        background: '#dbdbdb',
                                        borderRight: '1px solid #c0bcbc',
                                        textAlign: 'center',
                                    },
                                    render: formatDate,
                                },
                                {
                                    name: 'validTo',
                                    label: 'supplier-profile.tabs.upgrade-profile.profile-features.valid-to',
                                    headerStyle: {
                                        background: '#dbdbdb',
                                        borderRight: '1px solid #c0bcbc',
                                        textAlign: 'center',
                                    },
                                    render: formatDate,
                                },
                            ],
                        },
                    },
                ],
            },
            {
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.DIV,
                children: [
                    {
                        fieldType: E_FieldType.TABLE,
                        name: 'sicpRegistration',
                        table: {
                            class: '!h-auto mt-3',
                            columns: [
                                {
                                    name: 'label',
                                    label: 'supplier-profile.tabs.upgrade-profile.verification-register.title',
                                    headerStyle: { fontSize: '17px', fontWeight: 'bold' },
                                    cellStyle: { fontWeight: '600', fontSize: '16px' },
                                    render: (cell) => {
                                        return this.translateService.instant(cell);
                                    },
                                    footer: {
                                        cellStyle: { fontWeight: '400', fontSize: '16px' },
                                        label: 'supplier-profile.tabs.upgrade-profile.profile-features.tick-here',
                                    },
                                },
                                {
                                    name: 'unsecured',
                                    label: E_SicpSupplier.UNSECURED,
                                    headerStyle: {
                                        fontSize: '17px',
                                        fontWeight: 'bold',
                                        color: '#ffffff',
                                        background: '#6e569a',
                                    },
                                    cellStyle: { textAlign: 'center', fontSize: '16px' },
                                    directive: {
                                        iconSrc: '/assets/icons/question-mark-in-circular-shape-svgrepo-com.svg',
                                        tooltip: this.translateService.instant(
                                            'supplier-profile.tabs.upgrade-profile.profile-features.noteUnsecured',
                                        ),
                                    },
                                    footer: {
                                        cellStyle: { textAlign: 'center' },
                                        type: E_TableColumnType.FORM,
                                        form: {
                                            name: SICP_REGISTRATION_SCHEME,
                                            config: [
                                                {
                                                    name: E_SicpSupplier.UNSECURED,
                                                    fieldType: E_FieldType.RADIO,
                                                    options: [
                                                        {
                                                            value: E_SicpSupplier.UNSECURED,
                                                        },
                                                    ],
                                                    onChange: (event) => {
                                                        this.applySchemeSicp(event.value);
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                                {
                                    name: 'bronze',
                                    label: E_SicpSupplier.BRONZE,
                                    headerStyle: {
                                        fontSize: '17px',
                                        fontWeight: 'bold',
                                        color: '#ffffff',
                                        background: '#2dcbb6',
                                    },
                                    cellStyle: { textAlign: 'center', fontSize: '16px' },
                                    directive: {
                                        iconSrc: '/assets/icons/question-mark-in-circular-shape-svgrepo-com.svg',
                                        tooltip: this.translateService.instant(
                                            'supplier-profile.tabs.upgrade-profile.profile-features.noteBronze',
                                        ),
                                    },
                                    footer: {
                                        cellStyle: { textAlign: 'center' },
                                        type: E_TableColumnType.FORM,
                                        form: {
                                            name: SICP_REGISTRATION_SCHEME,
                                            config: [
                                                {
                                                    name: E_SicpSupplier.BRONZE,
                                                    fieldType: E_FieldType.RADIO,
                                                    options: [
                                                        {
                                                            value: E_SicpSupplier.BRONZE,
                                                        },
                                                    ],
                                                    onChange: (event) => {
                                                        this.applySchemeSicp(event.value);
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                                {
                                    name: 'silver',
                                    label: E_SicpSupplier.SILVER,
                                    headerStyle: {
                                        fontSize: '17px',
                                        fontWeight: 'bold',
                                        color: '#ffffff',
                                        background: '#fba435',
                                    },
                                    cellStyle: { textAlign: 'center', fontSize: '16px' },
                                    directive: {
                                        iconSrc: '/assets/icons/question-mark-in-circular-shape-svgrepo-com.svg',
                                        tooltip: this.translateService.instant(
                                            'supplier-profile.tabs.upgrade-profile.profile-features.noteSilver',
                                        ),
                                    },
                                    footer: {
                                        cellStyle: { textAlign: 'center' },
                                        type: E_TableColumnType.FORM,
                                        form: {
                                            name: SICP_REGISTRATION_SCHEME,
                                            config: [
                                                {
                                                    name: E_SicpSupplier.SILVER,
                                                    fieldType: E_FieldType.RADIO,
                                                    options: [
                                                        {
                                                            value: E_SicpSupplier.SILVER,
                                                        },
                                                    ],
                                                    onChange: (event) => {
                                                        this.applySchemeSicp(event.value);
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                                {
                                    name: 'gold',
                                    label: E_SicpSupplier.GOLD,
                                    headerStyle: {
                                        fontSize: '17px',
                                        fontWeight: 'bold',
                                        color: '#ffffff',
                                        background: '#f86b63',
                                    },
                                    cellStyle: { textAlign: 'center', fontSize: '16px' },
                                    directive: {
                                        iconSrc: '/assets/icons/question-mark-in-circular-shape-svgrepo-com.svg',
                                        tooltip: this.translateService.instant(
                                            'supplier-profile.tabs.upgrade-profile.profile-features.noteGold',
                                        ),
                                    },
                                    footer: {
                                        cellStyle: { textAlign: 'center' },
                                        type: E_TableColumnType.FORM,
                                        form: {
                                            name: SICP_REGISTRATION_SCHEME,
                                            config: [
                                                {
                                                    name: E_SicpSupplier.GOLD,
                                                    fieldType: E_FieldType.RADIO,
                                                    options: [
                                                        {
                                                            value: E_SicpSupplier.GOLD,
                                                        },
                                                    ],
                                                    onChange: (event) => {
                                                        this.applySchemeSicp(event.value);
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        class: 'mt-3 !w-96',
                        label: 'supplier-profile.tabs.upgrade-profile.profile-features.amount',
                        name: 'sicpRegistrationAmount',
                        disabled: true,
                    },
                    {
                        class: '!w-96',
                        label: 'supplier-profile.tabs.upgrade-profile.profile-features.promotion',
                        name: 'sicpRegistrationPromotionCode',
                        onBlur: (event) => this.getPromotionResults(event.target.value, E_SupplierPromotionType.SICP),
                    },
                    {
                        class: '!w-96',
                        label: 'supplier-profile.tabs.upgrade-profile.profile-features.total',
                        name: 'sicpRegistrationTotal',
                        disabled: true,
                    },
                    {
                        class: '!w-96',
                        label: 'supplier-profile.tabs.upgrade-profile.profile-features.grand-total',
                        name: 'grandTotal',
                        disabled: true,
                    },
                    {
                        fieldType: E_FieldType.TABLE,
                        name: 'sicpRegistrationTable',
                        table: {
                            class: '!h-auto my-8',
                            columns: [
                                {
                                    name: 'name',
                                    label: 'supplier-profile.tabs.upgrade-profile.profile-features.promotion-program',
                                    headerStyle: {
                                        textAlign: 'center',
                                    },
                                },
                                {
                                    name: 'description',
                                    label: 'supplier-profile.tabs.upgrade-profile.profile-features.description',
                                    headerStyle: {
                                        background: '#dbdbdb',
                                        borderRight: '1px solid #c0bcbc',
                                        textAlign: 'center',
                                    },
                                },
                                {
                                    name: 'discount',
                                    label: 'supplier-profile.tabs.upgrade-profile.profile-features.discount',
                                    headerStyle: {
                                        background: '#dbdbdb',
                                        borderRight: '1px solid #c0bcbc',
                                        textAlign: 'center',
                                    },
                                },
                                {
                                    name: 'validFrom',
                                    label: 'supplier-profile.tabs.upgrade-profile.profile-features.valid-from',
                                    headerStyle: {
                                        background: '#dbdbdb',
                                        borderRight: '1px solid #c0bcbc',
                                        textAlign: 'center',
                                    },
                                    render: formatDate,
                                },
                                {
                                    name: 'validTo',
                                    label: 'supplier-profile.tabs.upgrade-profile.profile-features.valid-to',
                                    headerStyle: {
                                        background: '#dbdbdb',
                                        borderRight: '1px solid #c0bcbc',
                                        textAlign: 'center',
                                    },
                                    render: formatDate,
                                },
                            ],
                        },
                    },
                ],
            },
        ];
    }

    @Input() supplier: I_Supplier;
    @Input() profileFeature: I_ProfileFeaturesSupplier;
    @Input() sicpRegistration: I_SicpRegistration;
    @Input() appAddTooltip: string;
    @Input() iconSrc: string;

    profileFeaturesSupplier: I_ProfileFeaturesSupplier[];
    selectedProfileFeature: I_ProfileFeaturesSupplier;
    sicpRegistrationsSupplier: I_SicpRegistration[];
    selectedSicpRegistration: I_SicpRegistration;
    profileFeatureDiscount = 0;
    sicpRegistrationDiscount = 0;
    profileFeatureMapper = [
        {
            key: 'free-registration',
            label: 'supplier-profile.tabs.upgrade-profile.profile-features.free-registration',
            name: 'freeRegistration',
            render: (cell) => {
                return cell === 'Yes' ? '✔️' : '❌';
            },
        },
        {
            key: 'quote-submiting',
            label: 'supplier-profile.tabs.upgrade-profile.profile-features.quote-submiting',
            name: 'quoteSubmiting',
            render: (cell) => {
                return cell === 'Yes' ? '✔️' : '❌';
            },
        },
        {
            key: 'rfx-priority',
            label: 'supplier-profile.tabs.upgrade-profile.profile-features.rfx-priority',
            name: 'rfxrReceivingPriority',
            render: (cell) => {
                return cell === 0 ? 'Immediately' : `${cell} hours after release`;
            },
        },
        {
            key: 'sub-account',
            label: 'supplier-profile.tabs.upgrade-profile.profile-features.sub-account',
            name: 'subUserAccounts',
        },
        {
            key: 'prioritize-showing',
            label: 'supplier-profile.tabs.upgrade-profile.profile-features.prioritize-showing',
            name: 'helpDesk',
        },
        {
            key: 'featured-products',
            label: 'supplier-profile.tabs.upgrade-profile.profile-features.featured-products',
            name: 'flashSale',
            render: (cell) => {
                return `${cell} products`;
            },
        },
        {
            key: 'posting-products-flash-sale',
            label: 'supplier-profile.tabs.upgrade-profile.profile-features.posting-products-flash-sale',
        },
        {
            key: 'other-products',
            label: 'supplier-profile.tabs.upgrade-profile.profile-features.other-products',
            name: 'product',
            render: (cell) => {
                return `${cell} products`;
            },
        },
        {
            key: 'report',
            label: 'supplier-profile.tabs.upgrade-profile.profile-features.report-year',
            name: 'reportYear',
        },
        {
            key: 'base-rate-month',
            label: 'supplier-profile.tabs.upgrade-profile.profile-features.base-rate-month',
            name: 'baseRateMonth',
            render: (cell) => (cell > 0 ? formatMoney(cell) : '-'),
        },
        {
            key: 'base-rate-year',
            label: 'supplier-profile.tabs.upgrade-profile.profile-features.base-rate-year',
            name: 'baseRateFullYear',
            render: (cell) => (cell > 0 ? formatMoney(cell) : '-'),
        },
    ];
    sicpRegistrationMapper = [
        {
            key: 'legal-status',
            label: 'supplier-profile.tabs.upgrade-profile.verification-register.legal-status',
            name: 'legalStatus',
            render: (cell) => (cell > 0 ? formatMoney(cell) : '-'),
        },
        {
            key: 'bank-account',
            label: 'supplier-profile.tabs.upgrade-profile.verification-register.bank-account',
            name: 'bankAccount',
            render: (cell) => (cell > 0 ? formatMoney(cell) : '-'),
        },
        {
            key: 'sanction-check',
            label: 'supplier-profile.tabs.upgrade-profile.verification-register.sanction-check',
            name: 'sanctionCheck',
            render: (cell) => (cell > 0 ? formatMoney(cell) : '-'),
        },
        {
            key: 'certificate-management',
            label: 'supplier-profile.tabs.upgrade-profile.verification-register.certificate-management',
            name: 'certificateManagement',
            render: (cell) => (cell > 0 ? formatMoney(cell) : '-'),
        },
        {
            key: 'due-diligence',
            label: 'supplier-profile.tabs.upgrade-profile.verification-register.due-diligence',
            name: 'dueDiligence',
            render: (cell) => (cell > 0 ? formatMoney(cell) : '-'),
        },
        {
            key: 'financial-risk',
            label: 'supplier-profile.tabs.upgrade-profile.verification-register.financial-risk',
            name: 'financialRisk',
            render: (cell) => (cell > 0 ? formatMoney(cell) : '-'),
        },
        {
            key: 'total-amount',
            label: 'supplier-profile.tabs.upgrade-profile.verification-register.total-amount',
            name: 'totalAmount',
            render: (cell) => (cell > 0 ? formatMoney(cell) : '-'),
        },
    ];
    isTermAccept = false;
    checkPayment = false;

    async ngOnInit() {
        await Promise.all([this.loadProfileFeatures(), this.loadSicpRegistrations()]);
        this.updateGrandTotal();
    }

    loadProfileFeatures = async () => {
        const profileFeaturesSupplier = await this.saleSchemeService.getProfileFeaturesSupplier();
        this.profileFeaturesSupplier = profileFeaturesSupplier.data;

        const profileFeatureData = this.profileFeatureMapper.map((labelItem) => ({
            key: labelItem.key,
            label: labelItem.label,
            basic: this.renderCellData(profileFeaturesSupplier, E_ProfileFeatureSupplier.BASIC, labelItem),
            premium: this.renderCellData(profileFeaturesSupplier, E_ProfileFeatureSupplier.PREMIUM, labelItem),
            sponsor: this.renderCellData(profileFeaturesSupplier, E_ProfileFeatureSupplier.SPONSOR, labelItem),
        }));

        const profileFeaturePromotions = await this.getPromotions({
            applyScope: E_PromotionScope.FOR_SUPPLIER_PROFILE_FEATURES,
        });

        this.form.mutate({
            update: [
                { name: 'profileFeature', config: { value: profileFeatureData }, isMerge: true },
                { name: 'profileFeatureTable', config: { value: profileFeaturePromotions }, isMerge: true },
            ],
        });

        const instances = this.form.getInstances();

        let currentScheme: I_FormInstance;
        const disableSchemes: I_FormInstance[] = [];

        instances.forEach((instance, name: string) => {
            if (name?.startsWith(PROFILE_FEATURE_SCHEME)) {
                if (instance.config[0].name === this.profileFeature.name) {
                    currentScheme = instance;
                } else {
                    if (!currentScheme) {
                        disableSchemes.push(instance);
                    }
                }
            }
        });

        currentScheme.form.patchValue({ [this.profileFeature.name]: this.profileFeature.name });
        disableSchemes.forEach((instance) => {
            instance.form.disable();
        });
    };

    loadSicpRegistrations = async () => {
        const sicpRegistration = await this.saleSchemeService.getSicpRegistration();
        this.sicpRegistrationsSupplier = sicpRegistration.data;

        const sicpRegistrationData = this.sicpRegistrationMapper.map((labelItem) => ({
            key: labelItem.key,
            label: labelItem.label,
            unsecured: this.renderCellData(sicpRegistration, E_SicpSupplier.UNSECURED, labelItem),
            bronze: this.renderCellData(sicpRegistration, E_SicpSupplier.BRONZE, labelItem),
            silver: this.renderCellData(sicpRegistration, E_SicpSupplier.SILVER, labelItem),
            gold: this.renderCellData(sicpRegistration, E_SicpSupplier.GOLD, labelItem),
        }));

        const sicpRegistratioPromotions = await this.getPromotions({
            applyScope: E_PromotionScope.FOR_SUPPLIER_SICP,
        });

        this.form.mutate({
            update: [
                { name: 'sicpRegistration', config: { value: sicpRegistrationData }, isMerge: true },
                { name: 'sicpRegistrationTable', config: { value: sicpRegistratioPromotions }, isMerge: true },
            ],
        });

        const instances = this.form.getInstances();

        let currentScheme: I_FormInstance;
        const disableSchemes: I_FormInstance[] = [];

        instances.forEach((instance, name: string) => {
            if (name?.startsWith(SICP_REGISTRATION_SCHEME)) {
                if (instance.config[0].name === this.sicpRegistration.name) {
                    currentScheme = instance;
                } else {
                    if (!currentScheme) {
                        disableSchemes.push(instance);
                    }
                }
            }
        });

        currentScheme.form.patchValue({ [this.sicpRegistration.name]: this.sicpRegistration.name });
        disableSchemes.forEach((instance) => {
            instance.form.disable();
        });
    };

    renderCellData(supplierData, type, labelItem) {
        const data = supplierData.data.find((element) => element.name === type)[labelItem.name];
        return labelItem.render ? labelItem.render(data) : data;
    }

    getPromotions = async (variables?: I_QueryVariables) => {
        const promotions = await this.masterDataService.getPromotions(
            { ...getQueryVariables({ variables }) },
            { extra: { variables } },
        );
        return promotions.data;
    };

    updateDiscount = (type: E_SupplierPromotionType, discount: number) => {
        const discountFieldMap = {
            [E_SupplierPromotionType.PROFILE]: 'profileFeatureDiscount',
            [E_SupplierPromotionType.SICP]: 'sicpRegistrationDiscount',
        };
        this[discountFieldMap[type]] = discount;

        const amountFieldMap = {
            [E_SupplierPromotionType.PROFILE]: 'profileFeatureAmount',
            [E_SupplierPromotionType.SICP]: 'sicpRegistrationAmount',
        };
        const totalFieldMap = {
            [E_SupplierPromotionType.PROFILE]: 'profileFeatureTotal',
            [E_SupplierPromotionType.SICP]: 'sicpRegistrationTotal',
        };

        this.updateTotal(amountFieldMap[type], totalFieldMap[type], discount);
    };

    updateTotal = (amountField: string, totalField: string, discount: number) => {
        const amount = this.form.getField(amountField).value;
        const total = amount - amount * (discount / 100);
        this.form.patchValue({
            [amountField]: formatMoney(amount),
            [totalField]: formatMoney(total),
        });
        this.updateGrandTotal();
    };

    updateGrandTotal = () => {
        const profileFeatureTotal = this.form.getField('profileFeatureTotal').value || 0;
        const sicpRegistrationTotal = this.form.getField('sicpRegistrationTotal').value || 0;
        const grandTotal = reverseFormatMoney(profileFeatureTotal) + reverseFormatMoney(sicpRegistrationTotal);

        this.checkPayment = grandTotal > 0;

        this.form.patchValue({ grandTotal: formatMoney(grandTotal) });
    };

    getPromotionResults = async (promotionCode: string, type: E_SupplierPromotionType) => {
        const promotionScopeMap = {
            [E_SupplierPromotionType.PROFILE]: E_PromotionScope.FOR_SUPPLIER_PROFILE_FEATURES,
            [E_SupplierPromotionType.SICP]: E_PromotionScope.FOR_SUPPLIER_SICP,
        };
        const forSupplierScope = promotionScopeMap[type]?.toLowerCase();

        if (!forSupplierScope) {
            console.error(`Unknown promotion type: ${type}`);
            return;
        }

        const promotionResults = await this.masterDataService.getPromotionResults({
            promotionCode,
            forSupplierScope,
        });

        if (promotionResults.data.length === 0) {
            this.notificationService.error('ERROR.promotionCodeNotExits');
            this.updateDiscount(type, 0);
        } else {
            const discount = promotionResults.data[0].promotion.discount;
            this.updateDiscount(type, discount);
        }
    };

    applyScheme = (type: E_ProfileFeatureSupplier | I_SicpRegistration, schemeType: E_SupplierPromotionType) => {
        const schemePrefix =
            schemeType === E_SupplierPromotionType.PROFILE ? PROFILE_FEATURE_SCHEME : SICP_REGISTRATION_SCHEME;
        const instances = this.form.getInstances();

        instances.forEach((instance, name: string) => {
            if (name?.startsWith(schemePrefix) && instance.config[0].name !== type) {
                instance.form.reset();
            }
        });

        if (schemeType === E_SupplierPromotionType.PROFILE) {
            this.selectedProfileFeature = this.profileFeaturesSupplier.find((element) => element.name === type);
            this.form.patchValue({ profileFeatureAmount: this.selectedProfileFeature.baseRateFullYear });
            this.updateTotal('profileFeatureAmount', 'profileFeatureTotal', this.profileFeatureDiscount);
        } else if (schemeType === E_SupplierPromotionType.SICP) {
            this.selectedSicpRegistration = this.sicpRegistrationsSupplier.find((element) => element.name === type);
            this.form.patchValue({ sicpRegistrationAmount: this.selectedSicpRegistration.totalAmount });
            this.updateTotal('sicpRegistrationAmount', 'sicpRegistrationTotal', this.sicpRegistrationDiscount);
        }
    };

    applySchemeProfileFeature = async (type: E_ProfileFeatureSupplier) => {
        this.applyScheme(type, E_SupplierPromotionType.PROFILE);
    };

    applySchemeSicp = async (type: I_SicpRegistration) => {
        this.applyScheme(type, E_SupplierPromotionType.SICP);
    };

    onIsTermAcceptChange = (event) => {
        this.isTermAccept = event.checked;
    };
    calculateGrandTotal(paymentFee: number, promotionPaymentFee: number, VAT: number): number {
        const discountPrice = paymentFee - promotionPaymentFee;
        const vat = (discountPrice * VAT) / 100;
        return discountPrice + vat;
    }
    onSubmit = async () => {
        if (this.isTermAccept) {
            const coreBusinessCount = await this.accountService.getCoreBusinessCount();
            if (coreBusinessCount === 0) {
                this.notificationService.error(this.translateService.instant('upgrade-profile.upgradeProfileError'));
                return;
            }

            if (!this.selectedProfileFeature) {
                this.selectedProfileFeature = this.supplier.profileFeatures;
            }

            if (!this.selectedSicpRegistration) {
                this.selectedSicpRegistration = this.supplier.sicpRegistration;
            }

            const { paymentPendingCheck } = await this.paymentService.checkPaymentPending({
                profileFeatures: this.selectedProfileFeature.id,
                sicpRegistration: this.selectedSicpRegistration.id,
            });

            if (paymentPendingCheck.status) {
                const {
                    grandTotal: grandTotalStr,
                    profileFeatureAmount: profileFeatureAmountStr,
                    profileFeaturePromotionCode,
                    sicpRegistrationAmount: sicpRegistrationAmountStr,
                    sicpRegistrationPromotionCode,
                } = this.form.getRawValue();
                const grandTotal: number = reverseFormatMoney(grandTotalStr);

                if (grandTotal !== 0) {
                    const profileFeatureAmount: number = reverseFormatMoney(profileFeatureAmountStr);
                    const sicpRegistrationAmount: number = reverseFormatMoney(sicpRegistrationAmountStr);
                    const paymentFee = profileFeatureAmount + sicpRegistrationAmount;
                    const promotionPaymentFee = paymentFee - grandTotal;
                    const vat: number = 10;

                    const acc = {
                        accountCode: this.supplier.username,
                        description: 'Upgrade Supplier Profile',
                        paymentFee,
                        notes: '',
                        promotionPaymentFee,
                        promotionNotes: 'Notes',
                        fullName: this.supplier.companyFullName,
                        accountName: this.supplier.companyFullName,
                        taxCode: this.supplier.companyTax,
                        registeredAddress: this.supplier.companyAddress,
                        promotionID: '',
                        promotionProfileFeatures: profileFeaturePromotionCode && {
                            code: profileFeaturePromotionCode,
                            type: E_PromotionScope.FOR_SUPPLIER_PROFILE_FEATURES,
                        },
                        promotionSICP: sicpRegistrationPromotionCode && {
                            code: sicpRegistrationPromotionCode,
                            type: E_PromotionScope.FOR_SUPPLIER_SICP,
                        },
                        profileFeatures: this.selectedProfileFeature,
                        sicp: this.selectedSicpRegistration,
                        grandTotal: this.calculateGrandTotal(paymentFee, promotionPaymentFee, vat),
                        vat,
                    };
                    this.localStorageService.set('AccountPaymentInfo', acc);
                    this.router.navigateByUrl(ROUTES.USER.SUPPLIER.PAYMENT.ROOT);
                }
            }
        } else {
            this.notificationService.error(
                this.translateService.instant('notification.termAndConditionHasNotAccepted'),
            );
        }
    };
}
