import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    FormService,
    LoadingService,
    LocalStorageService,
    NotificationService,
    OurPartnerService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_OurPartner, I_OurPartnerForm } from '#shared/types';
import { getFile } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_OUR_PARTNER';

@Component({
    standalone: true,
    selector: 'nextpro-admin-our-partner-detail',
    templateUrl: './our-partner-detail.component.html',
    styleUrl: './our-partner-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, TableComponent, FormComponent],
})
export class OurPartnerDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_OurPartnerForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private ourpartnerData: OurPartnerService,
    ) {
        this.form.config = [
            {
                label: 'our-partners.title',
                name: 'title',
            },
            {
                label: 'our-partners.description',
                name: 'description',
            },
            {
                label: 'our-partners.validFrom',
                name: 'validFrom',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'our-partners.validTo',
                name: 'validTo',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'masterData.status',
                name: 'status',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'masterData.active',
                        value: true,
                    },
                    {
                        label: 'masterData.inactive',
                        value: false,
                    },
                ],
            },
            {
                label: 'our-partners.link',
                name: 'link',
            },
            {
                label: 'our-partners.logo',
                name: 'logo',
                fieldType: E_FieldType.UPLOAD,
                uploadType: 'single',
                disabled: false,
            },
            {
                label: 'our-partners.image',
                name: 'image',
                class: 'w-50',
                fieldType: E_FieldType.UPLOAD,
                uploadType: 'single',
                disabled: false,
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_OurPartner;
    @Input() onCloseDrawer;
    @Input() refetch;

    getImageUrl(filePath: string): string {
        return filePath;
    }

    ngOnInit() {
        const oldData = this.localStorageService.get(FORM_NAME);

        if (oldData) {
            this.form.patchValue(oldData);
        }
    }

    async ngOnChanges(changes) {
        if (changes?.mode?.currentValue === E_Form_Mode.CREATE) {
            this.form.reset();
        } else {
            if (this.data) {
                const ourPartnerDetail = this.data;

                this.form.patchValue({
                    title: ourPartnerDetail.title,
                    validFrom: ourPartnerDetail.validFrom,
                    validTo: ourPartnerDetail.validTo,
                    image: await getFile(ourPartnerDetail.image),
                    link: ourPartnerDetail.link,
                    logo: await getFile(ourPartnerDetail.logo),
                    status: ourPartnerDetail.status,
                    description: ourPartnerDetail.description,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                input: {
                    title: values.title,
                    validFrom: values.validFrom,
                    validTo: values.validTo,
                    image: values.image,
                    status: values.status,
                    link: values.link,
                    logo: values.logo,
                    description: values.description,
                },
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { ourPartnerCreate } = await this.ourpartnerData.createOurPartner({
                    ...variables,
                });

                if (ourPartnerCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(ourPartnerCreate.error?.message);
                }
            } else {
                const { ourPartnerUpdate } = await this.ourpartnerData.updateOurPartner({
                    id: this.data.id,
                    ...variables,
                });

                if (ourPartnerUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(ourPartnerUpdate.error?.message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
