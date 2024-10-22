/* import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    AccountService,
    AuthService,
    DeliveryService,
    FormService,
    LoadingService,
    LocalStorageService,
    MasterDataService,
    NotificationService,
    OrderService,
} from '#shared/services';
import {
    E_FieldType,
    E_Form_Mode,
    E_InputType,
    I_Buyer,
    I_City,
    I_GiangVien,
    I_GroupStudent,
    I_ShippingFee,
    I_ShippingFeeForm,
    I_User,
} from '#shared/types';
import { group } from 'console';

const FORM_NAME = 'FORM_ADMIN_DELIVERY_GROUP_STUDENT';

@Component({
    standalone: true,
    selector: 'nextpro-admin-group-detail',
    templateUrl: './group-detail.component.html',
    styleUrl: './group-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class GroupDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_GroupStudent>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private orderService: OrderService,
        private accountService: AccountService,
        private authService: AuthService,
    ) {
        this.form.config = [
            {
                label: 'Name',
                name: 'nameGroup',
            },
            {
                label: 'Buyer Name',
                name: 'members',
                fieldType: E_FieldType.SELECT,
                loadingName: 'getMembers',
                getOptions: () =>
                    this.accountService.getBuyers().then((res) => res.data.filter((item) => item.fullName)),
                mapOption: (item: I_Buyer) => ({
                    label: item.fullName,
                    value: item.id,
                }),
            },
            {
                label: 'GiangVien',
                name: 'giangVien',
                fieldType: E_FieldType.SELECT,
                loadingName: 'getGiangViens',
                getOptions: () =>
                    this.orderService.getGiangViens().then((res) => res.data.filter((item) => item.nameGiangVien)),
                mapOption: (item: I_GiangVien) => ({
                    label: item.nameGiangVien,
                    value: item.id,
                }),
            },
            {
                label: 'Status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'Active',
                        value: true,
                    },
                    {
                        label: 'Inactive',
                        value: false,
                    },
                ],
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_GroupStudent;
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
                const groupStudentDetail = this.data;

                this.form.patchValue({
                    nameGroup: groupStudentDetail.nameGroup,
                    members: groupStudentDetail.members,
                    giangVien: groupStudentDetail.giangVien,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const buyers = await this.accountService.getBuyers();
            const currentBuyer = buyers?.data?.[0];

            if (!currentBuyer) {
                this.notificationService.error('Buyer not found');
                return;
            }

            const userId = currentBuyer.id;

            const giangVienId = values.giangVien ? values.giangVien.id : undefined;

            const input: any = {
                nameGroup: values.nameGroup,
                members: values.members,
            };

            if (giangVienId) {
                input.giangVienId = giangVienId;
            }

            const variables = {
                input,
                userId,
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { createGroupStudent } = await this.orderService.createGroupStudent({
                    ...variables,
                });

                if (createGroupStudent?.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(createGroupStudent?.error?.message || 'Error creating group');
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
} */
