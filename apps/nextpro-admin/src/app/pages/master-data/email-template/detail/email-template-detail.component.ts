import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    FormService,
    LoadingService,
    LocalStorageService,
    MasterDataService,
    NotificationService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_EmailTemplate } from '#shared/types';
import { translateData } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_MASTER_DATA_EMAIL_TEMPLATE';

@Component({
    standalone: true,
    selector: 'nextpro-admin-email-detail',
    templateUrl: './email-template-detail.component.html',
    styleUrl: './email-template-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, TableComponent, FormComponent],
})
export class EmailTemplateDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private masterDataService: MasterDataService,
    ) {
        this.form.config = [
            {
                label: 'masterData.titleEn',
                name: 'titleEn',
            },
            {
                label: 'masterData.contentEn',
                name: 'contentEn',
                fieldType: E_FieldType.TEXT_EDITOR,
            },
            {
                label: 'masterData.titleVi',
                name: 'titleVi',
            },
            {
                label: 'masterData.contentVi',
                name: 'contentVi',
                fieldType: E_FieldType.TEXT_EDITOR,
            },
            {
                label: 'masterData.itemCode',
                name: 'itemCode',
            },
            {
                label: 'masterData.variables',
                name: 'variables',
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_EmailTemplate;
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
                const emailTemplateDetail = this.data;
                this.form.patchValue({
                    titleEn: translateData(emailTemplateDetail, 'en', 'title'),
                    titleVi: translateData(emailTemplateDetail, 'vi', 'title'),
                    contentVi: translateData(emailTemplateDetail, 'vi', 'content'),
                    contentEn: translateData(emailTemplateDetail, 'en', 'content'),
                    itemCode: emailTemplateDetail.itemCode,
                    variables: emailTemplateDetail.variables,
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variablesInput = {
                input: {
                    emailTemplatesLanguages: [
                        {
                            title: values.titleEn,
                            content: values.contentEn,
                            languageCode: 'en',
                        },
                        {
                            title: values.titleVi,
                            content: values.contentVi,
                            languageCode: 'vi',
                        },
                    ],
                    itemCode: values.itemCode,
                    variables: values.variables,
                    status: true,
                },
            };
            if (this.mode === E_Form_Mode.CREATE) {
                const { emailTemplatesCreate } = await this.masterDataService.createEmailTemplate({
                    ...variablesInput,
                });

                if (emailTemplatesCreate.status) {
                    this.notificationService.success('notification.createSuccessfully');
                    this.localStorageService.remove(FORM_NAME);
                    this.onCloseDrawer();
                }
            } else {
                const { emailTemplatesUpdate } = await this.masterDataService.updateEmailTemplate({
                    id: this.data.id,
                    ...variablesInput,
                });

                if (emailTemplatesUpdate.status) {
                    this.notificationService.success('notification.updateSuccessfully');
                    this.localStorageService.remove(FORM_NAME);
                    this.onCloseDrawer();
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
