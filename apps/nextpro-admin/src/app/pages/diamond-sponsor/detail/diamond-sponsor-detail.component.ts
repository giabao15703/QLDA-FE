import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    DiamondSponsorDataService,
    FormService,
    LoadingService,
    LocalStorageService,
    NotificationService,
} from '#shared/services';
import {
    E_FieldAppearance,
    E_FieldType,
    E_Form_Mode,
    I_UserDiamondSponsor,
    I_UserDiamondSponsorForm,
} from '#shared/types';
import { getFile } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_DIAMOND_SPONSOR';

@Component({
    standalone: true,
    selector: 'nextpro-admin-diamond-sponsor-detail',
    templateUrl: './diamond-sponsor-detail.component.html',
    styleUrl: './diamond-sponsor-detail.component.scss',
    providers: [FormService],
    imports: [
        CommonModule,
        TranslateModule,
        LoadingComponent,
        MaterialModules,
        FormComponent,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
    ],
})
export class DiamondSponsorDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_UserDiamondSponsorForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private userDiamondSponsorDataService: DiamondSponsorDataService,
    ) {
        this.form.config = [
            {
                fieldType: E_FieldType.UPLOAD,
                name: 'image',
                disabled: true,
            },
            {
                label: 'diamond-sponsor.productName',
                name: 'productName',
                disabled: true,
            },
            {
                label: 'diamond-sponsor.description',
                name: 'description',
                disabled: true,
            },
            {
                label: 'diamond-sponsor.validFrom',
                name: 'validFrom',
                fieldType: E_FieldType.DATEPICKER,
                appearance: E_FieldAppearance.OUTLINE,
                disabled: true,
            },
            {
                label: 'diamond-sponsor.validTo',
                name: 'validTo',
                fieldType: E_FieldType.DATEPICKER,
                appearance: E_FieldAppearance.OUTLINE,
                disabled: true,
            },
            {
                label: 'diamond-sponsor.companyName',
                name: 'companyFullName',
                disabled: true,
            },
            {
                label: 'diamond-sponsor.status',
                name: 'isActive',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'coupon.active',
                        value: true,
                    },
                    {
                        label: 'coupon.inactive',
                        value: false,
                    },
                ],
                disabled: true,
            },
            {
                label: 'diamond-sponsor.isConfirm',
                name: 'isConfirmed',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'diamond-sponsor.pending',
                        value: 2,
                    },
                    {
                        label: 'diamond-sponsor.approve',
                        value: 1,
                    },
                    {
                        label: 'diamond-sponsor.reject',
                        value: 3,
                    },
                ],
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_UserDiamondSponsor;
    @Input() onCloseDrawer;
    @Input() refetch;

    ngOnInit() {
        const oldData = this.localStorageService.get(FORM_NAME);

        if (oldData) {
            this.form.patchValue(oldData);
        }
    }

    async ngOnChanges(changes) {
        if (changes?.mode?.currentValue !== E_Form_Mode.CREATE) {
            if (this.data) {
                const userDiamondSponsorDetail = this.data;

                this.form.patchValue({
                    image: await getFile(userDiamondSponsorDetail.image),
                    productName: userDiamondSponsorDetail.productName,
                    description: userDiamondSponsorDetail.description,
                    validFrom: userDiamondSponsorDetail.validFrom,
                    validTo: userDiamondSponsorDetail.validTo,
                    companyFullName: userDiamondSponsorDetail.user.supplier?.companyFullName,
                    isActive: userDiamondSponsorDetail.isActive,
                    isConfirmed: userDiamondSponsorDetail.isConfirmed,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                isConfirmed: values.isConfirmed,
            };

            if (this.mode === E_Form_Mode.UPDATE) {
                const { userDiamondSponsorUpdate } = await this.userDiamondSponsorDataService.updateUserDiamondSponsor({
                    id: this.data.id,
                    input: variables,
                });

                if (userDiamondSponsorUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                } else {
                    this.notificationService.error(userDiamondSponsorUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
