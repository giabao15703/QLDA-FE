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
    I_IndustrySubSector,
    I_IndustrySubSectorForm,
} from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_INDUSTRIAL_LIST_SUB_SECTOR';

@Component({
    standalone: true,
    selector: 'nextpro-admin-industry-sub-sector-detail',
    templateUrl: './industry-sub-sector-detail.component.html',
    styleUrl: './industry-sub-sector-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class IndustrySubSectorDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_IndustrySubSectorForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.industrySectorNameEn',
                name: 'industrySectorNameEn',
                loadingName: 'getIndustrySectors',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.masterDataService.getIndustrySectors({ first: 50, name: text }).then((res) => res.data),
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
                    formGroup.get('industrySectorNameVi').setValue({ label: foundOption.name, value: foundOption.id });
                },
            },
            {
                label: 'masterData.industrySectorNameVi',
                name: 'industrySectorNameVi',
                loadingName: 'getIndustrySectors',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.masterDataService.getIndustrySectors({ first: 50, nameVi: text }).then((res) => res.data),
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
                    formGroup.get('industrySectorNameEn').setValue({ label: foundOption.name, value: foundOption.id });
                },
            },
            {
                label: 'masterData.industrySubSectorNameEn',
                name: 'industrySubSectorNameEn',
            },
            {
                label: 'masterData.industrySubSectorNameVi',
                name: 'industrySubSectorNameVi',
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
    @Input() data: I_IndustrySubSector;
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
                const industrySubSectorDetail = this.data;

                this.form.patchValue({
                    industrySectorNameEn: {
                        label: translateData(industrySubSectorDetail.industrySectors, 'en', 'name'),
                        value: industrySubSectorDetail.industrySectors.id,
                    },
                    industrySectorNameVi: {
                        label: translateData(industrySubSectorDetail.industrySectors, 'vi', 'name'),
                        value: industrySubSectorDetail.industrySectors.id,
                    },
                    industrySubSectorNameEn: translateData(industrySubSectorDetail, 'en', 'name'),
                    industrySubSectorNameVi: translateData(industrySubSectorDetail, 'vi', 'name'),
                    itemCode: industrySubSectorDetail.itemCode,
                    status: industrySubSectorDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    names: [],
                    industrySector: values.industrySectorNameEn.value,
                    itemCode: values.itemCode,
                    status: values.status,
                },
            };

            if (values.industrySubSectorNameEn) {
                variables.input.names.push({ name: values.industrySubSectorNameEn, languageCode: 'en' });
            }

            if (values.industrySubSectorNameVi) {
                variables.input.names.push({ name: values.industrySubSectorNameVi, languageCode: 'vi' });
            }

            if (this.mode === E_Form_Mode.CREATE) {
                const { industrySubSectorsCreate } = await this.masterDataService.createIndustrySubSectors({
                    ...variables,
                });

                if (industrySubSectorsCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(industrySubSectorsCreate.error?.message);
                }
            } else {
                const { industrySubSectorsUpdate } = await this.masterDataService.updateIndustrySubSectors({
                    id: this.data.id,
                    ...variables,
                });

                if (industrySubSectorsUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(industrySubSectorsUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
