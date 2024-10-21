import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    FormService,
    LoadingService,
    LocalStorageService,
    NotificationService,
    UserGuideService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_Module, I_ModuleForm } from '#shared/types';

const FORM_NAME = 'FORM_ADMIN_USER_GUIDE_SUPPLIER_MODULE';

@Component({
    standalone: true,
    selector: 'nextpro-admin-user-guide-supplier-module-detail',
    templateUrl: './module-detail.component.html',
    styleUrl: './module-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class UserGuideSupplierModuleDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_ModuleForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private userGuideService: UserGuideService,
    ) {
        this.form.config = [
            {
                label: 'user-guide.name',
                name: 'name',
            },
            {
                label: 'user-guide.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'user-guide.active',
                        value: true,
                    },
                    {
                        label: 'user-guide.inactive',
                        value: false,
                    },
                ],
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_Module;
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
                const moduleDetail = this.data;

                this.form.patchValue({
                    name: moduleDetail.name,
                    status: moduleDetail.status,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                name: values.name,
                status: values.status,
                role: 2,
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { modulesCreate } = await this.userGuideService.createModule({
                    modules: variables,
                });

                if (modulesCreate.status) {
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error('notification.error');
                }
            } else {
                const { modulesUpdate } = await this.userGuideService.updateModule({
                    id: this.data.id,
                    modules: variables,
                });

                if (modulesUpdate.status) {
                    this.notificationService.success('notification.updateSuccessfully');
                } else {
                    this.notificationService.error('notification.error');
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
