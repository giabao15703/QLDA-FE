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
import { E_FieldType, E_Form_Mode, I_Currency, I_CurrencyForm } from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_CURRENCY';

@Component({
    standalone: true,
    selector: 'nextpro-admin-currency-detail',
    templateUrl: './currency-detail.component.html',
    styleUrl: './currency-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class CurrencyDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_CurrencyForm>,
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
    @Input() data: I_Currency;
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
                const currencyDetail = this.data;

                this.form.patchValue({
                    nameEn: translateData(currencyDetail, 'en', 'name'),
                    nameVi: translateData(currencyDetail, 'vi', 'name'),
                    itemCode: currencyDetail.itemCode,
                    status: currencyDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    names: [],
                    itemCode: values.itemCode,
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
                const { currencyCreate } = await this.masterDataService.createCurrency({
                    ...variables,
                });

                if (currencyCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(currencyCreate.error?.message);
                }
            } else {
                const { currencyUpdate } = await this.masterDataService.updateCurrency({
                    id: this.data.id,
                    ...variables,
                });

                if (currencyUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(currencyUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
