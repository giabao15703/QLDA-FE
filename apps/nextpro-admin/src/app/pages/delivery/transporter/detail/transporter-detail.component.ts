import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    DeliveryService,
    FormService,
    LoadingService,
    LocalStorageService,
    NotificationService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_Transporter, I_TransporterForm } from '#shared/types';

const FORM_NAME = 'FORM_ADMIN_DELIVERY_TRANSPORTER';

@Component({
    standalone: true,
    selector: 'nextpro-admin-transporter-detail',
    templateUrl: './transporter-detail.component.html',
    styleUrl: './transporter-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class TransporterDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_TransporterForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private deliveryService: DeliveryService,
    ) {
        this.form.config = [
            {
                label: 'delivery.transporterList.transporterShortName',
                name: 'shortName',
            },
            {
                label: 'delivery.transporterList.transporterLongName',
                name: 'longName',
            },
            {
                label: 'delivery.transporterList.code',
                name: 'code',
            },
            {
                label: 'delivery.transporterList.tax',
                name: 'tax',
            },
            {
                label: 'delivery.transporterList.address',
                name: 'address',
            },
            {
                label: 'delivery.transporterList.email',
                name: 'email',
            },
            {
                label: 'delivery.transporterList.phone',
                name: 'phone',
            },
            {
                label: 'delivery.transporterList.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'delivery.transporterList.active',
                        value: true,
                    },
                    {
                        label: 'delivery.transporterList.inactive',
                        value: false,
                    },
                ],
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_Transporter;
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
                const transporterDetail = this.data;

                this.form.patchValue({
                    shortName: transporterDetail.shortName,
                    longName: transporterDetail.longName,
                    code: transporterDetail.code,
                    tax: transporterDetail.tax,
                    address: transporterDetail.address,
                    email: transporterDetail.email,
                    phone: transporterDetail.phone,
                    status: transporterDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    longName: values.longName,
                    shortName: values.shortName,
                    code: values.code,
                    tax: values.tax,
                    address: values.address,
                    email: values.email,
                    phone: values.phone,
                    status: values.status,
                },
            };
            if (this.mode === E_Form_Mode.CREATE) {
                const { transporterListCreate } = await this.deliveryService.createTransporter({
                    ...variables,
                });

                if (transporterListCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(transporterListCreate.error?.message);
                }
            } else {
                const { transporterListUpdate } = await this.deliveryService.updateTransporter({
                    id: this.data.id,
                    ...variables,
                });

                if (transporterListUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                } else {
                    this.notificationService.error(transporterListUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
