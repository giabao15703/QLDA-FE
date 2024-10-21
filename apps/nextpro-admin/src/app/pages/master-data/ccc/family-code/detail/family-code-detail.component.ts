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
import { E_FieldType, E_Form_Mode, I_FamilyCode, I_FamilyCodeForm } from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_CCC_FAMILY_CODE';

@Component({
    standalone: true,
    selector: 'nextpro-admin-family-code-detail',
    templateUrl: './family-code-detail.component.html',
    styleUrl: './family-code-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class FamilyCodeDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_FamilyCodeForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.familyCodeNameEn',
                name: 'familyCodeNameEn',
            },
            {
                label: 'masterData.familyCodeNameVi',
                name: 'familyCodeNameVi',
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
    @Input() data: I_FamilyCode;
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
                const familyCodeDetail = this.data;

                this.form.patchValue({
                    familyCodeNameEn: translateData(familyCodeDetail, 'en', 'name'),
                    familyCodeNameVi: translateData(familyCodeDetail, 'vi', 'name'),
                    itemCode: familyCodeDetail.itemCode,
                    status: familyCodeDetail.status,
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

            if (values.familyCodeNameEn) {
                variables.input.names.push({ name: values.familyCodeNameEn, languageCode: 'en' });
            }

            if (values.familyCodeNameVi) {
                variables.input.names.push({ name: values.familyCodeNameVi, languageCode: 'vi' });
            }

            if (this.mode === E_Form_Mode.CREATE) {
                const { familyCodeCreate } = await this.masterDataService.createFamilyCode({
                    ...variables,
                });

                if (familyCodeCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(familyCodeCreate.error?.message);
                }
            } else {
                const { familyCodeUpdate } = await this.masterDataService.updateFamilyCode({
                    id: this.data.id,
                    ...variables,
                });

                if (familyCodeUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(familyCodeUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
