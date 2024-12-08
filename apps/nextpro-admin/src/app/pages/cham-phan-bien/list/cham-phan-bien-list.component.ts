import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';

import { FilterComponent, LoadingComponent, TableComponent } from '#shared/components';
import { REST_API_ADMIN_ENDPOINTS } from '#shared/constants';
import { MaterialModules } from '#shared/modules';
import {
    GradingService,
    KeHoachService,
    LoadingService,
    LocalStorageService,
    NotificationService,
    RestApiService,
    RouteService,
    TableService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_Grading, I_KeHoach, I_QueryVariables } from '#shared/types';
import { formatDate, getQueryVariables } from '#shared/utils';
import { ChamPhanBienDetailComponent } from '../detail/cham-phan-bien-detail.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-cham-phan-bien-list',
    templateUrl: './cham-phan-bien-list.component.html',
    styleUrl: './cham-phan-bien-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        ChamPhanBienDetailComponent,
        RouterModule,
    ],
})
export class ChamPhanBienListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_Grading>,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private gradingService: GradingService,
        private restApiService: RestApiService,
        private localStorageService: LocalStorageService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'Mã kế hoạch',
                name: 'maKeHoach',
            },
            {
                label: 'Kỳ mở',
                name: 'kyMo',
            },
            {
                label: 'Số lượng sinh viên',
                name: 'slSinhVien',
            },
            {
                label: 'Số lượng đồ án',
                name: 'slDoAn',
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
                label: 'Mã đề tài',
                name: 'maDeTai',
                render: (_, __, row) => {
                    return row.detai?.id;
                }
            },
            {
                label: 'Tên đề tài',
                name: 'tenDeTai',
                render: (_, __, row) => {
                    return row.detai?.tendoan;
                }
            },
            {
                label: 'Mã nhóm',
                name: 'maNhom',
                render: (_, __, row) => {
                    return row.detai?.idnhom;
                }
            },
            {
                label: 'Điểm phản biện',
                name: 'diemPhanbien',
            },
            {
                cellStyle: { width: '50px' },
                sticky: 'right',
                type: E_TableColumnType.ACTION,
                name: 'action',
                label: 'Hành động',
                ctas: [
                    {
                        icon: 'edit',
                        onClick: (row: I_Grading) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },

        ];
        this.table.config.refetch = this.getGrandings;

        this.routeService.onChange(({ hash }) => {
            this.getGranding(hash);
        });
    }

    detail = null;
    exportUrl = REST_API_ADMIN_ENDPOINTS.COUPON.EXPORT;

    ngOnInit() {
        this.getGranding();
        this.getGrandings();
    }

    getGranding = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.gradingService.getGrading({
                    id,
                }),
        });
    };

    getGrandings = async (variables?: I_QueryVariables) => {
        const gradings = await this.gradingService.getGradings(
            {
                ...getQueryVariables(
                    {
                        variables: {
                            ...variables,
                            type: 'PHAN_BIEN',
                        },
                    }
                ),
            },
            { extra: { variables } },
        );

        this.table.state.data = gradings.data;
        this.table.state.pagination = gradings.pagination;
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
