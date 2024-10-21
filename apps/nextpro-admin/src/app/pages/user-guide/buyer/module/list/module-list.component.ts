import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, NotificationService, RouteService, TableService, UserGuideService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_Module, I_QueryVariables } from '#shared/types';
import { getQueryVariables } from '#shared/utils';
import { UserGuideBuyerModuleDetailComponent } from '../detail/module-detail.component';

const TAB_NAME = 'module';

@Component({
    standalone: true,
    selector: 'nextpro-admin-user-guide-buyer-module-list',
    templateUrl: './module-list.component.html',
    styleUrl: './module-list.component.scss',
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        UserGuideBuyerModuleDetailComponent,
        RouterModule,
    ],
    providers: [TableService],
})
export class UserGuideBuyerModuleListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Module>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private userGuideService: UserGuideService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'user-guide.name',
                name: 'name_Icontains',
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
                sort: 'name',
                name: 'name',
                label: 'user-guide.name',
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
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'action',
                label: 'user-guide.edit',
                ctas: [
                    {
                        text: '',
                        icon: 'edit',
                        onClick: (row: I_Module) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getModules;

        this.routeService.onChange(({ hash }) => {
            this.getModule(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getModule();
        this.getModules();
    }

    getModule = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            tab: TAB_NAME,
            hash,
            detail: ({ id }) =>
                this.userGuideService.getModule({
                    id,
                }),
        });
    };

    getModules = async (variables?: I_QueryVariables) => {
        const modules = await this.userGuideService.getModules(
            {
                ...getQueryVariables({ variables }),
                role: '2',
            },
            { extra: { variables } },
        );

        this.table.state.data = modules.data;
        this.table.state.pagination = modules.pagination;
        this.table.state?.selection?.clear();
    };

    handleUpdateStatus = async (status) => {
        const selectedModules = this.table.state.selection.selected;
        const { modulesUpdateStatus } = await this.userGuideService.updateModuleStatus({
            listStatus: selectedModules.map((module) => ({
                modulesId: module.id,
                status,
            })),
        });

        if (modulesUpdateStatus.status) {
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
