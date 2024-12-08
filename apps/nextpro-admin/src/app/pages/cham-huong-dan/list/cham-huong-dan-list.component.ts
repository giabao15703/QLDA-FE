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
import { ChamHuongDanDetailComponent } from '../detail/cham-huong-dan-detail.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-cham-huong-dan-list',
    templateUrl: './cham-huong-dan-list.component.html',
    styleUrl: './cham-huong-dan-list.component.scss',
    providers: [TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        TableComponent,
        FilterComponent,
        ChamHuongDanDetailComponent,
        RouterModule,
    ],
})
export class ChamHuongDanListPage {
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
                ...getQueryVariables({ variables }),
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
