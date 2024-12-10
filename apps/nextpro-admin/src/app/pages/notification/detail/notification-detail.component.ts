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
    CouponDataService,
    FormService,
    DeTaiService,
    LoadingService,
    LocalStorageService,
    NotificationService,
    AccountService,
    NotificationQLDAService,
} from '#shared/services';
import { AdminRole, E_FieldType, E_Form_Mode, I_Admin, I_DeTai, I_Notification } from '#shared/types';
import { formatDate } from '#shared/utils';
import { debug } from 'console';
import { title } from 'process';

const FORM_NAME = 'FORM_ADMIN_NOTIFICATION';

@Component({
    standalone: true,
    selector: 'nextpro-admin-notification-detail',
    templateUrl: './notification-detail.component.html',
    styleUrl: './notification-detail.component.scss',
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
export class NotificationDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_Notification>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private deTaiService: DeTaiService,
        private accountService: AccountService,
        private notificationQLDAService: NotificationQLDAService,
    ) {
        this.form.config = [
            {
                label: 'Tiêu đề',
                name: 'title',
            },

            {
                label: 'Nội dung',
                name: 'content',
            },
            {
                label: 'Tình trạng',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'Mở',
                        value: true,
                    },
                    {
                        label: 'Đóng',
                        value: false,
                    },
                ],
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_Notification;
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
        } else if (this.data) {
            const notificationDetail = this.data;
            this.form.patchValue({
                title: notificationDetail.title,
                content: notificationDetail.content || '',
                createdDate: notificationDetail.createdDate,
                status: notificationDetail.status,
            });
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    title: values.title,
                    content: values.content,
                    status: values.status,
                },
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { createNotification } = await this.notificationQLDAService.createNotification({
                    input: variables.input,
                });

                if (createNotification.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(createNotification.error?.message);
                }
            } else {
                const { updateNotification } = await this.notificationQLDAService.updateNotification({
                    id: this.data.id,
                    input: {
                        ...variables.input,
                    },
                });
                if (updateNotification.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(updateNotification.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
