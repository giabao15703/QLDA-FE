import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    FormService,
    LoadingService,
    LocalStorageService,
    NotificationService,
    SaleSchemeService,
    UserGuideService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_Course, I_CourseForm, I_Module, I_ProfileFeaturesBuyer } from '#shared/types';
import { getFile } from '#shared/utils';

const FORM_NAME = 'FORM_ADMIN_USER_GUIDE_BUYER_COURSE';

@Component({
    standalone: true,
    selector: 'nextpro-admin-user-guide-buyer-course-detail',
    templateUrl: './course-detail.component.html',
    styleUrl: './course-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class UserGuideBuyerCourseDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_CourseForm>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private userGuideService: UserGuideService,
        private saleSchemeService: SaleSchemeService,
    ) {
        this.form.config = [
            {
                label: 'user-guide.moduleName',
                name: 'modules',
                loadingName: 'getModules',
                class: 'w-full',
                fieldType: E_FieldType.SELECT,
                getOptions: () => this.userGuideService.getModules().then((res) => res.data),
                mapOption: (item: I_Module) => ({
                    label: item.name,
                    value: item.id,
                }),
            },
            {
                label: 'user-guide.courseName',
                name: 'name',
            },
            {
                label: 'user-guide.profileFeature',
                name: 'profileLevel',
                loadingName: 'getProfileFeaturesBuyer',
                fieldType: E_FieldType.SELECT,
                multiple: true,
                getOptions: () => this.saleSchemeService.getProfileFeaturesBuyer().then((res) => res.data),
                mapOption: (item: I_ProfileFeaturesBuyer) => ({
                    label: item.name,
                    value: item.id,
                }),
            },
            {
                label: 'user-guide.status',
                name: 'status',
                class: 'w-full',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'user-guide.active',
                        value: true,
                    },
                    {
                        label: 'user-guide.inactive',
                        value: false,
                    },
                ],
            },
            {
                label: 'user-guide.video',
                name: 'video',
                fieldType: E_FieldType.UPLOAD,
                showPreview: true,
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_Course;
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
                const courseDetail = this.data;

                this.form.patchValue({
                    modules: courseDetail.modules?.id,
                    name: courseDetail.name,
                    profileLevel: courseDetail.coursesprofilefeaturesbuyerSet?.edges.map(
                        (item) => item.node.profileFeatures.id,
                    ),
                    status: courseDetail.status,
                    video: await getFile(courseDetail.video),
                });
            }
        }
    }

    handleSave = async () => {
        this.form.submit(async (values) => {
            const variables = {
                name: values.name,
                modules: values.modules,
                profileLevelType: 'buyer',
                profileLevel: values.profileLevel,
                status: values.status,
                role: 2,
                video: values.video,
            };

            if (this.mode === E_Form_Mode.CREATE) {
                const { coursesCreate } = await this.userGuideService.createCourse({
                    courses: variables,
                });

                if (coursesCreate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.createSuccessfully');
                } else {
                    this.notificationService.error('notification.error');
                }
            } else {
                const { coursesUpdate } = await this.userGuideService.updateCourse({
                    id: this.data.id,
                    courses: variables,
                    isDelete: false,
                });

                if (coursesUpdate.status) {
                    this.localStorageService.remove(FORM_NAME);
                    this.notificationService.success('notification.updateSuccessfully');
                } else {
                    this.notificationService.error('notification.error');
                }
            }

            this.refetch();
        }, FORM_NAME);
    };
}
