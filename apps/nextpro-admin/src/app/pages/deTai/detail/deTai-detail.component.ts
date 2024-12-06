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
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_DeTai } from '#shared/types';
import { formatDate } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_DETAI';

@Component({
    standalone: true,
    selector: 'nextpro-admin-deTai-detail',
    templateUrl: './deTai-detail.component.html',
    styleUrl: './deTai-detail.component.scss',
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
export class DeTaiDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_DeTai>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private deTaiService: DeTaiService,
    ) {
        this.form.config = [
            {
                label: 'Tên đề tài',
                name: 'tendoan',
            },

            {
                label: 'Trạng thái',
                name: 'trangthai',
                fieldType: E_FieldType.SELECT,
                options: [
                    { label: 'Đang chờ duyệt', value: '0' },
                    { label: 'Đã duyệt', value: '1' },
                    { label: 'Đã huỷ', value: '2' },
                    { label: 'Yêu cầu chỉnh sửa', value: '3' },
                ],
                class: 'd-none',
                disabled: JSON.parse(localStorage.getItem('admin')).role === 'A_3',
            },
            {
                label: 'Yêu cầu',
                name: 'yeucau',
                fieldType: E_FieldType.TEXTAREA,
                disabled: JSON.parse(localStorage.getItem('admin')).role === 'A_3',
            },
            {
                label: 'Mô tả',
                name: 'mota',
                fieldType: E_FieldType.TEXTAREA,
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_DeTai;
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
            const deTaiDetail = this.data;
            this.form.patchValue({
                tendoan: deTaiDetail.tendoan,
                mota: deTaiDetail.mota || '',
                trangthai: deTaiDetail.trangthai,
                yeucau: deTaiDetail.yeucau,
            });
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const currentUser = localStorage.getItem('user');
            const idgvhuongdan = JSON.parse(currentUser).id; // ID của giảng viên hiện tại

            const variables = {
                input: {
                    tendoan: values.tendoan,
                    mota: values.mota,
                },
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { deTaiCreate } = await this.deTaiService.createDeTai({
                    input: variables.input,
                });

                if (deTaiCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(deTaiCreate.error?.message);
                }
            } else {
                const { deTaiUpdate } = await this.deTaiService.updateDeTai({
                    id: this.data.id,
                    input: {
                        tendoan: values.tendoan,
                        mota: values.mota,
                        trangthai: values.trangthai,
                        yeucau: values.yeucau,
                    },
                });
                if (deTaiUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(deTaiUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
