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
    I_IndustrySector,
    I_IndustrySectorForm,
} from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_INDUSTRIAL_LIST_SECTOR';

@Component({
    standalone: true,
    selector: 'nextpro-admin-industry-sector-detail',
    templateUrl: './industry-sector-detail.component.html',
    styleUrl: './industry-sector-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class IndustrySectorDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_IndustrySectorForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.industryClusterNameEn',
                name: 'industryClusterNameEn',
                loadingName: 'getIndustryClusters',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.masterDataService.getIndustryClusters({ first: 50, name: text }).then((res) => res.data),
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
                    formGroup.get('industryClusterNameVi').setValue({ label: foundOption.name, value: foundOption.id });
                },
            },
            {
                label: 'masterData.industryClusterNameVi',
                name: 'industryClusterNameVi',
                loadingName: 'getIndustryClusters',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.masterDataService.getIndustryClusters({ first: 50, nameVi: text }).then((res) => res.data),
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
                    formGroup.get('industryClusterNameEn').setValue({ label: foundOption.name, value: foundOption.id });
                },
            },
            {
                label: 'masterData.industrySectorNameEn',
                name: 'industrySectorNameEn',
            },
            {
                label: 'masterData.industrySectorNameVi',
                name: 'industrySectorNameVi',
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
    @Input() data: I_IndustrySector;
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
                const industrySectorDetail = this.data;

                this.form.patchValue({
                    industryClusterNameEn: {
                        label: translateData(industrySectorDetail.industryCluster, 'en', 'name'),
                        value: industrySectorDetail.industryCluster.id,
                    },
                    industryClusterNameVi: {
                        label: translateData(industrySectorDetail.industryCluster, 'vi', 'name'),
                        value: industrySectorDetail.industryCluster.id,
                    },
                    industrySectorNameEn: translateData(industrySectorDetail, 'en', 'name'),
                    industrySectorNameVi: translateData(industrySectorDetail, 'vi', 'name'),
                    itemCode: industrySectorDetail.itemCode,
                    status: industrySectorDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    names: [],
                    industryCluster: values.industryClusterNameEn.value,
                    itemCode: values.itemCode,
                    status: values.status,
                },
            };

            if (values.industrySectorNameEn) {
                variables.input.names.push({ name: values.industrySectorNameEn, languageCode: 'en' });
            }

            if (values.industrySectorNameVi) {
                variables.input.names.push({ name: values.industrySectorNameVi, languageCode: 'vi' });
            }

            if (this.mode === E_Form_Mode.CREATE) {
                const { industrySectorsCreate } = await this.masterDataService.createIndustrySectors({
                    ...variables,
                });

                if (industrySectorsCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(industrySectorsCreate.error?.message);
                }
            } else {
                const { industrySectorsUpdate } = await this.masterDataService.updateIndustrySector({
                    id: this.data.id,
                    ...variables,
                });

                if (industrySectorsUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(industrySectorsUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
