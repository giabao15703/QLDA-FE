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
    I_ClusterCode,
    I_SubClusterCode,
    I_SubClusterCodeForm,
} from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_CCC_SUB_CLUSTER_CODE';

@Component({
    standalone: true,
    selector: 'nextpro-admin-sub-cluster-code-detail',
    templateUrl: './sub-cluster-code-detail.component.html',
    styleUrl: './sub-cluster-code-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class SubClusterCodeDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_SubClusterCodeForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.clusterCodeNameEn',
                name: 'clusterCodeNameEn',
                loadingName: 'getClusterCodes',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.masterDataService.getClusterCodes({ first: 50, name: text }).then((res) => res.data),
                mapOption: (item: I_ClusterCode) => ({
                    label: translateData(item, 'en', 'name'),
                    value: item.id,
                    translations: item.translations,
                }),
                translateOptions: true,
                onChange(event, formGroup, config) {
                    const foundOption = translateData(
                        config.options.find((item) => item.value === event.option.value.value),
                        'vi',
                    );
                    formGroup.get('clusterCodeNameVi').setValue({ label: foundOption.name, value: foundOption.id });
                },
            },
            {
                label: 'masterData.clusterCodeNameVi',
                name: 'clusterCodeNameVi',
                loadingName: 'getClusterCodes',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.masterDataService.getClusterCodes({ first: 50, nameVi: text }).then((res) => res.data),
                mapOption: (item: I_ClusterCode) => ({
                    label: translateData(item, 'vi', 'name'),
                    value: item.id,
                    translations: item.translations,
                }),
                translateOptions: true,
                onChange(event, formGroup, config) {
                    const foundOption = translateData(
                        config.options.find((item) => item.value === event.option.value.value),
                        'en',
                    );
                    formGroup.get('clusterCodeNameEn').setValue({ label: foundOption.name, value: foundOption.id });
                },
            },

            {
                label: 'masterData.subClusterCodeNameEn',
                name: 'subClusterCodeNameEn',
            },
            {
                label: 'masterData.subClusterCodeNameVi',
                name: 'subClusterCodeNameVi',
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
    @Input() data: I_SubClusterCode;
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
                const subClusterCodeDetail = this.data;

                this.form.patchValue({
                    clusterCodeNameEn: {
                        label: translateData(subClusterCodeDetail.clusterCode, 'en', 'name'),
                        value: subClusterCodeDetail.clusterCode.id,
                    },
                    clusterCodeNameVi: {
                        label: translateData(subClusterCodeDetail.clusterCode, 'vi', 'name'),
                        value: subClusterCodeDetail.clusterCode.id,
                    },
                    subClusterCodeNameVi: translateData(subClusterCodeDetail, 'vi', 'name'),
                    subClusterCodeNameEn: translateData(subClusterCodeDetail, 'en', 'name'),
                    itemCode: subClusterCodeDetail.itemCode,
                    status: subClusterCodeDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    names: [],
                    clusterCode: values.clusterCodeNameEn.value,
                    itemCode: values.itemCode,
                    status: values.status,
                },
            };

            if (values.subClusterCodeNameEn) {
                variables.input.names.push({ name: values.subClusterCodeNameEn, languageCode: 'en' });
            }

            if (values.subClusterCodeNameVi) {
                variables.input.names.push({ name: values.subClusterCodeNameVi, languageCode: 'vi' });
            }

            if (this.mode === E_Form_Mode.CREATE) {
                const { subClusterCodeCreate } = await this.masterDataService.createSubClusterCode({
                    ...variables,
                });

                if (subClusterCodeCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(subClusterCodeCreate.error?.message);
                }
            } else {
                const { subClusterCodeUpdate } = await this.masterDataService.updateSubClusterCode({
                    id: this.data.id,
                    ...variables,
                });

                if (subClusterCodeUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(subClusterCodeUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
