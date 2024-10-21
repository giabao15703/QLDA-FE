import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    FormService,
    LoadingService,
    LocalStorageService,
    MasterDataService,
    NotificationService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_SetProductAdvertisement, I_SetProductAdvertisementForm } from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_SET_PRODUCT_ADVERTISEMENT';

@Component({
    standalone: true,
    selector: 'nextpro-admin-set-product-advertisement-detail',
    templateUrl: './set-product-advertisement-detail.component.html',
    styleUrl: './set-product-advertisement-detail.component.scss',
    providers: [FormService],
    imports: [
        CommonModule,
        TranslateModule,
        LoadingComponent,
        MaterialModules,
        TableComponent,
        FormComponent,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
    ],
})
export class SetProductAdvertisementDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_SetProductAdvertisementForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'voucher.descriptionEN',
                name: 'descriptionEn',
            },
            {
                label: 'voucher.descriptionVN',
                name: 'descriptionVi',
            },
            {
                label: 'setProductAdvertiment.duration',
                name: 'duration',
            },
            {
                label: 'setProductAdvertiment.serviceFee',
                name: 'serviceFee',
            },
            {
                label: 'voucher.status',
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
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_SetProductAdvertisement;
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
        } else {
            if (this.data) {
                const setProductAdvertisementDetail = this.data;

                this.form.patchValue({
                    descriptionEn: translateData(setProductAdvertisementDetail, 'en', 'description'),
                    descriptionVi: translateData(setProductAdvertisementDetail, 'vi', 'description'),
                    duration: setProductAdvertisementDetail.duration,
                    serviceFee: setProductAdvertisementDetail.serviceFee,
                    status: setProductAdvertisementDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    descriptions: [],
                    duration: values.duration,
                    serviceFee: values.serviceFee,
                    status: values.status,
                },
            };
            if (values.descriptionEn) {
                variables.input.descriptions.push({ description: values.descriptionEn, languageCode: 'en' });
            }

            if (values.descriptionVi) {
                variables.input.descriptions.push({ description: values.descriptionVi, languageCode: 'vi' });
            }

            if (this.mode === E_Form_Mode.CREATE) {
                const { setProductAdvertisementCreate } = await this.masterDataService.createSetProductAdvertisement({
                    ...variables,
                });

                if (setProductAdvertisementCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(setProductAdvertisementCreate.error?.message);
                }
            } else {
                const { setProductAdvertisementUpdate } = await this.masterDataService.updateSetProductAdvertisement({
                    id: this.data.id,
                    ...variables,
                });

                if (setProductAdvertisementUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(setProductAdvertisementUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
