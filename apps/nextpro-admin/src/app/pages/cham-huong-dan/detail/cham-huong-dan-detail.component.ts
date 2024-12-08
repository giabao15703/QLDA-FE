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
    GradingService, // Đổi từ DeTaiService sang KeHoachService
    LoadingService,
    LocalStorageService,
    NotificationService,
    AccountService,
    DeTaiService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_Coupon, I_DeTai, I_Grading, I_GradingForm, I_User } from '#shared/types'; // Đổi sang I_KeHoach
import { formatDate, toPythonDate } from '#shared/utils';
import { group } from 'console';
import { Validators } from '@angular/forms';

const FORM_NAME = 'FORM_ADMIN_KEHOACH'; // Đổi tên form

@Component({
    standalone: true,
    selector: 'nextpro-admin-cham-huong-dan-detail',
    templateUrl: './cham-huong-dan-detail.component.html', // Đổi tên file template và style
    styleUrl: './cham-huong-dan-detail.component.scss', // Đổi tên file style
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
export class ChamHuongDanDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_GradingForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private gradingService: GradingService,
        private deTaiService: DeTaiService,
    ) {
        this.form.config = [
            {
                label: 'Đề tài',
                name: 'detai',
                fieldType: E_FieldType.SELECT,
                getOptions: () =>
                    this.deTaiService.getDeTais().then((res) => {
                        // Lọc và map danh sách admin ra option
                        const gvOptions = res.data
                            .filter((item) => item.trangthai === "1" && item.idnhom !== null)
                            .map((item: I_DeTai) => ({
                                label: item.tendoan,
                                value: item.id,
                            }));
                        return [
                            ...gvOptions,
                        ];
                    }),
            },
            {
                label: 'Điểm hướng dẫn',
                name: 'diemHuongdan',
                validate: [
                    { rule: Validators.required, message: 'Điểm phản biện là bắt buộc.' },
                    { rule: Validators.min(0), message: 'Điểm không thể nhỏ hơn 0.' },
                    { rule: Validators.max(10), message: 'Điểm không thể lớn hơn 10.' },
                ],
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_Grading; // Đổi sang I_KeHoach
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
                const chamHuongDanDetail = this.data;

                this.form.patchValue({
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    detaiId: values.detai,
                    diemHuongdan: values.diemHuongdan,
                },
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { createGrading } = await this.gradingService.createGrading({
                    input: {
                        ...variables.input,
                    },
                });

                if (createGrading.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(createGrading.error?.message);
                }
            } else {
                const { updateGrading } = await this.gradingService.updateGrading({
                    id: this.data.id,
                    input: variables.input,
                });

                if (updateGrading.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(updateGrading.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
