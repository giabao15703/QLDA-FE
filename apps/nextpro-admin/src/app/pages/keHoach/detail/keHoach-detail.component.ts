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
    KeHoachService, // Đổi từ DeTaiService sang KeHoachService
    LoadingService,
    LocalStorageService,
    NotificationService,
    AccountService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_Coupon, I_KeHoach, I_User } from '#shared/types'; // Đổi sang I_KeHoach
import { formatDate } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_KEHOACH'; // Đổi tên form

@Component({
    standalone: true,
    selector: 'nextpro-admin-keHoach-detail',
    templateUrl: './keHoach-detail.component.html', // Đổi tên file template và style
    styleUrl: './keHoach-detail.component.scss', // Đổi tên file style
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
export class KeHoachDetailComponent {
    // Đổi tên class thành KeHoachDetailComponent
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_KeHoach>, // Đổi sang I_KeHoach
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private keHoachService: KeHoachService, // Đổi sang KeHoachService
        private accountService: AccountService,
    ) {
        this.form.config = [
            /* {
                label: 'Mã kế hoạch',
                name: 'maKeHoach',
            }, */
            {
                label: 'Kỳ mở',
                name: 'kyMo',
            },
            {
                label: 'Số lượng sinh viên',
                name: 'slSinhVien',
            },
            {
                label: 'Số lượng đồ án',
                name: 'slDoAn',
            },
            {
                label: 'Thời gian bắt đầu đồ án',
                name: 'tgbdDoAn',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'Thời gian kết thúc đồ án',
                name: 'tgktDoAn',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'Thời gian bắt đầu tạo đồ án',
                name: 'tgbdTaoDoAn',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'Thời gian kết thúc tạo đồ án',
                name: 'tgktTaoDoAn',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'Thời gian bắt đầu đăng ký đề tài',
                name: 'tgbdDangKyDeTai',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'Thời gian kết thúc đăng ký đề tài',
                name: 'tgktDangKyDeTai',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'Thời gian bắt đầu làm đồ án',
                name: 'tgbdLamDoAn',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'Thời gian kết thúc làm đồ án',
                name: 'tgktLamDoAn',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'Thời gian bắt đầu chấm phản biện',
                name: 'tgbdChamPhanBien',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'Thời gian kết thúc chấm phản biện',
                name: 'tgktChamPhanBien',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'Thời gian bắt đầu chấm hội đồng',
                name: 'tgbdChamHoiDong',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'Thời gian kết thúc chấm hội đồng',
                name: 'tgktChamHoiDong',
                fieldType: E_FieldType.DATEPICKER,
            },
            /* {
                label: 'Admin',
                name: 'adminFullName',
                loadingName: 'getUsers',
                fieldType: E_FieldType.SELECT,
                getOptions: () => this.accountService.getUsers().then((res) => res.data.filter((item) => item.status)),
                mapOption: (item: I_User) => ({
                    label: item.fullName,
                    value: item.fullName,
                }),
            }, */
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_KeHoach; // Đổi sang I_KeHoach
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
                const keHoachDetail = this.data;

                this.form.patchValue({
                    maKeHoach: keHoachDetail.id,
                    slSinhVien: keHoachDetail.slSinhVien,
                    slDoAn: keHoachDetail.slDoAn,
                    kyMo: keHoachDetail.kyMo || '',
                    tgbdDoAn: keHoachDetail.tgbdDoAn,
                    tgktDoAn: keHoachDetail.tgktDoAn,
                    tgbdTaoDoAn: keHoachDetail.tgbdTaoDoAn,
                    tgktTaoDoAn: keHoachDetail.tgktTaoDoAn,
                    tgbdDangKyDeTai: keHoachDetail.tgbdDangKyDeTai,
                    tgktDangKyDeTai: keHoachDetail.tgktDangKyDeTai,
                    tgbdLamDoAn: keHoachDetail.tgbdLamDoAn,
                    tgktLamDoAn: keHoachDetail.tgktLamDoAn,
                    tgbdChamPhanBien: keHoachDetail.tgbdChamPhanBien,
                    tgktChamPhanBien: keHoachDetail.tgktChamPhanBien,
                    tgbdChamHoiDong: keHoachDetail.tgbdChamHoiDong,
                    tgktChamHoiDong: keHoachDetail.tgktChamHoiDong,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    slSinhVien: values.slSinhVien,
                    slDoAn: values.slDoAn,
                    kyMo: values.kyMo,
                    tgbdDoAn: new Date(values.tgbdDoAn),
                    tgktDoAn: new Date(values.tgktDoAn),
                    tgbdTaoDoAn: new Date(values.tgbdTaoDoAn),
                    tgktTaoDoAn: new Date(values.tgktTaoDoAn),
                    tgbdDangKyDeTai: new Date(values.tgbdDangKyDeTai),
                    tgktDangKyDeTai: new Date(values.tgktDangKyDeTai),
                    tgbdLamDoAn: new Date(values.tgbdLamDoAn),
                    tgktLamDoAn: new Date(values.tgktLamDoAn),
                    tgbdChamPhanBien: new Date(values.tgbdChamPhanBien),
                    tgktChamPhanBien: new Date(values.tgktChamPhanBien),
                    tgbdChamHoiDong: new Date(values.tgbdChamHoiDong),
                    tgktChamHoiDong: new Date(values.tgktChamHoiDong),
                },
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { createKeHoachDoAn } = await this.keHoachService.createKeHoach({
                    input: {
                        ...variables.input,
                    },
                });

                if (createKeHoachDoAn.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(createKeHoachDoAn.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
