import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    LoadingService,
    NotificationService,
    RouteService,
    SaleSchemeService,
    TableService,
    UserGuideService,
} from '#shared/services';
import {
    E_FieldType,
    E_Form_Mode,
    E_TableColumnType,
    I_Course,
    I_ProfileFeaturesBuyer,
    I_QueryVariables,
} from '#shared/types';
import { getQueryVariables } from '#shared/utils';
import { UserGuideBuyerCourseDetailComponent } from '../detail/course-detail.component';

const TAB_NAME = 'course';

@Component({
    standalone: true,
    selector: 'nextpro-admin-user-guide-buyer-course-list',
    templateUrl: './course-list.component.html',
    styleUrl: './course-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        UserGuideBuyerCourseDetailComponent,
        RouterModule,
    ],
})
export class UserGuideBuyerCourseListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Course>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private userGuideService: UserGuideService,
        private saleSchemeService: SaleSchemeService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'user-guide.moduleName',
                name: 'modulesName',
            },
            {
                label: 'user-guide.courseName',
                name: 'name_Icontains',
            },
            {
                label: 'user-guide.profileLevel',
                name: 'profileFeaturesBuyer',
                loadingName: 'getProfileFeaturesBuyer',
                fieldType: E_FieldType.SELECT,
                multiple: true,
                getOptions: () => this.saleSchemeService.getProfileFeaturesBuyer().then((res) => res.data),
                mapOption: (item: I_ProfileFeaturesBuyer) => ({
                    label: item.name,
                    value: item.id,
                }),
            },
        ];
        this.table.config.columns = [
            {
                cellStyle: { width: '50px' },
                sticky: 'left',
                type: E_TableColumnType.SELECTION,
                name: 'selection',
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'left',
                name: 'no',
                label: 'user-guide.noP',
                render: (_, index) => {
                    return (this.table.state.pagination.page - 1) * this.table.state.pagination.pageSize + index + 1;
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'modules__name',
                name: 'modules.name',
                label: 'user-guide.moduleName',
            },
            {
                cellStyle: { width: '200px' },
                sort: 'name',
                name: 'name',
                label: 'user-guide.courseName',
            },
            {
                cellStyle: { width: '200px' },
                name: 'profileLevel',
                label: 'user-guide.profileLevel',
                render(_, __, row) {
                    const lst = row?.coursesprofilefeaturesbuyerSet?.edges;
                    let str = '';
                    lst?.forEach((element) => {
                        str += element.node.profileFeatures.name + ', ';
                    });
                    return str.slice(0, -2);
                },
            },
            {
                cellStyle: { width: '200px' },
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'user-guide.status',
                render: (cell) => {
                    return `<div class="text-white text-center p-[10px] bg-${cell ? 'active' : 'inactive'}">
                    ${this.translateService.instant(cell ? 'user-guide.active' : 'user-guide.inactive')}
                    </div>`;
                },
            },
            {
                cellStyle: { width: '50px' },
                sort: 'video',
                type: E_TableColumnType.ACTION,
                name: 'video',
                label: 'user-guide.video',
                ctas: [
                    {
                        text: '',
                        icon: 'videocam',
                        shouldShow: (row: I_Course) => !!row?.video,
                        onClick: () => {},
                    },
                ],
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'action',
                label: 'user-guide.edit',
                ctas: [
                    {
                        text: '',
                        icon: 'edit',
                        onClick: (row: I_Course) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getCourses;

        this.routeService.onChange(({ hash }) => {
            this.getCourse(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getCourse();
        this.getCourses();
    }

    getCourse = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            tab: TAB_NAME,
            hash,
            detail: ({ id }) =>
                this.userGuideService.getCourse({
                    id,
                }),
        });
    };

    getCourses = async (variables?: I_QueryVariables) => {
        const courses = await this.userGuideService.getCourses(
            {
                ...getQueryVariables({ variables }),
                role: '2',
            },
            { extra: { variables } },
        );

        this.table.state.data = courses.data;
        this.table.state.pagination = courses.pagination;
        this.table.state.selection?.clear();
    };

    handleFilter = (values) => {
        this.table.handleFilter({
            ...values,
            ...(values.profileFeaturesBuyer && {
                profileFeaturesBuyer: values.profileFeaturesBuyer.join(','),
            }),
        });
    };

    handleUpdateStatus = async (status) => {
        const selectedCourse = this.table.state.selection.selected;
        const { coursesUpdateStatus } = await this.userGuideService.updateCourseStatus({
            listStatus: selectedCourse.map((course) => ({
                coursesId: course.id,
                status,
            })),
        });

        if (coursesUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error('notification.error');
        }
    };

    handleCreate = () => {
        this.routeService.goTo({ mode: E_Form_Mode.CREATE, prefix: TAB_NAME });
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash({ prefix: TAB_NAME });
        this.detail = null;
    };
}
