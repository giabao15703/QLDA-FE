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
import {
    E_FieldType,
    E_Form_Mode,
    E_InputType,
    I_Industry,
    I_IndustryCluster,
    I_IndustryClusterForm,
} from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_INDUSTRIAL_LIST_CLUSTER';

@Component({
    standalone: true,
    selector: 'nextpro-admin-industry-cluster-detail',
    templateUrl: './industry-cluster-detail.component.html',
    styleUrl: './industry-cluster-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class IndustryClusterDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_IndustryClusterForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.industryNameEn',
                name: 'industryNameEn',
                loadingName: 'getIndustries',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.masterDataService.getIndustries({ first: 50, name: text }).then((res) => res.data),
                mapOption: (item: I_Industry) => ({
                    label: translateData(item, 'en', 'name'),
                    value: item.id,
                    translations: item.translations,
                }),
                onChange(event, formGroup, config) {
                    const foundOption = translateData(
                        config.options.find((item) => item.value === event.option.value.value),
                        'vi',
                    );
                    formGroup.get('industryNameVi').setValue({ label: foundOption.name, value: foundOption.id });
                },
            },
            {
                label: 'masterData.industryNameVi',
                name: 'industryNameVi',
                loadingName: 'getIndustries',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.masterDataService.getIndustries({ first: 50, nameVi: text }).then((res) => res.data),
                mapOption: (item: I_Industry) => ({
                    label: translateData(item, 'vi', 'name'),
                    value: item.id,
                    translations: item.translations,
                }),
                onChange(event, formGroup, config) {
                    const foundOption = translateData(
                        config.options.find((item) => item.value === event.option.value.value),
                        'en',
                    );
                    formGroup.get('industryNameEn').setValue({ label: foundOption.name, value: foundOption.id });
                },
            },
            {
                label: 'masterData.industryClusterNameEn',
                name: 'industryClusterNameEn',
            },
            {
                label: 'masterData.industryClusterNameVi',
                name: 'industryClusterNameVi',
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
    @Input() data: I_IndustryCluster;
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
                const industryClusterDetail = this.data;

                this.form.patchValue({
                    industryNameEn: {
                        label: translateData(industryClusterDetail.industry, 'en', 'name'),
                        value: industryClusterDetail.industry.id,
                    },
                    industryNameVi: {
                        label: translateData(industryClusterDetail.industry, 'vi', 'name'),
                        value: industryClusterDetail.industry.id,
                    },
                    industryClusterNameEn: translateData(industryClusterDetail, 'en', 'name'),
                    industryClusterNameVi: translateData(industryClusterDetail, 'vi', 'name'),
                    itemCode: industryClusterDetail.itemCode,
                    status: industryClusterDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    names: [],
                    industry: values.industryNameEn.value,
                    itemCode: values.itemCode,
                    status: values.status,
                },
            };

            if (values.industryClusterNameEn) {
                variables.input.names.push({ name: values.industryClusterNameEn, languageCode: 'en' });
            }

            if (values.industryClusterNameVi) {
                variables.input.names.push({ name: values.industryClusterNameVi, languageCode: 'vi' });
            }

            if (this.mode === E_Form_Mode.CREATE) {
                const { industryClusterCreate } = await this.masterDataService.createIndustryCluster({
                    ...variables,
                });

                if (industryClusterCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(industryClusterCreate.error?.message);
                }
            } else {
                const { industryClusterUpdate } = await this.masterDataService.updateIndustryCluster({
                    id: this.data.id,
                    ...variables,
                });

                if (industryClusterUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(industryClusterUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
