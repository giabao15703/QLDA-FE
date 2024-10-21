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
import { E_FieldType, E_Form_Mode, I_Industry, I_IndustryForm } from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_INDUSTRIAL_LIST_MAIN';

@Component({
    standalone: true,
    selector: 'nextpro-admin-industry-detail',
    templateUrl: './industry-detail.component.html',
    styleUrl: './industry-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class IndustryDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_IndustryForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.industryNameVi',
                name: 'industryNameVi',
            },
            {
                label: 'masterData.industryNameEn',
                name: 'industryNameEn',
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
    @Input() data: I_Industry;
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
                const industryDetail = this.data;

                this.form.patchValue({
                    industryNameEn: translateData(industryDetail, 'en', 'name'),
                    industryNameVi: translateData(industryDetail, 'vi', 'name'),
                    itemCode: industryDetail.itemCode,
                    status: industryDetail.status,
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
                    status: true,
                },
            };

            if (values.industryNameEn) {
                variables.input.names.push({ name: values.industryNameEn, languageCode: 'en' });
            }

            if (values.industryNameVi) {
                variables.input.names.push({ name: values.industryNameVi, languageCode: 'vi' });
            }

            if (this.mode === E_Form_Mode.CREATE) {
                const { industryCreate } = await this.masterDataService.createIndustry({
                    ...variables,
                });

                if (industryCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(industryCreate.error?.message);
                }
            } else {
                const { industryUpdate } = await this.masterDataService.updateIndustry({
                    id: this.data.id,
                    ...variables,
                });

                if (industryUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(industryUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
