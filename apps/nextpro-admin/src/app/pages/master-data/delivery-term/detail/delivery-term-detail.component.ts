import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
import { E_FieldType, E_Form_Mode, I_DeliveryTerm, I_DeliveryTermForm } from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_DELIVERY_TERM';

@Component({
    standalone: true,
    selector: 'nextpro-admin-delivery-term-detail',
    templateUrl: './delivery-term-detail.component.html',
    styleUrl: './delivery-term-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, TableComponent, FormComponent],
})
export class DeliveryTermDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_DeliveryTermForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.nameEn',
                name: 'nameEn',
            },
            {
                label: 'masterData.nameVi',
                name: 'nameVi',
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
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_DeliveryTerm;
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
                const deliveryTermDetail = this.data;

                this.form.patchValue({
                    nameEn: translateData(deliveryTermDetail, 'en', 'name'),
                    nameVi: translateData(deliveryTermDetail, 'vi', 'name'),
                    status: deliveryTermDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    names: [],
                    status: values.status,
                },
            };

            if (values.nameEn) {
                variables.input.names.push({ name: values.nameEn, languageCode: 'en' });
            }
            if (values.nameVi) {
                variables.input.names.push({ name: values.nameVi, languageCode: 'vi' });
            }

            if (this.mode === E_Form_Mode.CREATE) {
                const { deliveryTermCreate } = await this.masterDataService.createDeliveryTerm({
                    ...variables,
                });

                if (deliveryTermCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(deliveryTermCreate.error?.message);
                }
            } else {
                const { deliveryTermUpdate } = await this.masterDataService.updateDeliveryTerm({
                    id: this.data.id,
                    ...variables,
                });

                if (deliveryTermUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(deliveryTermUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
