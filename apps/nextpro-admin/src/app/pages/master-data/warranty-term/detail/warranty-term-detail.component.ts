import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    FormService,
    LoadingService,
    LocalStorageService,
    MasterDataService,
    NotificationService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_WarrantyTerm, I_WarrantyTermForm } from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_Warranty_Term';

@Component({
    standalone: true,
    selector: 'nextpro-admin-warranty-term-detail',
    templateUrl: './warranty-term-detail.component.html',
    styleUrl: './warranty-term-detail.component.scss',
    providers: [FormService],
    imports: [
        CommonModule,
        TranslateModule,
        LoadingComponent,
        MaterialModules,
        TableComponent,
        FormComponent,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
    ],
})
export class WarrantyTermDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_WarrantyTermForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterdataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'warrantyTerm.code',
                name: 'warrantyCode',
            },
            {
                label: 'voucher.descriptionEN',
                name: 'nameEn',
            },
            {
                label: 'voucher.descriptionVN',
                name: 'nameVi',
            },

            {
                label: 'voucher.status',
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
    @Input() data: I_WarrantyTerm;
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
                const warrantyTermDetail = this.data;

                this.form.patchValue({
                    nameEn: translateData(warrantyTermDetail, 'en', 'name'),
                    nameVi: translateData(warrantyTermDetail, 'vi', 'name'),
                    warrantyCode: warrantyTermDetail.warrantyCode,
                    status: warrantyTermDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    names: [],
                    warrantyCode: values.warrantyCode,
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
                const { warrantyTermCreate } = await this.masterdataService.createWarrantyTerm({
                    ...variables,
                });

                if (warrantyTermCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(warrantyTermCreate.error?.message);
                }
            } else {
                const { warrantyTermUpdate } = await this.masterdataService.updateWarrantyTerm({
                    id: this.data.id,
                    ...variables,
                });

                if (warrantyTermUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(warrantyTermUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
