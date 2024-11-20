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
                name: 'contactPersonContainer',
                class: 'grid gap-2 grid-cols-1 lg:grid-cols-3',
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.FIELDSET,
                label: 'auth.register.become-buyer.form-buyer.contactPerson',
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
    @Input() data: I_Buyer;
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
        this.updateProfileHeader(changes?.data?.currentValue);

        switch (changes?.mode?.currentValue) {
            case E_Form_Mode.CREATE: {
                this.form.reset();
                this.form.mutate({
                    enableAll: [
                        'companyFullName',
                        'companyAddress',
                        'industries',
                        'companyLogo',
                        'companyCountry',
                        'companyCountryState',
                        'companyTax',
                        'companyNumberOfEmployee',
                        'currency',
                        'fullName',
                        'gender',
                        'position',
                        'email',
                        'phone',
                        'picture',
                        'password',
                        'confirmPassword',
                        'companyReferralCode',
                    ],
                });
                this.buyerNumber = null;
                this.profile = null;
                this.registerDate = new Date();
                break;
            }
            case E_Form_Mode.READ: {
                this.form.mutate({
                    disableAll: [
                        'companyFullName',
                        'companyAddress',
                        'industries',
                        'companyLogo',
                        'companyCountry',
                        'companyCountryState',
                        'companyTax',
                        'companyNumberOfEmployee',
                        'currency',
                        'fullName',
                        'gender',
                        'position',
                        'email',
                        'phone',
                        'picture',
                        'password',
                        'confirmPassword',
                        'companyReferralCode',
                    ],
                });
                break;
            }
            case E_Form_Mode.UPDATE: {
                this.form.mutate({
                    disableAll: ['email', 'companyReferralCode'],
                    delete: ['password', 'confirmPassword'],
                });
                break;
            }
        }

        const oldData = this.localStorageService.get(FORM_NAME);

        if (oldData) {
            this.setFormData(oldData);
        } else if (changes?.data?.currentValue) {
            this.setFormData(changes.data.currentValue);
        }
    }

    updateProfileHeader = (values?: T_Any) => {
        this.buyerNumber = values?.username ?? null;
        this.profile = values?.profileFeatures?.name ?? null;
        this.registerDate = values?.created ?? new Date();
    };

    setFormData = async (values) => {
        this.form.patchValue({
            password: null,
            confirmPassword: null,
            companyFullName: values.companyFullName,
            companyTax: values.companyTax,
            companyAddress: values.companyAddress,
            companyCountry: values.companyCountry,
            companyCountryState: values.companyCountryState,
            companyNumberOfEmployee: values.companyNumberOfEmployee,
            companyReferralCode: values.companyReferralCode ?? '',
            gender: values.gender,
            phone: values.phone,
            position: values.position,
            currency: values.currency,
            email: values.email,
            fullName: values.fullName,
            companyLogo: values.companyLogo,
            picture: values.picture,
            industries: values.industries,
        });

        this.industriesSelected = values.industries;
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
        this.form.submit(async ({ confirmPassword, email, password, shortName }) => {
            // Kiểm tra xác thực mật khẩu
            if (password !== confirmPassword) {
                this.form.setFieldError('confirmPassword', 'VALIDATE_DESCRIPTION.password.notMatch');
                return;
            }

            // Chuẩn bị dữ liệu để gửi
            // Điều chỉnh dữ liệu submit để phù hợp với cấu trúc của mutation GraphQL
            const submitData = {
                user: {
                    email: email ?? '',
                    password: password ?? '',
                    shortName: shortName ?? '',
                    // Thêm các trường khác nếu cần cho mutation
                },
            };

            // Sửa đổi phần gọi AccountService để sử dụng mutation GraphQL
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
                        this.form.setFieldError('general', data?.buyerCreate?.error?.message || 'Lỗi không xác định');
                    }
                })
                .catch((error) => {
                    // Xử lý lỗi khi gửi request
                    this.form.setFieldError('general', error.message || 'Đã xảy ra lỗi khi tạo buyer');
                });
        }, FORM_NAME);
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
