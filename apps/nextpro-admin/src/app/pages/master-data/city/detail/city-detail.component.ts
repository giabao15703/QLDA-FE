import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    FormService,
    LoadingService,
    LocalStorageService,
    MasterDataService,
    NotificationService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_City, I_CityForm, I_Country } from '#shared/types';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_CITY';

@Component({
    standalone: true,
    selector: 'nextpro-admin-city-detail',
    templateUrl: './city-detail.component.html',
    styleUrl: './city-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class CityDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_CityForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.name',
                name: 'name',
            },
            {
                label: 'masterData.itemCode',
                name: 'stateCode',
            },
            {
                label: 'masterData.country',
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
    @Input() data: I_City;
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
                const { name, stateCode, status, country } = this.data;

                this.form.patchValue({
                    name,
                    stateCode,
                    status,
                    country: country.id,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    names: [{ name: values.name, languageCode: this.localStorageService.get('languageCode') }],
                    itemCode: values.stateCode,
                    status: values.status,
                    country: values.country,
                },
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { countryStateCreate } = await this.masterDataService.createCity({
                    ...variables,
                });

                if (countryStateCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(countryStateCreate.error?.message);
                }
            } else if (this.mode === E_Form_Mode.UPDATE) {
                const { countryStateUpdate } = await this.masterDataService.updateCity({
                    id: this.data.id,
                    ...variables,
                });

                if (countryStateUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(countryStateUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
