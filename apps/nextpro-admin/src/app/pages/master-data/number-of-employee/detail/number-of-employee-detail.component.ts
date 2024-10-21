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
import { E_FieldType, E_Form_Mode, I_NumberOfEmployee, I_NumberOfEmployeeForm } from '#shared/types';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_NUMBER_OF_EMPLOYEE';

@Component({
    standalone: true,
    selector: 'nextpro-admin-number-of-employee-detail',
    templateUrl: './number-of-employee-detail.component.html',
    styleUrl: './number-of-employee-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class NumberOfEmployeeDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_NumberOfEmployeeForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.name',
                name: 'name',
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
    @Input() data: I_NumberOfEmployee;
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
                const numberOfEmployeeDetail = this.data;

                this.form.patchValue({
                    name: numberOfEmployeeDetail.name,
                    status: numberOfEmployeeDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    names: [{ name: values.name, languageCode: this.localStorageService.get('languageCode') }],
                    status: values.status,
                },
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { numberOfEmployeeCreate } = await this.masterDataService.createNumberOfEmployee({
                    ...variables,
                });

                if (numberOfEmployeeCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(numberOfEmployeeCreate.error?.message);
                }
            } else {
                const { numberOfEmployeeUpdate } = await this.masterDataService.updateNumberOfEmployee({
                    id: this.data.id,
                    ...variables,
                });

                if (numberOfEmployeeUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(numberOfEmployeeUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
