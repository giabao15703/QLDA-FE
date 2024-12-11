import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
    REGEX_ALPHANUMERIC,
    REGEX_EMAIL,
    REGEX_NO_NUMBERS_SPECIAL,
    REGEX_NUMERIC_SPACE_PLUS_MINUS,
} from '#shared/constants';
import { MaterialModules } from '#shared/modules';
import {
    AccountService,
    FormService,
    LoadingService,
    LocalStorageService,
    MasterDataService,
    ModalService,
    NotificationService,
    PromotionService,
} from '#shared/services';
import {
    E_ContainerType,
    E_FieldType,
    E_Form_Mode,
    E_InputType,
    I_Buyer,
    I_City,
    I_Country,
    I_Currency,
    I_Gender,
    I_Industry,
    I_NumberOfEmployee,
    I_User,
    T_Any,
} from '#shared/types';
import { translateData } from '#shared/utils';
import { FormComponent } from '../../../form/form.component';
import { IndustrySelectComponent } from '../../../industry-select/industry-select.component';
import { LoadingComponent } from '../../../loading/loading.component';
import { TableComponent } from '../../../table/table.component';
import { HttpClient } from '@angular/common/http';

const FORM_NAME = 'ACCOUNT_BUYER_BASIC_INFORMATION_FORM';

@Component({
    standalone: true,
    selector: 'app-account-buyer-basic-information-form',
    templateUrl: './basic-information-form.component.html',
    styleUrl: './basic-information-form.component.scss',
    encapsulation: ViewEncapsulation.None,
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, TableComponent, FormComponent],
})
export class BuyerBasicInformationFormComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService,
        private modalService: ModalService,
        private localStorageService: LocalStorageService,
        private promotionService: PromotionService,
        private masterDataService: MasterDataService,
        private accountService: AccountService,
        private translateService: TranslateService,
        private http: HttpClient,
        private notificationService: NotificationService,
    ) {
        this.translateService.use(JSON.parse(localStorage.getItem('languageCode') || 'en') === 'vi' ? 'vi' : 'en');
        this.form.config = [
            {
                name: '',
                class: 'grid gap-2 grid-cols-1 lg:grid-cols-3',
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.FIELDSET,
                label: 'Thông tin tài khoản sinh viên',
                children: [
                    {
                        label: 'auth.register.become-buyer.form-buyer.fullName',
                        placeholder: 'auth.register.become-buyer.form-buyer.fullName',
                        name: 'shortName',
                        maxLength: 255,
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.shortName.required',
                            },
                            {
                                rule: Validators.pattern(REGEX_NO_NUMBERS_SPECIAL),
                                message: 'VALIDATE_DESCRIPTION.shortName.pattern',
                            },
                        ],
                    },
                    {
                        label: 'auth.register.become-buyer.form-buyer.email',
                        placeholder: 'auth.register.become-buyer.form-buyer.email',
                        name: 'email',
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.email.required',
                            },
                            {
                                rule: Validators.pattern(REGEX_EMAIL),
                                message: 'VALIDATE_DESCRIPTION.email.pattern',
                            },
                        ],
                    },
                    {
                        label: 'auth.register.become-buyer.form-buyer.phone',
                        placeholder: 'auth.register.become-buyer.form-buyer.phone',
                        name: 'phone',
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.phone.required',
                            },
                            {
                                rule: Validators.pattern(REGEX_NUMERIC_SPACE_PLUS_MINUS),
                                message: 'VALIDATE_DESCRIPTION.phone.pattern',
                            },
                        ],
                    },
                    {
                        name: 'ngaySinh',
                        label: 'Ngày sinh',
                        fieldType: E_FieldType.DATEPICKER,
                    },
                    {
                        name: 'noiSinh',
                        label: 'Nơi sinh',
                    },
                    {
                        name: 'mssv',
                        label: 'MSSV',
                    },
                    {
                        name: 'lop',
                        label: 'Lớp',
                    },
                    {
                        name: 'gender',
                        label: 'Giới tính',
                    },
                    {
                        name: 'picture',
                        label: 'Ảnh',
                        fieldType: E_FieldType.UPLOAD,
                    },
                    {
                        name: 'khoaHoc',
                        label: 'Khóa học',
                    },
                    {
                        name: 'loaiHinhDaoTao',
                        label: 'Loại hình đào tạo',
                    },
                    {
                        name: 'bacDaoTao',
                        label: 'Bậc đào tạo',
                    },
                    {
                        name: 'nganh',
                        label: 'Ngành',
                    },
                    {
                        label: 'auth.register.become-buyer.form-buyer.password',
                        placeholder: 'auth.register.become-buyer.form-buyer.password',
                        name: 'password',
                        inputType: E_InputType.PASSWORD,
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.password.required',
                            },
                        ],
                    },
                    {
                        label: 'auth.register.become-buyer.form-buyer.confirmPassword',
                        placeholder: 'auth.register.become-buyer.form-buyer.confirmPassword',
                        name: 'confirmPassword',
                        inputType: E_InputType.PASSWORD,
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.confirmPassword.required',
                            },
                        ],
                    },
                ],
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_User;
    @Input() onSave: (values, callback) => void;
    @Input() showTerms: boolean = false;
    @Input() showMainInfo: boolean = false;
    @Input() isLoading: boolean;

    buyerNumber: string;
    profile: string;
    registerDate = new Date();
    industriesSelected: I_Industry[] = [];
    language: string;
    isTermAccept = false;

    get buttonText(): string {
        const buttonTextMap = {
            [E_Form_Mode.CREATE]: 'button.create',
            [E_Form_Mode.UPDATE]: 'button.update',
        };

        return buttonTextMap[this.mode] || '';
    }

    ngOnInit() {
        this.masterDataService.getLanguages().then((languages) => (this.language = languages?.data?.[0]?.id));
    }

    ngOnChanges(changes) {
        if (changes?.mode?.currentValue === E_Form_Mode.CREATE) {
            this.form.reset();
        } else {
            if (this.data) {
                const userDetail = this.data;

                this.form.patchValue({
                    mssv: userDetail.mssv,
                    shortName: userDetail.shortName,
                });
            }
        }
    }
    updateProfileHeader = (values?: T_Any) => {
        this.buyerNumber = values?.username ?? null;
        this.profile = values?.profileFeatures?.name ?? null;
        this.registerDate = values?.created ?? new Date();
    };

    onTermAcceptChange = (event) => {
        this.isTermAccept = event.checked;
    };

    openIndustryDialog = () => {
        this.modalService.show({
            modal: {
                height: 'auto',
                title: 'auth.register.become-buyer.form-buyer.industry',
                content: IndustrySelectComponent,
                footer: {
                    onSubmit: (industriesSelected: I_Industry[]) => {
                        this.form.getField('industries').setValue(
                            industriesSelected.map((industry) => ({
                                label: industry.name,
                                value: industry.id,
                            })),
                        );

                        this.industriesSelected = industriesSelected;
                        this.modalService.hide();
                    },
                },
            },
            data: {
                industriesSelected: this.industriesSelected,
            },
        });
    };

    handleSave = () => {
        this.form.submit(
            async ({
                confirmPassword,
                email,
                password,
                shortName,
                phone,
                lop,
                bacDaoTao,
                khoaHoc,
                loaiHinhDaoTao,
                ngaySinh,
                noiSinh,
                nganh,
                gender,
                picture,
                mssv,
            }) => {
                if (password !== confirmPassword) {
                    this.form.setFieldError('confirmPassword', 'VALIDATE_DESCRIPTION.password.notMatch');
                    return;
                }
                const submitData = {
                    user: {
                        email: email ?? '',
                        password: password ?? '',
                        shortName: shortName ?? '',
                        phone: phone ?? '',
                        lop: lop ?? '',
                        bacDaoTao: bacDaoTao ?? '',
                        khoaHoc: khoaHoc ?? '',
                        loaiHinhDaoTao: loaiHinhDaoTao ?? '',
                        ngaySinh: ngaySinh ? new Date(ngaySinh).toISOString().split('T')[0] : '',
                        noiSinh: noiSinh ?? '',
                        nganh: nganh ?? '',
                        gender: gender ?? '',
                        picture: picture ?? '',
                        mssv: mssv ?? '',
                    },
                };

                this.accountService
                    .createBuyer(submitData) // Gọi mutation GraphQL
                    .then((response: any) => {
                        const data = response.data;
                        if (data?.buyerCreate?.status) {
                            // Tạo buyer thành công, xử lý trường hợp thành công
                            this.localStorageService.remove(FORM_NAME);
                            console.log('Buyer được tạo thành công:', data.buyerCreate);
                        } else {
                            // Xử lý lỗi từ phản hồi mutation
                            this.form.setFieldError(
                                'general',
                                data?.buyerCreate?.error?.message || 'Lỗi không xác định',
                            );
                        }
                    })
                    .catch((error) => {
                        // Xử lý lỗi khi gửi request
                        this.form.setFieldError('general', error.message || 'Đã xảy ra lỗi khi tạo buyer');
                    });
            },
            FORM_NAME,
        );
    };
    handleUpdate = () => {
        this.form.submit(
            async ({
                confirmPassword,
                email,
                password,
                shortName,
                phone,
                lop,
                bacDaoTao,
                khoaHoc,
                loaiHinhDaoTao,
                ngaySinh,
                noiSinh,
                nganh,
                gender,
                picture,
                mssv,
            }) => {
                if (password !== confirmPassword) {
                    this.form.setFieldError('confirmPassword', 'VALIDATE_DESCRIPTION.password.notMatch');
                    return;
                }

                const submitData = {
                    user: {
                        email: email ?? '',
                        password: password ?? '',
                        shortName: shortName ?? '',
                        phone: phone ?? '',
                        lop: lop ?? '',
                        bacDaoTao: bacDaoTao ?? '',
                        khoaHoc: khoaHoc ?? '',
                        loaiHinhDaoTao: loaiHinhDaoTao ?? '',
                        ngaySinh: ngaySinh ? new Date(ngaySinh).toISOString().split('T')[0] : '',
                        noiSinh: noiSinh ?? '',
                        nganh: nganh ?? '',
                        gender: gender ?? '',
                        picture: picture ?? '',
                        mssv: mssv ?? '',
                    },
                    userId: this.data?.id ?? '',
                };

                this.accountService
                    .updateBuyer(submitData)
                    .then((response: any) => {
                        const data = response.data;
                        if (data?.buyerUpdate?.status) {
                            this.notificationService.success('Thông tin buyer đã được cập nhật.');
                        } else {
                            this.form.setFieldError(
                                'general',
                                data?.buyerUpdate?.error?.message || 'Lỗi không xác định',
                            );
                        }
                    })
                    .catch((error) => {
                        this.form.setFieldError('general', error.message || 'Đã xảy ra lỗi khi cập nhật buyer');
                    });
            },
            FORM_NAME,
        );
    };
    selectedFile: File | null = null;

    onFileChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    uploadFile() {
        if (!this.selectedFile) {
            alert('Vui lòng chọn file!');
            return;
        }

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        const headers = { 'X-CSRFToken': this.getCsrfToken() };

        this.http.post('http://localhost:8000/api/import-students/', formData, { headers }).subscribe(
            (response: any) => {
                console.log('Response:', response); // Log phản hồi từ server để kiểm tra

                if (response && response.status === 'success') {
                    this.notificationService.success(response.message || 'File đã được upload thành công!');
                } else if (response && response.status === 'error') {
                    // Nếu không import được tài khoản nào
                    if (response.message.includes('Không có tài khoản nào được import')) {
                        this.notificationService.error(response.message || 'Tất cả tài khoản đã tồn tại!');
                    } else {
                        this.notificationService.error(response.message || 'Đã xảy ra lỗi khi upload file!');
                    }
                } else {
                    console.error('Unexpected response format:', response);
                    this.notificationService.error('Đã xảy ra lỗi khi upload file!');
                }
            },
            (error) => {
                console.error('Error during file upload:', error); // Log chi tiết lỗi
                this.notificationService.error('Đã xảy ra lỗi khi upload file!');
            },
        );
    }

    getCsrfToken(): string {
        const match = document.cookie.match(/csrftoken=([\w-]+)/);
        return match ? match[1] : '';
    }
}
