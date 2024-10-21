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
import { E_FieldType, E_Form_Mode, E_InputType, I_ClusterCode, I_ClusterCodeForm, I_FamilyCode } from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_CCC_CLUSTER_CODE';

@Component({
    standalone: true,
    selector: 'nextpro-admin-cluster-code-detail',
    templateUrl: './cluster-code-detail.component.html',
    styleUrl: './cluster-code-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class ClusterCodeDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_ClusterCodeForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.familyCodeNameEn',
                name: 'familyCodeNameEn',
                loadingName: 'getFamilyCodes',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.masterDataService.getFamilyCodes({ first: 50, name: text }).then((res) => res.data),
                mapOption: (item: I_FamilyCode) => ({
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
                    formGroup.get('familyCodeNameVi').setValue({ label: foundOption.name, value: foundOption.id });
                },
            },

            {
                label: 'masterData.familyCodeNameVi',
                name: 'familyCodeNameVi',
                loadingName: 'getFamilyCodes',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.masterDataService.getFamilyCodes({ first: 50, nameVi: text }).then((res) => res.data),
                mapOption: (item: I_FamilyCode) => ({
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
                    formGroup.get('familyCodeNameEn').setValue({ label: foundOption.name, value: foundOption.id });
                },
            },

            {
                label: 'masterData.clusterCodeNameEn',
                name: 'clusterCodeNameEn',
            },
            {
                label: 'masterData.clusterCodeNameVi',
                name: 'clusterCodeNameVi',
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
    @Input() data: I_ClusterCode;
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
                const clusterCodeDetail = this.data;

                this.form.patchValue({
                    familyCodeNameEn: {
                        label: translateData(clusterCodeDetail.familyCode, 'en', 'name'),
                        value: clusterCodeDetail.familyCode.id,
                    },
                    familyCodeNameVi: {
                        label: translateData(clusterCodeDetail.familyCode, 'vi', 'name'),
                        value: clusterCodeDetail.familyCode.id,
                    },
                    clusterCodeNameEn: translateData(clusterCodeDetail, 'en', 'name'),
                    clusterCodeNameVi: translateData(clusterCodeDetail, 'vi', 'name'),
                    itemCode: clusterCodeDetail.itemCode,
                    status: clusterCodeDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    names: [],
                    familyCode: values.familyCodeNameEn.value,
                    itemCode: values.itemCode,
                    status: values.status,
                },
            };

            if (values.clusterCodeNameEn) {
                variables.input.names.push({ name: values.clusterCodeNameEn, languageCode: 'en' });
            }

            if (values.clusterCodeNameVi) {
                variables.input.names.push({ name: values.clusterCodeNameVi, languageCode: 'vi' });
            }

            if (this.mode === E_Form_Mode.CREATE) {
                const { clusterCodeCreate } = await this.masterDataService.createClusterCode({
                    ...variables,
                });

                if (clusterCodeCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(clusterCodeCreate.error?.message);
                }
            } else {
                const { clusterCodeUpdate } = await this.masterDataService.updateClusterCode({
                    id: this.data.id,
                    ...variables,
                });

                if (clusterCodeUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(clusterCodeUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
