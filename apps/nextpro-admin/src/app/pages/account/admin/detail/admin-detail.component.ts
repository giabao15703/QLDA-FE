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
                label: 'account.admin-accounts.picture',
                name: 'picture',
                fieldType: E_FieldType.UPLOAD,
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
                label: 'account.admin-accounts.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'account.admin-accounts.active',
                        value: 1,
                    },
                    {
                        label: 'account.admin-accounts.inactive',
                        value: 2,
                    },
                    {
                        label: 'account.admin-accounts.cancelled',
                        value: 3,
                    },
                    {
                        label: 'account.admin-accounts.pending',
                        value: 4,
                    },
                ],
            },
            {
                label: 'account.admin-accounts.validFrom',
                name: 'validFrom',
                fieldType: E_FieldType.DATEPICKER,
                validate: [
                    {
                        rule: Validators.required,
                        message: 'Please fill valid from',
                    },
                ],
            },
            {
                label: 'account.admin-accounts.validTo',
                name: 'validTo',
                fieldType: E_FieldType.DATEPICKER,
                validate: [
                    {
                        rule: Validators.required,
                        message: 'Please fill valid to',
                    },
                ],
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
                    {
                        label: 'account.admin-accounts.levelFour',
                        value: 4,
                    },
                ],
            },
            {
                label: 'account.admin-accounts.modules',
                name: 'modules',
                loadingName: 'getGroupPermissions',
                fieldType: E_FieldType.SELECT,
                getOptions: () =>
                    this.accountService
                        .getGroupPermissions()
                        .then((res) => res.data.filter((groupPermission) => Boolean(groupPermission.group))),
                mapOption: (item: I_GroupPermission) => ({
                    label: item.group.name,
                    value: item.group.id,
                }),
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
                    picture,
                    user: { status, userspermissionSet },
                } = this.data;

                this.form.patchValue({
                    id,
                    shortName,
                    longName,
                    email,
                    picture: await getFile(picture),
                    status,
                    validFrom: userspermissionSet?.edges?.[0]?.node?.validFrom,
                    validTo: userspermissionSet?.edges?.[0]?.node?.validTo,
                    role: userspermissionSet?.edges?.[0]?.node?.permission?.role,
                    modules: userspermissionSet?.edges?.[0]?.node?.permission?.group?.id,
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
                picture: values.picture,
                permissions: [
                    {
                        validFrom: toPythonDate(values.validFrom),
                        validTo: toPythonDate(values.validTo),
                        role: parseInt(values.role),
                        modules: values.modules,
                    },
                ],
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { adminCreate } = await this.accountService.createAdmin({
                    admin: variables,
                });

                if (adminCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(adminCreate.error?.message);
                }
            } else {
                const { adminUpdate } = await this.accountService.updateAdmin({
                    id: this.data.id,
                    admin: variables,
                    isDelete: false,
                });

                if (adminUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(adminUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
