import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    AccountService,
    FormService,
    LoadingService,
    LocalStorageService,
    NotificationService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, E_InputType, I_Admin, I_GroupPermission } from '#shared/types';
import { getFile, toPythonDate } from '#shared/utils';
import { Validators } from '@angular/forms';

const FORM_NAME = 'FORM_ADMIN_ACCOUNT_ADMIN';

@Component({
    standalone: true,
    selector: 'nextpro-admin-account-admin-detail',
    templateUrl: './admin-detail.component.html',
    styleUrl: './admin-detail.component.scss',
    providers: [FormService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        TableComponent,
        FormComponent,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
    ],
})
export class AccountAdminDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private accountService: AccountService,
    ) {
        this.form.config = [
            {
                label: 'account.admin-accounts.shortName',
                name: 'shortName',
            },
            {
                label: 'account.admin-accounts.longName',
                name: 'longName',
            },
            {
                label: 'account.admin-accounts.email',
                name: 'email',
            },
            {
                label: 'account.admin-accounts.password',
                name: 'password',
                inputType: E_InputType.PASSWORD,
            },
            {
                label: 'account.admin-accounts.confirmPassword',
                name: 'confirmPassword',
                inputType: E_InputType.PASSWORD,
            },
            {
                label: 'account.admin-accounts.roles',
                name: 'role',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'account.admin-accounts.master',
                        value: 1,
                    },
                    {
                        label: 'account.admin-accounts.levelTwo',
                        value: 2,
                    },
                    {
                        label: 'account.admin-accounts.levelThree',
                        value: 3,
                    },
                ],
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_Admin;
    @Input() onCloseDrawer;
    @Input() refetch;

    ngOnInit() {
        const oldData = this.localStorageService.get(FORM_NAME);

        if (oldData) {
            this.form.patchValue(oldData);
        }
    }

    async ngOnChanges(changes) {
        if (changes?.mode?.currentValue === E_Form_Mode.CREATE) {
            this.form.reset();
            this.form.mutate({
                enableAll: ['password', 'confirmPassword'],
            });
        } else {
            this.form.mutate({
                disableAll: ['password', 'confirmPassword'],
            });
            if (this.data) {
                const {
                    id,
                    shortName,
                    longName,
                    email,
                    user: { status },
                    role,
                } = this.data;

                this.form.patchValue({
                    id,
                    shortName,
                    longName,
                    email,
                    status,
                    role,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                user: {
                    email: values.email,
                    shortName: values.shortName,
                    status: parseInt(values.status),
                    ...(this.mode === E_Form_Mode.CREATE && { password: values.password }),
                },
                longName: values.longName,
                role: values.role,
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { adminCreate } = await this.accountService.createAdmin({
                    admin: variables,
                });

                // Kiểm tra nếu adminCreate tồn tại và adminCreate.admin cũng tồn tại
                if (adminCreate?.status && 'admin' in adminCreate) {
                    if ('admin' in adminCreate) {
                        const createdAdminId = adminCreate.admin.id;
                        const createdAdminRole = adminCreate.admin.role;

                        // Tạo một đối tượng để lưu cả id và role
                        const adminInfo = {
                            id: createdAdminId,
                            role: createdAdminRole,
                        };

                        // Lưu đối tượng này vào localStorage dưới dạng chuỗi JSON
                        this.localStorageService.set('createdAdminInfo', JSON.stringify(adminInfo));

                        this.localStorageService.remove(FORM_NAME);
                        this.notificationService.success('notification.createSuccessfully');
                    } else {
                        this.notificationService.error(adminCreate.error?.message || 'Unknown error');
                    }
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
