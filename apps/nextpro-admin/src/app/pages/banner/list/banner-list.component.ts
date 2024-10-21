import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { BannerGroupService, LoadingService, RouteService, TableService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_QueryVariables } from '#shared/types';
import { getQueryVariables } from '#shared/utils';
import { I_BannerGroup } from 'shared/types/banner-group';
import { BannerDetailComponent } from '../detail/banner-detail.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-banner-list',
    templateUrl: './banner-list.component.html',
    styleUrl: './banner-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        RouterModule,
        BannerDetailComponent,
    ],
})
export class BannerListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_BannerGroup>,
        private routeService: RouteService,
        private bannerGroupService: BannerGroupService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'banner.name',
                name: 'name',
            },
            {
                label: 'banner.itemCode',
                name: 'itemCode',
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
                label: 'banner.no',
                render: (_, index) => {
                    return (this.table.state.pagination.page - 1) * this.table.state.pagination.pageSize + index + 1;
                },
            },
            {
                cellStyle: { width: '200px' },
                type: E_TableColumnType.IMAGE,
                name: 'bannerList[0].file',
                label: 'banner.file',
            },
            {
                cellStyle: { width: '200px' },
                type: E_TableColumnType.IMAGE,
                name: 'bannerList[0].fileMobile',
                label: 'banner.fileMobile',
            },
            {
                sort: 'itemCode',
                name: 'itemCode',
                label: 'banner.itemCode',
            },
            {
                sort: 'name',
                name: 'name',
                label: 'banner.name',
            },
            {
                name: 'description',
                label: 'banner.description',
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
