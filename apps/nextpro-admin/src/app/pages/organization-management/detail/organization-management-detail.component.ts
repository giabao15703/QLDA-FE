import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    BannerGroupService,
    FormService,
    LoadingService,
    LocalStorageService,
    NotificationService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode } from '#shared/types';
import { getFile } from '#shared/utils';
import { I_BannerGroup, I_BannerGroupForm } from 'shared/types/banner-group';

const FORM_NAME = 'FORM_ADMIN_BANNER';

@Component({
    standalone: true,
    selector: 'nextpro-admin-organization-management-detail',
    templateUrl: './organization-management-detail.component.html',
    styleUrl: './organization-management-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class OrganizationManagementDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_BannerGroupForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private bannerGroupService: BannerGroupService,
    ) {
        this.form.config = [
            {
                label: 'organizationManagement.organization',
                name: 'organization',
            },
            {
                label: 'organizationManagement.logo',
                name: 'logo',
                fieldType: E_FieldType.UPLOAD,
                showPreview: true,
            },
            {
                label: 'organizationManagement.banner',
                name: 'banner',
                fieldType: E_FieldType.UPLOAD,
                showPreview: true,
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
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_BannerGroup;
    @Input() onCloseDrawer;
    @Input() refetch;

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
                const bannerGroupDetail = this.data;

                this.form.patchValue({
                    file: await getFile(bannerGroupDetail.bannerList[0].file),
                    fileMobile: await getFile(bannerGroupDetail.bannerList[0].fileMobile),
                    itemCode: bannerGroupDetail.itemCode,
                    name: bannerGroupDetail.name,
                    description: bannerGroupDetail.description,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                itemCode: values.itemCode,
                name: values.name,
                description: values.description,
                bannerList: [],
            };

            if (values.file) {
                variables.bannerList.push({
                    file: values.file,
                });
            }

            if (values.fileMobile) {
                variables.bannerList.push({
                    fileMobile: values.fileMobile,
                });
            }

            if (this.mode === E_Form_Mode.CREATE) {
                const { bannerGroupBannerCreate } = await this.bannerGroupService.createBannerGroup({
                    input: variables,
                });

                if (bannerGroupBannerCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error(bannerGroupBannerCreate.errors?.[0].message);
                }
            } else {
                const { bannerGroupBannerUpdate } = await this.bannerGroupService.updateBannerGroup({
                    input: { id: this.data.id, ...variables },
                });

                if (bannerGroupBannerUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                } else {
                    this.notificationService.error(bannerGroupBannerUpdate.errors?.[0].message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
