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
    selector: 'nextpro-admin-banner-detail',
    templateUrl: './banner-detail.component.html',
    styleUrl: './banner-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class BannerDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_BannerGroupForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private bannerGroupService: BannerGroupService,
    ) {
        this.form.config = [
            {
                label: 'banner.file',
                name: 'file',
                fieldType: E_FieldType.UPLOAD,
                showPreview: true,
            },
            {
                label: 'banner.fileMobile',
                name: 'fileMobile',
                fieldType: E_FieldType.UPLOAD,
                showPreview: true,
            },
            {
                label: 'banner.itemCode',
                name: 'itemCode',
            },
            {
                label: 'banner.name',
                name: 'name',
            },
            {
                label: 'banner.description',
                name: 'description',
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

            const bannerItem = {
                file: values.file || undefined,
                fileMobile: values.fileMobile || undefined,
            };

            if (bannerItem.file || bannerItem.fileMobile) {
                variables.bannerList.push(bannerItem);
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
                    this.onCloseDrawer();
                } else {
                    this.notificationService.error(bannerGroupBannerUpdate.errors?.[0].message);
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
