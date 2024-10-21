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
import { E_FieldType, E_Form_Mode, E_InputType, I_City, I_ShippingFee, I_ShippingFeeForm } from '#shared/types';

const FORM_NAME = 'FORM_ADMIN_DELIVERY_SHIPPING_FEE';

@Component({
    standalone: true,
    selector: 'nextpro-admin-shipping-fee-detail',
    templateUrl: './shipping-fee-detail.component.html',
    styleUrl: './shipping-fee-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class ShippingFeeDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_ShippingFeeForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private deliveryService: DeliveryService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'delivery.shippingFee.pickUpCityName',
                name: 'pickUpCityName',
                loadingName: 'getCities',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.masterDataService
                        .getCities({ first: 50, name: text })
                        .then((res) => res.data.filter((item) => item.status)),
                mapOption: (item: I_City) => ({
                    label: `${item.stateCode} - ${item.name}`,
                    value: item.id,
                    stateCode: item.stateCode,
                }),
                translateOptions: true,
                onChange(event, formGroup, config) {
                    const selectedValue = event.option.value.value;
                    const foundOption = config.options.find((item) => item.value === selectedValue);

                    if (foundOption) {
                        formGroup.get('pickUpCityCode').setValue(foundOption.stateCode);
                    }
                },
            },
            {
                label: 'delivery.shippingFee.pickUpCityCode',
                name: 'pickUpCityCode',
                disabled: true,
            },
            {
                label: 'delivery.shippingFee.destinationCityName',
                name: 'destinationCityName',
                loadingName: 'getCities',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.masterDataService
                        .getCities({ first: 50, name: text })
                        .then((res) => res.data.filter((item) => item.status)),
                mapOption: (item: I_City) => ({
                    label: `${item.stateCode} - ${item.name}`,
                    value: item.id,
                    stateCode: item.stateCode,
                }),
                translateOptions: true,
                onChange(event, formGroup, config) {
                    const selectedValue = event.option.value.value;
                    const foundOption = config.options.find((item) => item.value === selectedValue);

                    if (foundOption) {
                        formGroup.get('destinationCityCode').setValue(foundOption.stateCode);
                    }
                },
            },
            {
                label: 'delivery.shippingFee.destinationCityCode',
                name: 'destinationCityCode',
                disabled: true,
            },
            {
                label: 'delivery.shippingFee.weight',
                name: 'weight',
            },
            {
                label: 'delivery.shippingFee.fee',
                name: 'fee',
            },
            {
                label: 'delivery.shippingFee.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'delivery.shippingFee.active',
                        value: true,
                    },
                    {
                        label: 'delivery.shippingFee.inactive',
                        value: false,
                    },
                ],
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_ShippingFee;
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
                const shippingFeeDetail = this.data;

                this.form.patchValue({
                    pickUpCityName: {
                        label: `${shippingFeeDetail.pickUpCity.stateCode} - ${shippingFeeDetail.pickUpCity.name}`,
                        value: shippingFeeDetail.pickUpCity.id,
                        stateCode: shippingFeeDetail.pickUpCity.stateCode,
                    },
                    pickUpCityCode: shippingFeeDetail.pickUpCity.stateCode,
                    destinationCityName: {
                        label: `${shippingFeeDetail.destinationCity.stateCode} - ${shippingFeeDetail.destinationCity.name}`,
                        value: shippingFeeDetail.destinationCity.id,
                        stateCode: shippingFeeDetail.destinationCity.stateCode,
                    },
                    destinationCityCode: shippingFeeDetail.destinationCity.stateCode,
                    weight: shippingFeeDetail.weight,
                    fee: shippingFeeDetail.fee,
                    status: shippingFeeDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    pickUpCityCode: values.pickUpCityName.value,
                    destinationCityCode: values.destinationCityName.value,
                    weight: values.weight,
                    fee: values.fee,
                    status: values.status,
                },
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { shippingFeeCreate } = await this.deliveryService.createShippingFee({
                    ...variables,
                });

                if (shippingFeeCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(shippingFeeCreate.error?.message);
                }
            } else {
                const { shippingFeeUpdate } = await this.deliveryService.updateShippingFee({
                    id: this.data.id,
                    ...variables,
                });

                if (shippingFeeUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                } else {
                    this.notificationService.error(shippingFeeUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
