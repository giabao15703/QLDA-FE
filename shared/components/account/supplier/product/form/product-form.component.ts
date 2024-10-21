import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';
import { FormService, MasterDataService, TableService } from '#shared/services';
import {
    E_FieldAppearance,
    E_FieldType,
    E_Form_Mode,
    E_ProductType,
    E_TableColumnType,
    I_City,
    I_Country,
    I_Currency,
    I_Product,
    I_Specifications,
    I_UnitOfMeasure,
} from '#shared/types';
import { initializeDynamicFields } from '#shared/utils';

import { REGEX_NO_NUMBERS_SPECIAL } from '#shared/constants';
import { PaymentGuaranteedComponent } from '../../../../../../apps/nextpro-user/src/app/components/common/payment-guaranteed/payment-guaranteed.component';
import { RelatedProductsComponent } from '../../../../../../apps/nextpro-user/src/app/components/common/related-products/related-products.component';
import { FormComponent } from '../../../../form/form.component';

const TABLE_HEADER_STYLE = { background: '#dbdbdb', borderRight: '1px solid #c0bcbc' };

@Component({
    standalone: true,
    selector: 'app-supplier-product-form',
    templateUrl: './product-form.component.html',
    styleUrl: './product-form.component.scss',
    providers: [
        { provide: 'generalInfoForm', useClass: FormService },
        { provide: 'attributesForm', useClass: FormService },
        { provide: 'otherInformationForm', useClass: FormService },
        { provide: 'productGroupForm', useClass: FormService },
        { provide: 'productPriceForm', useClass: FormService },
        { provide: 'wholeSalePriceForm', useClass: FormService },
        { provide: 'productServiceDetailForm', useClass: FormService },
        { provide: 'voucherForm', useClass: FormService },
        { provide: 'discountProgramForm', useClass: FormService },
        { provide: 'certificationForm', useClass: FormService },
        { provide: 'productImageForm', useClass: FormService },
        { provide: 'relatedProductsForm', useClass: FormService },
        { provide: 'form', useClass: FormService },
    ],
    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        FormComponent,
        MaterialModules,
        TranslateModule,
        PaymentGuaranteedComponent,
        ReactiveFormsModule,
    ],
})
export class SupplierProductFormComponent {
    constructor(
        @Inject('generalInfoForm') public generalInfoForm: FormService,
        @Inject('attributesForm') public attributesForm: FormService,
        @Inject('otherInformationForm') public otherInformationForm: FormService,
        @Inject('productGroupForm') public productGroupForm: FormService,
        @Inject('productPriceForm') public productPriceForm: FormService,
        @Inject('wholeSalePriceForm') public wholeSalePriceForm: FormService,
        @Inject('productServiceDetailForm') public productServiceDetailForm: FormService,
        @Inject('voucherForm') public voucherForm: FormService,
        @Inject('discountProgramForm') public discountProgramForm: FormService,
        @Inject('certificationForm') public certificationForm: FormService,
        @Inject('productImageForm') public productImageForm: FormService,
        @Inject('relatedProductsForm') public relatedProductsForm: FormService,
        @Inject('form') public form: FormService,
        public dialog: MatDialog,
        public table: TableService<I_UnitOfMeasure>,
        public fb: FormBuilder,
        private masterDataService: MasterDataService,
    ) {
        this.generalInfoForm.config = [
            {
                name: 'generalInfoContainer',
                class: 'grid lg:grid-cols-2 lg:gap-x-10 grid-col-1',
                fieldType: E_FieldType.CONTAINER,
                children: [
                    {
                        label: 'product.create.general-info.product-service-type',
                        name: 'type',
                        options: [
                            { label: 'filter.productsType.product', value: 'product' },
                            { label: 'filter.productsType.featuredProduct', value: 'featured-product' },
                        ],
                        fieldType: E_FieldType.SELECT,
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.create.productServiceType.required',
                            },
                        ],
                    },
                    {
                        label: 'product.create.general-info.categories-industries',
                        name: 'categoryList',
                        options: [
                            {
                                label: '1',
                                value: '1',
                            },
                            {
                                label: '2',
                                value: '2',
                            },
                            {
                                label: '3',
                                value: '3',
                            },
                        ],
                        fieldType: E_FieldType.SELECT,
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.create.categoriesIndustries.required',
                            },
                        ],
                    },
                    {
                        label: 'product.create.general-info.product-service-name',
                        name: 'productName',
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.create.productServiceName.required',
                            },
                        ],
                    },
                    {
                        label: 'product.create.general-info.unit',
                        name: 'unitOfMeasure',
                        loadingName: 'getUnitOfMeasures',
                        fieldType: E_FieldType.SELECT,
                        getOptions: () =>
                            this.masterDataService
                                .getUnitOfMeasures()
                                .then((res) => res.data.filter((item) => item.status)),
                        mapOption: (item: I_UnitOfMeasure) => ({
                            label: item.name,
                            value: item.id,
                        }),
                    },
                    {
                        label: 'product.create.general-info.minimum-order-quantity',
                        name: 'minimumOrderQuantity',
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.create.minimumOrderQuantity.required',
                            },
                        ],
                    },
                    {
                        label: 'product.create.general-info.sku-number',
                        name: 'skuNumber',
                    },
                    {
                        label: 'product.create.general-info.weight-unit',
                        name: 'weightUnit',
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.create.weightUnit.required',
                            },
                        ],
                    },
                    {
                        label: 'product.create.general-info.currency',
                        name: 'currency',
                        loadingName: 'getCurrencies',
                        fieldType: E_FieldType.SELECT,
                        getOptions: () =>
                            this.masterDataService
                                .getCurrencies()
                                .then((res) => res.data.filter((item) => item.status)),
                        mapOption: (item: I_Currency) => ({
                            label: item.name,
                            value: item.id,
                        }),
                    },
                ],
            },
            {
                fieldType: E_FieldType.TEXT,
                value: 'product.create.product-service-description',
                class: 'mt-2 font-semibold',
            },
            {
                placeholder: 'product.create.product-service-description',
                name: 'description',
                fieldType: E_FieldType.TEXT_EDITOR,
            },
            {
                fieldType: E_FieldType.TEXT,
                value: 'product.create.technical-specifications',
                class: 'mt-2 font-semibold',
            },
            {
                placeholder: 'product.create.technical-specifications',
                name: 'specification',
                fieldType: E_FieldType.TEXT_EDITOR,
            },
        ];
        this.attributesForm.config = [
            {
                name: 'attributesContainer',
                class: 'grid lg:grid-cols-8 grid-cols-4 lg:gap-x-4 gap-x-2',
                fieldType: E_FieldType.CONTAINER,
                children: this.generateAttributesGroups(8),
            },
        ];
        this.otherInformationForm.config = [
            {
                placeholder: 'product.create.other-info.other-info-placeholder',
                name: 'otherInformation',
                fieldType: E_FieldType.TEXT_EDITOR,
            },
        ];
        this.productGroupForm.config = [
            {
                name: 'productGroupContainer',
                class: 'flex lg:flex-row flex-col',
                fieldType: E_FieldType.CONTAINER,
                children: [
                    {
                        label: 'product.create.product-group.normal',
                        name: 'normalProduct',
                        fieldType: E_FieldType.CHECKBOX,
                    },
                    {
                        name: 'productType',
                        class: 'lg:flex lg:items-center lg:gap-x-2',
                        fieldType: E_FieldType.RADIO,
                        appearance: E_FieldAppearance.FILL,
                        options: [
                            {
                                label: 'product.create.product-group.green-products',
                                value: 'greenProduct',
                            },
                            {
                                label: 'product.create.product-group.genuine-products',
                                value: 'genuineProduct',
                            },
                        ],
                    },
                ],
            },
        ];
        this.productPriceForm.config = [
            {
                name: 'initialPrice',
                label: 'product.create.featured-products.initial-price',
            },
            {
                name: 'reducedPrice',
                label: 'product.create.featured-products.discount-price',
            },
        ];
        this.wholeSalePriceForm.config = [
            {
                name: 'priceGroupsContainer',
                fieldType: E_FieldType.DYNAMIC,
                rowClass: 'grid lg:grid-cols-4 grid-cols-1 gap-x-2',
                createButton: {
                    text: 'Add',
                },
                children: [
                    {
                        name: 'quantityFrom',
                        label: 'product.create.wholesale-price.quantity-from',
                    },
                    {
                        name: 'quantityTo',
                        label: 'product.create.wholesale-price.quantity-to',
                    },
                    {
                        name: 'priceBracket',
                        label: 'product.create.wholesale-price.price-bracket',
                    },
                    {
                        name: 'dateTime',
                        label: 'product.create.wholesale-price.time',
                    },
                ],
            },
        ];
        this.productServiceDetailForm.config = [
            {
                label: 'product.create.product-service.condition-of-products',
                name: 'productStatus',
                options: [
                    {
                        label: '1',
                        value: '1',
                    },
                    {
                        label: '2',
                        value: '2',
                    },
                    {
                        label: '3',
                        value: '3',
                    },
                ],
                fieldType: E_FieldType.SELECT,
            },
            {
                label: 'product.create.product-service.transport',
                name: 'transport',
                options: [
                    {
                        label: '1',
                        value: '1',
                    },
                    {
                        label: '2',
                        value: '2',
                    },
                    {
                        label: '3',
                        value: '3',
                    },
                ],
                fieldType: E_FieldType.SELECT,
            },
            {
                label: 'product.create.product-service.supply-capacity',
                name: 'abilityToProvide',
            },
            {
                label: 'product.create.product-service.brand',
                name: 'brand',
            },
            {
                label: 'product.create.product-service.shipping-delivery',
                name: 'shippingDeliveryLocation',
            },
            {
                label: 'product.create.product-service.made-in',
                name: 'madeIn',
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
                label: 'product.create.product-service.country',
                name: 'country',
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
                label: 'product.create.product-service.guarantee',
                name: 'guarantee',
                options: [
                    {
                        label: '1',
                        value: '1',
                    },
                    {
                        label: '2',
                        value: '2',
                    },
                    {
                        label: '3',
                        value: '3',
                    },
                ],
                fieldType: E_FieldType.SELECT,
            },
            {
                label: 'product.create.product-service.city',
                name: 'city',
                loadingName: 'getCities',
                fieldType: E_FieldType.SELECT,
                listenChangeFrom: 'country',
                getOptions: (countryId) => this.masterDataService.getCities({ countryId }).then((res) => res.data),
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
                label: 'product.create.product-service.status',
                name: 'status',
                options: [
                    {
                        label: 'View',
                        value: 'View',
                    },
                    {
                        label: 'Status',
                        value: 'Status',
                    },
                ],
                fieldType: E_FieldType.SELECT,
            },
        ];
        this.voucherForm.config = [
            {
                name: 'voucherContainer',
                fieldType: E_FieldType.CONTAINER,
                children: [
                    {
                        name: 'notVoucher',
                        fieldType: E_FieldType.RADIO,
                        appearance: E_FieldAppearance.FILL,
                        options: [
                            {
                                label: 'product.create.voucher-when-purchased-now.not-apply',
                                value: '1',
                            },
                        ],
                    },
                    {
                        name: 'directDiscount',
                        fieldType: E_FieldType.RADIO,
                        appearance: E_FieldAppearance.FILL,
                        options: [
                            {
                                label: 'product.create.voucher-when-purchased-now.direct-discount',
                                value: '1',
                            },
                        ],
                    },
                    {
                        name: 'discountValue',
                        label: 'product.create.voucher-when-purchased-now.discount',
                        class: 'w-1/2',
                        fieldType: E_FieldType.SELECT,
                        options: [
                            {
                                label: '1',
                                value: '1',
                            },
                            {
                                label: '2',
                                value: '2',
                            },
                            {
                                label: '3',
                                value: '3',
                            },
                        ],
                    },
                    {
                        name: 'minimumOrderValue',
                        fieldType: E_FieldType.RADIO,
                        appearance: E_FieldAppearance.FILL,
                        options: [
                            {
                                label: 'product.create.voucher-when-purchased-now.minimum-order-value',
                                value: '1',
                            },
                        ],
                    },
                    {
                        name: 'currency',
                        label: 'VNĐ',
                        class: 'w-1/2',
                    },
                    {
                        name: 'maximumDiscount',
                        label: 'product.create.voucher-when-purchased-now.maximum-discount',
                        class: 'w-1/2',
                    },
                    {
                        name: 'discount',
                        label: 'product.create.voucher-when-purchased-now.discount',
                        class: 'w-1/2',
                    },
                ],
            },
        ];
        this.discountProgramForm.config = [
            {
                name: 'discountProgramContainer',
                fieldType: E_FieldType.CONTAINER,
                class: 'grid lg:grid-cols-2 gap-y-3 grid-col-1 items-start',
                children: [
                    {
                        label: 'product.create.membership.discount-club',
                        name: 'discountApplies',
                        fieldType: E_FieldType.CHECKBOX,
                    },
                    {
                        label: 'product.create.membership.choose-discount',
                        name: 'discountType',
                        fieldType: E_FieldType.SELECT,
                        options: [
                            {
                                label: 'product.create.voucher-when-purchased-now.direct-discount',
                                value: '1',
                            },
                            {
                                label: 'product.create.voucher-when-purchased-now.discount-percentage',
                                value: '2',
                            },
                        ],
                    },
                ],
            },
        ];
        this.certificationForm.config = [
            {
                name: 'certificationsContainer',
                fieldType: E_FieldType.DYNAMIC,
                createButton: {
                    text: 'button.add',
                },
                children: [
                    {
                        name: 'certification',
                        fieldType: E_FieldType.UPLOAD,
                        uploadType: 'single',
                    },
                ],
            },
        ];
        this.productImageForm.config = [
            {
                name: 'productImagesContainer',
                fieldType: E_FieldType.DYNAMIC,
                createButton: {
                    text: 'button.add',
                },
                children: [
                    {
                        name: 'picture',
                        fieldType: E_FieldType.UPLOAD,
                        uploadType: 'single',
                    },
                ],
            },
        ];
        this.relatedProductsForm.config = [
            {
                name: 'relatedProductsContainer',
                fieldType: E_FieldType.CONTAINER,
                children: [
                    {
                        fieldType: E_FieldType.TABLE,
                        name: 'relatedProducts',
                        table: {
                            class: '!h-auto mt-3',
                            columns: [
                                {
                                    headerStyle: TABLE_HEADER_STYLE,
                                    cellStyle: { width: '50px' },
                                    name: 'no',
                                    label: 'supplier-profile.tabs.core-business.form.no-header',
                                    render: (_, index) => {
                                        return index + 1;
                                    },
                                },
                                {
                                    name: 'picture',
                                    label: 'account.product.picture',
                                    headerStyle: TABLE_HEADER_STYLE,
                                },
                                {
                                    name: 'productName',
                                    label: 'account.product.name',
                                    headerStyle: TABLE_HEADER_STYLE,
                                },
                                {
                                    name: 'status',
                                    label: 'account.product.status',
                                    headerStyle: TABLE_HEADER_STYLE,
                                },
                                {
                                    name: 'price',
                                    label: 'account.product.price',
                                    headerStyle: TABLE_HEADER_STYLE,
                                },
                                {
                                    headerStyle: TABLE_HEADER_STYLE,
                                    cellStyle: { width: '50px' },
                                    sticky: 'right',
                                    type: E_TableColumnType.ACTION,
                                    name: 'action',
                                    ctas: [
                                        {
                                            icon: 'delete',
                                            shouldShow: (_, index) => index !== 0,
                                            onClick: (_, index) => {
                                                this.form.tableDeleteRows([
                                                    {
                                                        name: 'relatedProducts',
                                                        index,
                                                    },
                                                ]);
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ],
            },
        ];
    }
    @Input() type: E_ProductType;
    @Input() mode: E_Form_Mode;
    @Input() data: I_Product;
    @Input() onCloseDrawer;
    @Input() refetch;
    isTermAccept = false;

    ngOnInit(): void {
        initializeDynamicFields([
            this.generalInfoForm,
            this.attributesForm,
            this.otherInformationForm,
            this.productGroupForm,
            this.productPriceForm,
            this.wholeSalePriceForm,
            this.productServiceDetailForm,
            this.voucherForm,
            this.discountProgramForm,
            this.certificationForm,
            this.productImageForm,
            this.relatedProductsForm,
        ]);
    }

    ngOnChanges(): void {
        if (this.mode === E_Form_Mode.UPDATE && this.data) {
            this.patchFormValues();
        }
    }

    patchFormValues(): void {
        this.generalInfoForm.patchValue({
            type: this.data.type,
            // categoryList: this.data.categoryList.map((category) => category.name),
            productName: this.data.productName,
            unitOfMeasure: this.data.unitOfMeasure.id,
            minimumOrderQuantity: this.data.minimumOrderQuantity,
            skuNumber: this.data.skuNumber,
            // weightUnit: this.data.weightUnit,
            // currency: this.data.currency,
            description: this.data.description,
            specification: this.data.specification,
        });

        this.otherInformationForm.patchValue({
            otherInformation: this.data.otherInformation,
        });
    }

    openPaymentGuaranteed(): void {
        const dialogRef = this.dialog.open(PaymentGuaranteedComponent, {
            width: 'auto',
        });
        dialogRef.afterClosed().subscribe(() => {
            console.log('Dialog đã đóng');
        });
    }

    openRelatedProducts(): void {
        const dialogRef = this.dialog.open(RelatedProductsComponent, {
            width: 'auto',
        });
        dialogRef.afterClosed().subscribe(() => {
            console.log('Dialog đã đóng');
        });
    }

    handleSave(): void {
        const forms = [
            this.generalInfoForm,
            this.attributesForm,
            this.otherInformationForm,
            this.productGroupForm,
            this.productPriceForm,
            this.wholeSalePriceForm,
            this.productServiceDetailForm,
            this.voucherForm,
            this.discountProgramForm,
            this.certificationForm,
            this.productImageForm,
            this.relatedProductsForm,
        ];

        let allFormsValid = true;

        forms.forEach((formService, index) => {
            if (!formService || !formService.form) {
                console.error(`Form service or form is missing at index ${index}:`, formService);
                allFormsValid = false;
            } else if (!formService.form.valid) {
                formService.form.markAllAsTouched();
                console.warn(`Form at index ${index} is invalid:`, formService.form);
                allFormsValid = false;
            }
        });

        if (allFormsValid) {
            const productData: I_Product = forms.reduce((acc: I_Product, formService) => {
                return formService && formService.form ? { ...acc, ...formService.form.getRawValue() } : acc;
            }, {} as I_Product);

            const productAttributes: I_Specifications[] = [];

            for (let i = 1; i <= 8; i++) {
                productAttributes.push({
                    color: productData[`color-${i}`] || '',
                    size: productData[`size-${i}`] || '',
                    weight: productData[`width-${i}`] || '',
                    height: productData[`height-${i}`] || '',
                    images: [productData[`picture-${i}`] || ''],
                });
            }

            productData.productAttributes = productAttributes;

            for (let i = 1; i <= 8; i++) {
                delete productData[`color-${i}`];
                delete productData[`size-${i}`];
                delete productData[`width-${i}`];
                delete productData[`height-${i}`];
                delete productData[`picture-${i}`];
            }

            console.log('Submitted product data:', productData);
        } else {
            console.log('One or more forms are invalid.');
        }
    }

    onIsTermAcceptChange = (event) => {
        this.isTermAccept = event.checked;
    };

    generateAttributesGroups(count: number) {
        const inputTypes = [
            { label: 'product.create.product-color', name: 'color' },
            { label: 'product.create.product-size', name: 'size' },
            { label: 'product.create.fabric-size', name: 'width' },
            { label: 'product.create.product-height', name: 'height' },
            {
                label: 'product.create.product-picture',
                name: 'picture',
                fieldType: E_FieldType.UPLOAD,
                uploadType: 'single',
            },
        ];

        const groups = [];

        for (let i = 0; i < inputTypes.length; i++) {
            for (let j = 0; j < count; j++) {
                groups.push({
                    ...inputTypes[i],
                    name: `${inputTypes[i].name}-${j + 1}`,
                });
            }
        }

        return groups;
    }
}
