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
import { E_FieldType, E_Form_Mode, E_InputType, I_Category, I_CategoryForm, I_SubClusterCode } from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_CCC_DESCRIPTION_CODE';

@Component({
    standalone: true,
    selector: 'nextpro-admin-description-code-detail',
    templateUrl: './description-code-detail.component.html',
    styleUrl: './description-code-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class CategoryDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_CategoryForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.subClusterCodeNameEn',
                name: 'subClusterCodeNameEn',
                loadingName: 'getSubClusterCodes',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.masterDataService.getSubClusterCodes({ first: 50, name: text }).then((res) => res.data),
                mapOption: (item: I_SubClusterCode) => ({
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
                    formGroup.get('subClusterCodeNameVi').setValue({ label: foundOption.name, value: foundOption.id });
                },
            },
            {
                label: 'masterData.subClusterCodeNameVi',
                name: 'subClusterCodeNameVi',
                loadingName: 'getSubClusterCodes',
                inputType: E_InputType.AUTOCOMPLETE,
                getOptions: (text: string) =>
                    this.masterDataService.getSubClusterCodes({ first: 50, nameVi: text }).then((res) => res.data),
                mapOption: (item: I_SubClusterCode) => ({
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
                    formGroup.get('subClusterCodeNameEn').setValue({ label: foundOption.name, value: foundOption.id });
                },
            },
            {
                label: 'masterData.descriptionCodeNameEn',
                name: 'descriptionCodeNameEn',
            },
            {
                label: 'masterData.descriptionCodeNameVi',
                name: 'descriptionCodeNameVi',
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
    @Input() data: I_Category;
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
                const categoryDetail = this.data;

                this.form.patchValue({
                    subClusterCodeNameEn: {
                        label: translateData(categoryDetail.subClusterCode, 'en', 'name'),
                        value: categoryDetail.subClusterCode.id,
                    },
                    subClusterCodeNameVi: {
                        label: translateData(categoryDetail.subClusterCode, 'vi', 'name'),
                        value: categoryDetail.subClusterCode.id,
                    },
                    descriptionCodeNameEn: translateData(categoryDetail, 'en', 'name'),
                    descriptionCodeNameVi: translateData(categoryDetail, 'vi', 'name'),
                    itemCode: categoryDetail.itemCode,
                    status: categoryDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    names: [],
                    subClusterCode: values.subClusterCodeNameEn.value,
                    itemCode: values.itemCode,
                    status: values.status,
                },
            };

            if (values.descriptionCodeNameEn) {
                variables.input.names.push({ name: values.descriptionCodeNameEn, languageCode: 'en' });
            }

            if (values.descriptionCodeNameVi) {
                variables.input.names.push({ name: values.descriptionCodeNameVi, languageCode: 'vi' });
            }

            if (this.mode === E_Form_Mode.CREATE) {
                const { categoryCreate } = await this.masterDataService.createCategory({
                    ...variables,
                });

                if (categoryCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(categoryCreate.error?.message);
                }
            } else {
                const { categoryUpdate } = await this.masterDataService.updateCategory({
                    id: this.data.id,
                    ...variables,
                });

                if (categoryUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(categoryUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
