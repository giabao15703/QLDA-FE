import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { BannerGroupService, LoadingService, RouteService, TableService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_QueryVariables } from '#shared/types';
import { getQueryVariables } from '#shared/utils';
import { I_BannerGroup } from 'shared/types/banner-group';
import { OrganizationManagementDetailComponent } from '../detail/organization-management-detail.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-organization-management-list',
    templateUrl: './organization-management-list.component.html',
    styleUrl: './organization-management-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        RouterModule,
        OrganizationManagementDetailComponent,
    ],
})
export class OrganizationManagementListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_BannerGroup>,
        private routeService: RouteService,
        private translateService: TranslateService,
        private bannerGroupService: BannerGroupService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'organizationManagement.organization',
                name: 'organization',
            },
        ];
        this.table.config.columns = [
            {
                cellStyle: { width: '50px' },
                type: E_TableColumnType.SELECTION,
                name: 'selection',
            },
            {
                cellStyle: { width: '50px' },
                name: 'no',
                label: 'banner.no',
                render: (_, index) => {
                    return (this.table.state.pagination.page - 1) * this.table.state.pagination.pageSize + index + 1;
                },
            },
            {
                sort: 'organization',
                name: 'organization',
                label: 'organizationManagement.organization',
            },
            {
                cellStyle: { width: '200px' },
                type: E_TableColumnType.IMAGE,
                name: 'bannerList[0].file',
                label: 'organizationManagement.logo',
            },
            {
                cellStyle: { width: '200px' },
                type: E_TableColumnType.IMAGE,
                name: 'bannerList[0].fileMobile',
                label: 'organizationManagement.banner',
            },
            {
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'coupon.status',
                render: (cell) => {
                    return `<div class="text-white text-center p-[10px] bg-${cell ? 'active' : 'inactive'}">
                    ${this.translateService.instant(cell ? 'masterData.active' : 'masterData.inactive')}
                    </div>`;
                },
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'action',
                label: 'banner.action',
                ctas: [
                    {
                        icon: 'edit',
                        onClick: (row: I_BannerGroup) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getBannerGroups;

        this.routeService.onChange(({ hash }) => {
            this.getBannerGroup(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getBannerGroup();
        this.getBannerGroups();
    }

    getBannerGroup = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.bannerGroupService.getBannerGroup({
                    id,
                }),
        });
    };

    getBannerGroups = async (variables?: I_QueryVariables) => {
        const bannerGroupList = await this.bannerGroupService.getBannerGroups(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        this.table.state.data = bannerGroupList.data;
        this.table.state.pagination = bannerGroupList.pagination;
        this.table.state.selection?.clear();
    };

    handleCreate = () => {
        this.routeService.goTo({ mode: E_Form_Mode.CREATE });
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash();
        this.detail = null;
    };
}
