import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { FormService, MasterDataService, TableService } from '#shared/services';
import {
    E_FieldAppearance,
    E_FieldType,
    E_Form_Mode,
    E_ProductType,
    I_Category,
    I_City,
    I_Country,
    I_Currency,
    I_Product,
    I_UnitOfMeasure,
} from '#shared/types';
import { initializeDynamicFields } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrl: './product-detail.component.scss',
    providers: [
        { provide: 'generalInfoForm', useClass: FormService },
        { provide: 'specificationsForm', useClass: FormService },
        { provide: 'productServiceForm', useClass: FormService },
        { provide: 'specificationForm', useClass: FormService },
        { provide: 'otherInformationForm', useClass: FormService },
        { provide: 'productGroupForm', useClass: FormService },
        { provide: 'productPriceForm', useClass: FormService },
        { provide: 'wholeSalePriceForm', useClass: FormService },
        { provide: 'productServiceDetailForm', useClass: FormService },
        { provide: 'voucherForm', useClass: FormService },
        { provide: 'discountProgramForm', useClass: FormService },
        { provide: 'certificationForm', useClass: FormService },
        { provide: 'productImageForm', useClass: FormService },
    ],
    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        FormComponent,
        MaterialModules,
        TranslateModule,
        ReactiveFormsModule,
    ],
})
export class ProductDetailComponent {
    constructor(
        @Inject('generalInfoForm') public generalInfoForm: FormService,
        @Inject('specificationsForm') public specificationsForm: FormService,
        @Inject('productServiceForm') public productServiceForm: FormService,
        @Inject('otherInformationForm') public otherInformationForm: FormService,
        @Inject('productGroupForm') public productGroupForm: FormService,
        @Inject('productPriceForm') public productPriceForm: FormService,
        @Inject('wholeSalePriceForm') public wholeSalePriceForm: FormService,
        @Inject('productServiceDetailForm') public productServiceDetailForm: FormService,
        @Inject('voucherForm') public voucherForm: FormService,
        @Inject('discountProgramForm') public discountProgramForm: FormService,
        @Inject('certificationForm') public certificationForm: FormService,
        @Inject('productImageForm') public productImageForm: FormService,
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
                        label: 'product.productServiceType',
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
                        label: 'product.category',
                        name: 'categoryList',
                        loadingName: 'getCategories',
                        fieldType: E_FieldType.SELECT,
                        getOptions: () =>
                            this.masterDataService
                                .getCategories()
                                .then((res) => res.data.filter((item) => item.status)),
                        mapOption: (item: I_Category) => ({
                            label: item.name,
                            value: item.id,
                        }),
                    },
                    {
                        label: 'product.productService',
                        name: 'productName',
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.create.productServiceName.required',
                            },
                        ],
                    },
                    {
                        label: 'product.unit',
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
                        label: 'product.minimumOrderQuantity',
                        name: 'minimumOrderQuantity',
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.create.minimumOrderQuantity.required',
                            },
                        ],
                    },
                    {
                        label: 'product.skuNumber',
                        name: 'skuNumber',
                    },
                    {
                        label: 'product.weight',
                        name: 'weight',
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.create.weightUnit.required',
                            },
                        ],
                    },
                    {
                        label: 'product.currency',
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
                value: 'product.productServiceDescription',
                class: 'mt-2 font-semibold',
            },
            {
                placeholder: 'product.productServiceDescription',
                name: 'description',
                fieldType: E_FieldType.TEXT_EDITOR,
            },
            {
                fieldType: E_FieldType.TEXT,
                value: 'product.specification',
                class: 'mt-2 font-semibold',
            },
            {
                placeholder: 'product.specification',
                name: 'specification',
                fieldType: E_FieldType.TEXT_EDITOR,
            },
        ];
        this.specificationsForm.config = [
            {
                name: 'specifications',
                class: 'grid lg:grid-cols-8 grid-cols-4 lg:gap-x-4 gap-x-2',
                fieldType: E_FieldType.CONTAINER,
                children: this.generateSpecificationGroups(8),
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
                label: 'product.initialPrice',
            },
            {
                name: 'discountedPrice',
                label: 'product.discountedPrice',
            },
        ];
        this.wholeSalePriceForm.config = [
            {
                name: 'wholeSalePrice',
                fieldType: E_FieldType.DYNAMIC,
                rowClass: 'grid lg:grid-cols-4 grid-cols-1 gap-x-2',
                createButton: {
                    text: 'Add',
                },
                children: [
                    {
                        name: 'qualityFrom',
                        label: 'product.create.wholesale-price.quantity-from',
                    },
                    {
                        name: 'qualityTo',
                        label: 'product.create.wholesale-price.quantity-to',
                    },
                    {
                        name: 'priceBracket',
                        label: 'product.create.wholesale-price.price-bracket',
                    },
                    {
                        name: 'deliveryDays',
                        label: 'product.create.wholesale-price.time',
                    },
                ],
            },
        ];
        this.productServiceDetailForm.config = [
            {
                label: 'product.create.product-service.condition-of-products',
                name: 'inventoryStatus',
            },
            {
                label: 'product.create.product-service.transport',
                name: 'transport',
            },
            {
                label: 'product.supplyCapacity',
                name: 'abilityToProvide',
            },
            {
                label: 'product.brand',
                name: 'brand',
            },
            {
                label: 'product.create.product-service.shipping-delivery',
                name: 'delivery',
            },
            {
                label: 'product.madeIn',
                name: 'originOfProductionCountry',
                loadingName: 'getCountries',
                fieldType: E_FieldType.SELECT,
                getOptions: () =>
                    this.masterDataService.getCountries().then((res) => res.data.filter((item) => item.status)),
                mapOption: (item: I_Country) => ({
                    label: item.name,
                    value: item.id,
                }),
            },
            {
                label: 'product.country',
                name: 'country',
                loadingName: 'getCountries',
                fieldType: E_FieldType.SELECT,
                getOptions: () =>
                    this.masterDataService.getCountries().then((res) => res.data.filter((item) => item.status)),
                mapOption: (item: I_Country) => ({
                    label: item.name,
                    value: item.id,
                }),
            },
            {
                label: 'product.create.product-service.guarantee',
                name: 'guarantee',
            },
            {
                label: 'product.city',
                name: 'city',
                loadingName: 'getCities',
                fieldType: E_FieldType.SELECT,
                getOptions: () =>
                    this.masterDataService.getCities().then((res) => res.data.filter((item) => item.status)),
                mapOption: (item: I_City) => ({
                    label: item.name,
                    value: item.id,
                }),
            },
            {
                label: 'coupon.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'coupon.active',
                        value: true,
                    },
                    {
                        label: 'coupon.inactive',
                        value: false,
                    },
                ],
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
                name: 'certificationContainer',
                fieldType: E_FieldType.DYNAMIC,
                createButton: {
                    text: 'Add',
                },
                children: [
                    {
                        name: 'certificationDocuments',
                        fieldType: E_FieldType.UPLOAD,
                        uploadType: 'single',
                    },
                ],
            },
        ];
        this.productImageForm.config = [
            {
                name: 'productImageContainer',
                fieldType: E_FieldType.DYNAMIC,
                createButton: {
                    text: 'Add',
                },
                children: [
                    {
                        name: 'productImages',
                        fieldType: E_FieldType.UPLOAD,
                        uploadType: 'single',
                    },
                ],
            },
        ];
        // this.productInfoForm.config = [
        //     {
        //         name: 'productInfoContainer',
        //         fieldType: E_FieldType.CONTAINER,
        //         children: [
        //             {
        //                 name: 'certificationDocuments',
        //                 fieldType: E_FieldType.UPLOAD,
        //                 uploadType: 'single',
        //             },
        //             {
        //                 fieldType: E_FieldType.TEXT,
        //                 value: 'product.create.product-images.title',
        //                 class: 'my-2 font-semibold',
        //             },
        //             {
        //                 name: 'productImages',
        //                 fieldType: E_FieldType.UPLOAD,
        //                 uploadType: 'single',
        //             },
        //         ],
        //     },
        // ];
    }
    @Input() type: E_ProductType;
    @Input() mode: E_Form_Mode;
    @Input() data: I_Product;
    @Input() onCloseDrawer;
    @Input() refetch;
    isTermAccept = false;

    ngOnInit(): void {
        initializeDynamicFields([this.wholeSalePriceForm, this.certificationForm, this.productImageForm]);
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
            weight: this.data.weight,
            // currency: this.data.currency,
            description: this.data.description,
            currency: this.data.currency,
            specification: this.data.specification,
        });

        this.otherInformationForm.patchValue({
            otherInformation: this.data.otherInformation,
        });
        this.productPriceForm.patchValue({
            initialPrice: this.data.initialPrice,
            discountedPrice: this.data.discountedPrice,
        });
        this.wholeSalePriceForm.patchValue({
            qualityFrom: this.data.wholeSalePrice && this.data.wholeSalePrice[0].qualityFrom,
            qualityTo: this.data.wholeSalePrice && this.data.wholeSalePrice[0].qualityTo,
            priceBracket: this.data.wholeSalePrice && this.data.wholeSalePrice[0].priceBracket,
            deliveryDays: this.data.wholeSalePrice && this.data.wholeSalePrice[0].deliveryDays,
        });
        this.productServiceDetailForm.patchValue({
            inventoryStatus: this.data.inventoryStatus,
            abilityToProvide: this.data.provideAbility,
            brand: this.data.brand,
            shippingDeliveryLocation: this.data.support,
            whereProduction: this.data.originOfProduction,
            country: this.data.country,
            guarantee: this.data.guarantee,
            city: this.data.state,
            status: this.data.status,
        });
        this.productImageForm.patchValue({
            productImages: this.data.productImages,
        });
    }

    onSubmit(): void {
        console.log('Submit');
    }

    onIsTermAcceptChange = (event) => {
        this.isTermAccept = event.checked;
    };

    generateSpecificationGroups(count: number) {
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
