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
    DeTaiService, // Đổi sang DeTaiService
    LoadingService,
    LocalStorageService,
    NotificationService,
    AccountService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_Coupon, I_DeTai, I_User } from '#shared/types'; // Đổi sang I_DeTai
import { formatDate } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_DETAI'; // Đổi tên form

@Component({
    standalone: true,
    selector: 'nextpro-admin-deTai-detail',
    templateUrl: './deTai-detail.component.html', // Đổi tên file template và style
    styleUrl: './deTai-detail.component.scss', // Đổi tên file style
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
    // Đổi tên class thành DeTaiDetailComponent
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_DeTai>, // Đổi sang I_DeTai
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private deTaiService: DeTaiService, // Đổi sang DeTaiService
        private accountService: AccountService,
    ) {
        this.form.config = [
            {
                label: 'Tên đề tài', // Thay đổi label phù hợp
                name: 'tenDeTai',
            },
            {
                label: 'Mô tả', // Thay đổi label phù hợp
                name: 'moTa',
            },
            {
                label: 'Giảng viên', // Hiển thị tên đầy đủ của giảng viên
                name: 'giangVienFullName',
                loadingName: 'getUsers',
                fieldType: E_FieldType.SELECT,
                getOptions: () => this.accountService.getUsers().then((res) => res.data.filter((item) => item.status)),
                mapOption: (item: I_User) => ({
                    label: item.fullName,
                    value: item.fullName,
                }),
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_DeTai; // Đổi sang I_DeTai
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
                const deTaiDetail = this.data;

                this.form.patchValue({
                    tenDeTai: deTaiDetail.tenDeTai,
                    moTa: deTaiDetail.moTa || '',
                    giangVienFullName: deTaiDetail.giangVienFullName,
                    giangvienId: deTaiDetail.giangVien,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    tenDeTai: values.tenDeTai,
                    giangVienFullName: values.giangVienFullName,
                    giangVien: values.giangVien,
                },
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { deTaiCreate } = await this.deTaiService.createDeTai({
                    input: {
                        ...variables.input,
                        giangvienId: values.giangVien.id,
                        moTa: values.moTa || '',
                    },
                });

                if (deTaiCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(deTaiCreate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
