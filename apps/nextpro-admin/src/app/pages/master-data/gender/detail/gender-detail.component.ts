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
import { E_FieldType, E_Form_Mode, I_Gender, I_GenderForm } from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_GENDER';

@Component({
    standalone: true,
    selector: 'nextpro-admin-gender-detail',
    templateUrl: './gender-detail.component.html',
    styleUrl: './gender-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class GenderDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_GenderForm>,
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
    @Input() data: I_Gender;
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
                const genderDetail = this.data;

                this.form.patchValue({
                    nameEn: translateData(genderDetail, 'en', 'name'),
                    nameVi: translateData(genderDetail, 'en', 'name'),
                    status: genderDetail.status,
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
                const { genderCreate } = await this.masterDataService.createGender({
                    ...variables,
                });

                if (genderCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(genderCreate.error?.message);
                }
            } else {
                const { genderUpdate } = await this.masterDataService.updateGender({
                    id: this.data.id,
                    ...variables,
                });

                if (genderUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(genderUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
