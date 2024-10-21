import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ROUTES } from '#shared/constants';
import { MaterialModules } from '#shared/modules';
import {
    FormService,
    I_FormInstance,
    LocalStorageService,
    MasterDataService,
    NotificationService,
    PaymentDataService,
    SaleSchemeService,
} from '#shared/services';
import {
    E_FieldType,
    E_ProfileFeatureBuyer,
    E_PromotionScope,
    E_TableColumnType,
    I_Buyer,
    I_ProfileFeaturesBuyer,
    I_QueryVariables,
} from '#shared/types';
import { formatDate, formatMoney, getQueryVariables, reverseFormatMoney } from '#shared/utils';
import { Router } from '@angular/router';
import { FormComponent } from '../../../form/form.component';

const PROFILE_FEATURE_SCHEME = 'PROFILE_FEATURE_SCHEME';

@Component({
    standalone: true,
    selector: 'app-buyer-upgrade-profile',
    templateUrl: './upgrade-profile.component.html',
    styleUrl: './upgrade-profile.component.scss',
    providers: [FormService],
    imports: [CommonModule, FormComponent, MaterialModules, TranslateModule],
})
export class BuyerUpgradeProfileComponent {
    constructor(
        public form: FormService,
        public router: Router,
        private translateService: TranslateService,
        private saleSchemeService: SaleSchemeService,
        private masterDataService: MasterDataService,
        private notificationService: NotificationService,
        private paymentService: PaymentDataService,
        private localStorageService: LocalStorageService,
    ) {
        this.form.config = [
            {
                name: 'upgradeContainer',
                fieldType: E_FieldType.CONTAINER,
                children: [
                    {
                        fieldType: E_FieldType.TABLE,
                        name: 'profileFeatureTable',
                        table: {
                            class: '!h-auto mt-3',
                            columns: [
                                {
                                    name: 'label',
                                    label: 'buyer-profile.tabs.upgrade-profile.profile-features.title',
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
                                    label: E_ProfileFeatureBuyer.BASIC,
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
                                            name: `${PROFILE_FEATURE_SCHEME}_${E_ProfileFeatureBuyer.BASIC}`,
                                            config: [
                                                {
                                                    name: E_ProfileFeatureBuyer.BASIC,
                                                    fieldType: E_FieldType.RADIO,
                                                    options: [
                                                        {
                                                            value: E_ProfileFeatureBuyer.BASIC,
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
                                    name: 'flyer',
                                    label: E_ProfileFeatureBuyer.FLYER,
                                    headerStyle: {
                                        fontSize: '17px',
                                        fontWeight: 'bold',
                                        color: '#ffffff',
                                        background: '#2ccbb6',
                                        textAlign: 'center',
                                    },
                                    cellStyle: { textAlign: 'center', fontSize: '16px' },
                                    footer: {
                                        cellStyle: { textAlign: 'center' },
                                        type: E_TableColumnType.FORM,
                                        form: {
                                            name: `${PROFILE_FEATURE_SCHEME}_${E_ProfileFeatureBuyer.FLYER}`,
                                            config: [
                                                {
                                                    name: E_ProfileFeatureBuyer.FLYER,
                                                    fieldType: E_FieldType.RADIO,
                                                    options: [
                                                        {
                                                            value: E_ProfileFeatureBuyer.FLYER,
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
                                    name: 'crew',
                                    label: E_ProfileFeatureBuyer.CREW,
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
                                            name: `${PROFILE_FEATURE_SCHEME}_${E_ProfileFeatureBuyer.CREW}`,
                                            config: [
                                                {
                                                    name: E_ProfileFeatureBuyer.CREW,
                                                    fieldType: E_FieldType.RADIO,
                                                    options: [
                                                        {
                                                            value: E_ProfileFeatureBuyer.CREW,
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
                                    name: 'captain',
                                    label: E_ProfileFeatureBuyer.CAPTAIN,
                                    headerStyle: {
                                        fontSize: '17px',
                                        fontWeight: 'bold',
                                        color: '#ffffff',
                                        background: '#f86b63',
                                        textAlign: 'center',
                                    },
                                    cellStyle: { textAlign: 'center', fontSize: '16px' },
                                    footer: {
                                        cellStyle: { textAlign: 'center' },
                                        type: E_TableColumnType.FORM,
                                        form: {
                                            name: `${PROFILE_FEATURE_SCHEME}_${E_ProfileFeatureBuyer.CAPTAIN}`,
                                            config: [
                                                {
                                                    name: E_ProfileFeatureBuyer.CAPTAIN,
                                                    fieldType: E_FieldType.RADIO,
                                                    options: [
                                                        {
                                                            value: E_ProfileFeatureBuyer.CAPTAIN,
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
                        onBlur: (event) => this.getPromotionResults(event.target.value),
                    },
                    {
                        class: '!w-96',
                        label: 'supplier-profile.tabs.upgrade-profile.profile-features.total',
                        name: 'profileFeatureTotal',
                        disabled: true,
                    },
                    {
                        fieldType: E_FieldType.TEXT,
                        value: 'buyer-profile.tabs.upgrade-profile.profile-features.note',
                        class: 'my-3 text-sm',
                    },
                    {
                        fieldType: E_FieldType.TABLE,
                        name: 'profileFeaturePromotionTable',
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

    @Input() buyer: I_Buyer;
    @Input() profileFeature: I_ProfileFeaturesBuyer;

    profileFeaturesBuyer: I_ProfileFeaturesBuyer[];
    selectedProfileFeature: I_ProfileFeaturesBuyer;
    profileFeatureDiscount = 0;
    checkPayment = false;
    profileFeatureMapper = [
        {
            key: 'market-research',
            label: 'buyer-profile.tabs.upgrade-profile.profile-features.market-research',
            name: 'marketResearch',
            render: (cell) => {
                return cell === 'Yes' ? '✔️' : '❌';
            },
        },
        {
            key: 'no-eauction-year',
            label: 'buyer-profile.tabs.upgrade-profile.profile-features.no-eauction-year',
            name: 'noEauctionYear',
            render: (cell) => {
                return cell === 0 ? 0 : `Tối đa ${cell} sự kiện`;
            },
        },
        {
            key: 'helpdesk',
            label: 'buyer-profile.tabs.upgrade-profile.profile-features.helpdesk',
            name: 'helpDesk',
            render: (cell) => {
                return cell === 'Yes' ? '✔️' : '❌';
            },
        },
        {
            key: 'fee-eauction',
            label: 'buyer-profile.tabs.upgrade-profile.profile-features.fee-eauction',
            name: 'feeEauction',
            render: (cell) => (cell > 0 ? formatMoney(cell) : '-'),
        },
        {
            key: 'sub-user-accounts',
            label: 'buyer-profile.tabs.upgrade-profile.profile-features.sub-user-accounts',
            name: 'subUserAccounts',
        },
        {
            key: 'total-fee-year',
            label: 'buyer-profile.tabs.upgrade-profile.profile-features.total-fee-year',
            name: 'totalFeeYear',
            render: (cell) => (cell > 0 ? formatMoney(cell) : '-'),
        },
    ];
    isTermAccept = false;

    async ngOnInit() {
        await this.loadProfileFeatures();
        this.updateGrandTotal();
    }

    loadProfileFeatures = async () => {
        const profileFeaturesBuyer = await this.saleSchemeService.getProfileFeaturesBuyer();
        this.profileFeaturesBuyer = profileFeaturesBuyer.data;

        const profileFeatureData = this.profileFeatureMapper.map((labelItem) => ({
            key: labelItem.key,
            label: labelItem.label,
            basic: this.renderCellData(profileFeaturesBuyer, E_ProfileFeatureBuyer.BASIC, labelItem),
            flyer: this.renderCellData(profileFeaturesBuyer, E_ProfileFeatureBuyer.FLYER, labelItem),
            crew: this.renderCellData(profileFeaturesBuyer, E_ProfileFeatureBuyer.CREW, labelItem),
            captain: this.renderCellData(profileFeaturesBuyer, E_ProfileFeatureBuyer.CAPTAIN, labelItem),
        }));

        const profileFeaturePromotions = await this.getPromotions({
            applyForBuyer: true,
        });

        this.form.mutate({
            update: [
                { name: 'profileFeatureTable', config: { value: profileFeatureData }, isMerge: true },
                { name: 'profileFeaturePromotionTable', config: { value: profileFeaturePromotions }, isMerge: true },
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

    renderCellData(buyerData, type, labelItem) {
        const data = buyerData.data.find((element) => element.name === type)[labelItem.name];

        return labelItem.render ? labelItem.render(data) : data;
    }

    getPromotions = async (variables?: I_QueryVariables) => {
        const promotions = await this.masterDataService.getPromotions(
            { ...getQueryVariables({ variables }) },
            { extra: { variables } },
        );

        return promotions.data;
    };

    updateDiscount = (discount: number) => {
        this.profileFeatureDiscount = discount;

        this.updateTotal('profileFeatureAmount', 'profileFeatureTotal', discount);
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
        const grandTotal = profileFeatureTotal;
        this.checkPayment = reverseFormatMoney(grandTotal) > 0;
        this.form.patchValue({ grandTotal });
    };

    getPromotionResults = async (promotionCode: string) => {
        const promotionResults = await this.masterDataService.getPromotionResults({
            promotionCode,
            forSupplierScope: E_PromotionScope.FOR_BUYER.toLowerCase(),
        });

        if (promotionResults.data.length === 0) {
            this.notificationService.error('ERROR.promotionCodeNotExits');
            this.updateDiscount(0);
        } else {
            const discount = promotionResults.data[0].promotion.discount;
            this.updateDiscount(discount);
        }
    };

    applyScheme = (type: E_ProfileFeatureBuyer) => {
        const instances = this.form.getInstances();

        instances.forEach((instance, name: string) => {
            if (name?.startsWith(PROFILE_FEATURE_SCHEME) && instance.config[0].name !== type) {
                instance.form.reset();
            }
        });

        this.selectedProfileFeature = this.profileFeaturesBuyer.find((element) => element.name === type);
        this.form.patchValue({ profileFeatureAmount: this.selectedProfileFeature.totalFeeYear });
        this.updateTotal('profileFeatureAmount', 'profileFeatureTotal', this.profileFeatureDiscount);
    };

    applySchemeProfileFeature = async (type: E_ProfileFeatureBuyer) => {
        this.applyScheme(type);
    };

    onIsTermAcceptChange = (event) => {
        this.isTermAccept = event.checked;
    };
    onSubmit = async () => {
        if (this.isTermAccept) {
            if (!this.selectedProfileFeature) {
                this.selectedProfileFeature = this.buyer.profileFeatures;
            }

            const { paymentPendingCheck } = await this.paymentService.checkPaymentPending({
                profileFeatures: this.selectedProfileFeature.id,
            });

            if (paymentPendingCheck.status) {
                const {
                    profileFeatureAmount: profileFeatureAmountStr,
                    profileFeaturePromotionCode,
                    profileFeatureTotal: profileFeatureTotalStr,
                } = this.form.getRawValue();
                const profileFeatureAmount: number = reverseFormatMoney(profileFeatureAmountStr);
                const profileFeatureTotal: number = reverseFormatMoney(profileFeatureTotalStr);

                if (profileFeatureTotal !== 0) {
                    const promotionPaymentFee = profileFeatureTotal - profileFeatureAmount;
                    const vat: number = 10;

                    const acc = {
                        accountCode: this.buyer?.username,
                        description: 'Upgrade Buyer Profile',
                        paymentFee: profileFeatureAmount,
                        notes: '',
                        promotionPaymentFee,
                        fullName: this.buyer?.companyFullName,
                        accountName: this.buyer?.companyFullName,
                        taxCode: '',
                        registeredAddress: this.buyer?.companyAddress,
                        grandTotal: this.calculateGrandTotal(profileFeatureAmount, promotionPaymentFee, vat),
                        profileFeatures: this.selectedProfileFeature,
                        promotionProfileFeatures: profileFeaturePromotionCode && {
                            code: profileFeaturePromotionCode,
                            type: E_PromotionScope.FOR_BUYER,
                        },
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
    calculateGrandTotal(paymentFee: number, promotionPaymentFee: number, VAT: number): number {
        const discountPrice = paymentFee - promotionPaymentFee;
        const vat = (discountPrice * VAT) / 100;
        return discountPrice + vat;
    }
}
