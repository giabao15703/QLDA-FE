import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService, NotificationService, RouteService, TableService } from '#shared/services';
import { E_Form_Mode, E_TableColumnType, I_IndustrySubSector, I_QueryVariables } from '#shared/types';
import { getQueryVariables, translateData } from '#shared/utils';
import { IndustrySubSectorDetailComponent } from '../detail/industry-sub-sector-detail.component';

const TAB_NAME = 'subsector';

@Component({
    standalone: true,
    selector: 'nextpro-admin-industry-sub-sector-list',
    templateUrl: './industry-sub-sector-list.component.html',
    styleUrl: './industry-sub-sector-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        IndustrySubSectorDetailComponent,
        RouterModule,
    ],
})
export class IndustrySubSectorListComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_IndustrySubSector>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private masterDataService: MasterDataService,
    ) {
        this.table.config.filterForm = [
            {
                wrapperClass: 'w-[300px]',
                label: 'masterData.industrySubSectorNameEn',
                name: 'name',
            },
            {
                label: 'masterData.industrySubSectorNameVi',
                name: 'nameVi',
            },
            {
                label: 'masterData.code',
                name: 'itemCode_Icontains',
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
                label: 'masterData.no',
                render: (_, index) => {
                    return (this.table.state.pagination.page - 1) * this.table.state.pagination.pageSize + index + 1;
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'parent_name',
                name: 'industrySectorNameEn',
                label: 'masterData.industrySectorNameEn',
                render: (_, __, row) => {
                    return translateData(row.industrySectors, 'en', 'name');
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'subParentName',
                name: 'industrySectorNameVi',
                label: 'masterData.industrySectorNameVi',
                render: (_, __, row) => {
                    return translateData(row.industrySectors, 'vi', 'name');
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'name',
                name: 'industrySubSectorNameEn',
                label: 'masterData.industrySubSectorNameEn',
                render: (_, __, row) => {
                    return translateData(row, 'en', 'name');
                },
            },
            {
                cellStyle: { width: '200px' },
                sort: 'subName',
                name: 'industrySubSectorNameVi',
                label: 'masterData.industrySubSectorNameVi',
                render: (_, __, row) => {
                    return translateData(row, 'vi', 'name');
                },
            },
            {
                cellStyle: { width: '100px' },
                sort: 'item_code',
                name: 'itemCode',
                label: 'masterData.code',
            },
            {
                cellStyle: { width: '200px' },
                type: E_TableColumnType.HTML,
                sort: 'status',
                name: 'status',
                label: 'masterData.status',
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
                label: 'masterData.actions',
                ctas: [
                    {
                        icon: 'edit',
                        onClick: (row: I_IndustrySubSector) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id, prefix: TAB_NAME });
                        },
                    },
                ],
            },
        ];
        this.table.config.refetch = this.getIndustrySubSectorsWithIndustrySectors;

        this.routeService.onChange(({ hash }) => {
            this.getIndustrySubSectorWithIndustrySectors(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getIndustrySubSectorWithIndustrySectors();
        this.getIndustrySubSectorsWithIndustrySectors();
    }

    getIndustrySubSectorWithIndustrySectors = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            tab: TAB_NAME,
            hash,
            detail: ({ id }) =>
                this.masterDataService.getIndustrySubSectorWithIndustrySectors({
                    id,
                }),
        });
    };

    getIndustrySubSectorsWithIndustrySectors = async (variables?: I_QueryVariables) => {
        const industrySubSectorsWithIndustrySectors =
            await this.masterDataService.getIndustrySubSectorsWithIndustrySectors(
                {
                    ...getQueryVariables({ variables }),
                },
                { extra: { variables } },
            );

        this.table.state.data = industrySubSectorsWithIndustrySectors.data;
        this.table.state.pagination = industrySubSectorsWithIndustrySectors.pagination;
        this.table.state.selection?.clear();
    };

    handleSort = (values) => {
        this.table.handleSort({
            ...values,
            ...(values.orderBy && {
                orderBy: values.orderBy.replace('subName', 'name').replace('subParentName', 'parent_name'),
            }),
        });
    };

    handleUpdateStatus = async (status) => {
        const selectedIndustrySubSectors = this.table.state.selection.selected;

        const { industrySubSectorsUpdateStatus } = await this.masterDataService.updateIndustrySubSectorsStatus({
            listStatus: selectedIndustrySubSectors.map((industrySubSector) => ({
                industrySubSectorsId: industrySubSector.id,
                status,
            })),
        });

        if (industrySubSectorsUpdateStatus.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(industrySubSectorsUpdateStatus.error?.message);
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
