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
import { E_FieldType, E_Form_Mode, I_Reason, I_ReasonForm } from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_REJECT_REASON';

@Component({
    standalone: true,
    selector: 'nextpro-admin-reject-reason-detail',
    templateUrl: './reject-reason-detail.component.html',
    styleUrl: './reject-reason-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class ReasonDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_ReasonForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.contentEn',
                name: 'nameEn',
            },
            {
                label: 'masterData.contentVi',
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
    @Input() data: I_Reason;
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
                const reasonDetail = this.data;

                this.form.patchValue({
                    nameEn: translateData(reasonDetail, 'en', 'name'),
                    nameVi: translateData(reasonDetail, 'vi', 'name'),
                    itemCode: reasonDetail.itemCode,
                    status: reasonDetail.status,
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
                const { reasonCreate } = await this.masterDataService.createReason({
                    ...variables,
                });

                if (reasonCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(reasonCreate.error?.message);
                }
            } else {
                const { reasonUpdate } = await this.masterDataService.updateReason({
                    id: this.data.id,
                    ...variables,
                });

                if (reasonUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(reasonUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
