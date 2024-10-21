import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FormComponent, LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    FormService,
    LoadingService,
    LocalStorageService,
    MasterDataService,
    NotificationService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, E_PromotionScope, I_Promotion, I_PromotionForm, T_Any } from '#shared/types';
import { formatDate, translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_PROMOTION';

@Component({
    standalone: true,
    selector: 'nextpro-admin-promotion-detail',
    templateUrl: './promotion-detail.component.html',
    styleUrl: './promotion-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class PromotionDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_PromotionForm>,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.descriptionEn',
                name: 'descriptionEn',
            },
            {
                label: 'masterData.descriptionVi',
                name: 'descriptionVi',
            },
            {
                label: 'masterData.promotionCode',
                name: 'name',
            },
            {
                label: 'masterData.userGiven',
                name: 'userGiven',
            },
            {
                label: 'masterData.email',
                name: 'userGivenEmail',
            },
            {
                label: 'masterData.commission',
                name: 'commission',
            },
            {
                label: 'masterData.discount',
                name: 'discount',
            },
            {
                label: 'masterData.validFrom',
                name: 'validFrom',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'masterData.validTo',
                name: 'validTo',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'masterData.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'masterData.active',
                        value: true,
                    },
                    {
                        label: 'masterData.inactive',
                        value: false,
                    },
                ],
            },
            {
                name: 'applyScope',
                class: 'flex flex-col',
                fieldType: E_FieldType.RADIO,
                options: [
                    {
                        label: 'masterData.applyBuyer',
                        value: E_PromotionScope.FOR_BUYER,
                    },
                    {
                        label: 'masterData.applySupplier',
                        value: E_PromotionScope.FOR_SUPPLIER,
                    },
                ],
                onChange: (event, form) => {
                    if (event.value === E_PromotionScope.FOR_BUYER) {
                        form.get('profileFeatures').reset();
                        form.get('profileFeatures').disable();
                        form.get('sicp').reset();
                        form.get('sicp').disable();
                    } else {
                        form.get('profileFeatures').enable();
                        form.get('sicp').enable();
                    }
                },
            },
            {
                name: 'forSupplierContainer',
                class: 'flex ml-8',
                fieldType: E_FieldType.CONTAINER,
                children: [
                    {
                        label: 'masterData.profileFeatures',
                        name: 'profileFeatures',
                        fieldType: E_FieldType.CHECKBOX,
                        disabled: true,
                    },
                    {
                        label: 'masterData.sicp',
                        name: 'sicp',
                        fieldType: E_FieldType.CHECKBOX,
                        disabled: true,
                    },
                ],
            },
            {
                label: 'masterData.applyAdvertisement',
                name: 'applyForAdvertisement',
                fieldType: E_FieldType.CHECKBOX,
                value: false,
            },
            {
                label: 'masterData.visible',
                name: 'visible',
                fieldType: E_FieldType.CHECKBOX,
                value: false,
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_Promotion;
    @Input() onCloseDrawer;
    @Input() refetch;

    ngOnInit() {
        const oldData = this.localStorageService.get(FORM_NAME);

        if (oldData) {
            this.form.patchValue(oldData);
        }
    }

    ngOnChanges(changes) {
        if (changes?.mode?.currentValue === E_Form_Mode.CREATE) {
            this.form.reset();
        } else if (this.data) {
            const {
                name,
                status,
                applyForAdvertisement,
                applyForBuyer,
                applyForSupplier,
                applyScope,
                commission,
                discount,
                validFrom,
                validTo,
                visible,
                userGiven,
                userGivenEmail,
            } = this.data;

            this.form.patchValue({
                name,
                descriptionEn: translateData(this.data, 'en', 'description'),
                descriptionVi: translateData(this.data, 'vi', 'description'),
                status,
                commission,
                discount,
                userGiven,
                userGivenEmail,
                validFrom,
                validTo,
                visible,
                applyScope,
                applyForAdvertisement,
                profileFeatures: [
                    E_PromotionScope.FOR_SUPPLIER_ALL_SCOPE as string,
                    E_PromotionScope.FOR_SUPPLIER_PROFILE_FEATURES as string,
                ].includes(applyScope),
                sicp: [
                    E_PromotionScope.FOR_SUPPLIER_ALL_SCOPE as string,
                    E_PromotionScope.FOR_SUPPLIER_SICP as string,
                ].includes(applyScope),
            });

            if (applyForBuyer) {
                this.form.mutate({
                    disableAll: ['profileFeatures', 'sicp'],
                });
            }

            if (applyForSupplier) {
                this.form.mutate({
                    enableAll: ['profileFeatures', 'sicp'],
                });
            }
        }
    }

    handleSave = async () => {
        this.localStorageService.remove(FORM_NAME);
        this.form.submit(async (values) => {
            const variables = {
                descriptions: [],
                name: values.name,
                discount: values.discount,
                validFrom: formatDate(values.validFrom, { format: 'YYYY-MM-DD' }),
                validTo: formatDate(values.validTo, { format: 'YYYY-MM-DD' }),
                status: values.status,
                applyForAdvertisement: values.applyForAdvertisement,
                visible: values.visible,
                userGivenEmail: values.userGivenEmail,
                userGiven: values.userGiven,
                commission: values.commission,
                applyScope: values.applyScope as T_Any,
            };

            if (values.descriptionEn) {
                variables.descriptions.push({ description: values.descriptionEn, languageCode: 'en' });
            }

            if (values.descriptionVi) {
                variables.descriptions.push({ description: values.descriptionVi, languageCode: 'vi' });
            }

            if (values.applyScope === E_PromotionScope.FOR_SUPPLIER) {
                if (values.profileFeatures && !values.sicp) {
                    variables.applyScope = E_PromotionScope.FOR_SUPPLIER_PROFILE_FEATURES;
                } else if (!values.profileFeatures && values.sicp) {
                    variables.applyScope = E_PromotionScope.FOR_SUPPLIER_SICP;
                } else if (values.profileFeatures && values.sicp) {
                    variables.applyScope = E_PromotionScope.FOR_SUPPLIER_ALL_SCOPE;
                }
            }

            try {
                if (this.mode === E_Form_Mode.CREATE) {
                    const { promotionCreate } = await this.masterDataService.createPromotion({
                        input: variables,
                    });

                    if (promotionCreate.status) {
                        this.notificationService.success(
                            this.translateService.instant('notification.createSuccessfully'),
                        );
                    } else {
                        this.notificationService.error(promotionCreate.error?.message);
                    }
                } else if (this.mode === E_Form_Mode.UPDATE) {
                    const { promotionUpdate } = await this.masterDataService.updatePromotion({
                        input: variables,
                        id: this.data.id,
                    });
                    if (promotionUpdate.status) {
                        this.notificationService.success(
                            this.translateService.instant('notification.updateSuccessfully'),
                        );
                        this.onCloseDrawer();
                    } else {
                        this.notificationService.error(promotionUpdate.error?.message);
                    }
                }
            } finally {
                this.localStorageService.remove(FORM_NAME);
                window.location.reload();
                this.onCloseDrawer();
            }

            this.refetch();
        }, FORM_NAME);
    };
}
