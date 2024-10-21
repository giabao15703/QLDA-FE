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
    MasterDataService,
    NotificationService,
} from '#shared/services';
import {
    E_FieldType,
    E_Form_Mode,
    E_InputType,
    I_City,
    I_DeliveryResponsible,
    I_DeliveryResponsibleForm,
    I_Transporter,
} from '#shared/types';
import { formatDate } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_DELIVERY_RESPONSIBLE';

@Component({
    standalone: true,
    selector: 'nextpro-admin-delivery-responsible-detail',
    templateUrl: './delivery-responsible-detail.component.html',
    styleUrl: './delivery-responsible-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class DeliveryResponsibleDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_DeliveryResponsibleForm>,
        private masterDataService: MasterDataService,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private deliveryService: DeliveryService,
    ) {
        this.form.config = [
            {
                label: 'delivery.deliveryResponsible.transporterCode',
                name: 'transporterCode',
                loadingName: 'getTransporters',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.deliveryService
                        .getTransporters({ first: 50, code: text })
                        .then((res) => res.data.filter((item) => item.status)),
                mapOption: (item: I_Transporter) => ({
                    label: `${item.code} - ${item.longName}`,
                    value: item.id,
                    shortName: item.shortName,
                }),
                translateOptions: true,
                onChange(event, formGroup, config) {
                    const selectedValue = event.option.value.value;
                    const foundOption = config.options.find((item) => item.value === selectedValue);

                    if (foundOption) {
                        formGroup.get('transporterShortName').setValue(foundOption.shortName);
                    }
                },
            },
            {
                label: 'delivery.deliveryResponsible.transporterShortName',
                name: 'transporterShortName',
                disabled: true,
            },
            {
                label: 'delivery.deliveryResponsible.cityCode',
                name: 'cityCode',
                loadingName: 'getCities',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.masterDataService
                        .getCities({ first: 50, stateCode: text })
                        .then((res) => res.data.filter((item) => item.status)),
                mapOption: (item: I_City) => ({
                    label: `${item.stateCode} - ${item.name}`,
                    value: item.id,
                    name: item.name,
                }),
                translateOptions: true,
                onChange(event, formGroup, config) {
                    const selectedValue = event.option.value.value;
                    const foundOption = config.options.find((item) => item.value === selectedValue);

                    if (foundOption) {
                        formGroup.get('cityName').setValue(foundOption.name);
                    }
                },
            },
            {
                label: 'delivery.deliveryResponsible.cityName',
                name: 'cityName',
                disabled: true,
            },
            {
                label: 'delivery.deliveryResponsible.effectiveDate',
                name: 'effectiveDate',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'delivery.deliveryResponsible.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'delivery.deliveryResponsible.active',
                        value: true,
                    },
                    {
                        label: 'delivery.deliveryResponsible.inactive',
                        value: false,
                    },
                ],
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_DeliveryResponsible;
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
                const deliveryResponsibleDetail = this.data;

                this.form.patchValue({
                    transporterCode: {
                        label: `${deliveryResponsibleDetail.transporterCode.code} - ${deliveryResponsibleDetail.transporterCode.longName}`,
                        value: deliveryResponsibleDetail.transporterCode.id,
                        shortName: deliveryResponsibleDetail.transporterCode.shortName,
                    },
                    transporterShortName: deliveryResponsibleDetail.transporterCode.shortName,
                    cityCode: {
                        label: `${deliveryResponsibleDetail.cityCode.stateCode} - ${deliveryResponsibleDetail.cityCode.name}`,
                        value: deliveryResponsibleDetail.cityCode.id,
                        name: deliveryResponsibleDetail.cityCode.name,
                    },
                    cityName: deliveryResponsibleDetail.cityCode.name,
                    effectiveDate: deliveryResponsibleDetail.effectiveDate,
                    status: deliveryResponsibleDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    transporterCode: values.transporterCode.value,
                    cityCode: values.cityCode.value,
                    effectiveDate: formatDate(values.effectiveDate, { format: 'YYYY-MM-DD' }),
                    status: values.status,
                },
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { deliveryResponsibleCreate } = await this.deliveryService.createDeliveryResponsible({
                    ...variables,
                });

                if (deliveryResponsibleCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(deliveryResponsibleCreate.error?.message);
                }
            } else {
                const { deliveryResponsibleUpdate } = await this.deliveryService.updateDeliveryResponsible({
                    id: this.data.id,
                    ...variables,
                });

                if (deliveryResponsibleUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                } else {
                    this.notificationService.error(deliveryResponsibleUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
