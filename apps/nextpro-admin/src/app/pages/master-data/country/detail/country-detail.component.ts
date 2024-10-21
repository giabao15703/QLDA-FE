import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Validators } from '@angular/forms';
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
import { E_FieldType, E_Form_Mode, I_Country, I_CountryForm } from '#shared/types';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_COUNTRY';

@Component({
    standalone: true,
    selector: 'nextpro-admin-country-detail',
    templateUrl: './country-detail.component.html',
    styleUrl: './country-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class CountryDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_CountryForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.name',
                name: 'name',
                validate: [
                    {
                        rule: Validators.required,
                        message: 'Please fill name',
                    },
                ],
            },
            {
                label: 'masterData.itemCode',
                name: 'itemCode',
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
    @Input() data: I_Country;
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
                const { name, itemCode, status } = this.data;

                this.form.patchValue({
                    name,
                    itemCode,
                    status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    names: [{ name: values.name, languageCode: this.localStorageService.get('languageCode') }],
                    itemCode: values.itemCode,
                    status: values.status,
                },
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { countryCreate } = await this.masterDataService.createCountry({
                    ...variables,
                });

                if (countryCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(countryCreate.error?.message);
                }
            } else if (this.mode === E_Form_Mode.UPDATE) {
                const { countryUpdate } = await this.masterDataService.updateCountry({
                    id: this.data.id,
                    ...variables,
                });

                if (countryUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(countryUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
