import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { utc } from 'moment';

import { DiamondSponsorDetailComponent } from '#admin/pages/diamond-sponsor/detail/diamond-sponsor-detail.component';
import { FilterComponent, FormComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    DiamondSponsorDataService,
    FormService,
    LoadingService,
    NotificationService,
    RouteService,
    TableService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, E_TableColumnType, I_QueryVariables, I_UserDiamondSponsor } from '#shared/types';
import { formatDate, getQueryVariables } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-admin-diamond-sponsor-list',
    templateUrl: './diamond-sponsor-list.component.html',
    styleUrl: './diamond-sponsor-list.component.scss',
    providers: [FormService, TableService],
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
        FormComponent,
        TableComponent,
        FilterComponent,
        RouterModule,
        DiamondSponsorDetailComponent,
    ],
})
export class DiamondSponsorListPage {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_UserDiamondSponsor>,
        public form: FormService,
        private routeService: RouteService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private userDiamondSponsorDataService: DiamondSponsorDataService,
    ) {
        this.table.config.filterForm = [
            {
                label: 'diamond-sponsor.description',
                name: 'description_Icontains',
            },

            {
                label: 'diamond-sponsor.validFrom',
                name: 'validFrom',
                fieldType: E_FieldType.DATEPICKER,
            },
            {
                label: 'diamond-sponsor.validTo',
                name: 'validTo',
                fieldType: E_FieldType.DATEPICKER,
                min: (formGroup) => {
                    return formGroup.get('validFrom').value
                        ? utc(formGroup.get('validFrom').value).add(1, 'd').format()
                        : '';
                },
            },

            {
                label: 'diamond-sponsor.status',
                name: 'isActive',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'coupon.active',
                        value: true,
                    },
                    {
                        label: 'coupon.inactive',
                        value: false,
                    },
                ],
            },
            {
                label: 'diamond-sponsor.isConfirm',
                name: 'isConfirmed',
                fieldType: E_FieldType.SELECT,
                options: [
                    {
                        label: 'diamond-sponsor.pending',
                        value: 2,
                    },
                    {
                        label: 'diamond-sponsor.approve',
                        value: 1,
                    },
                    {
                        label: 'diamond-sponsor.reject',
                        value: 3,
                    },
                ],
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
                cellStyle: { width: '60px' },
                type: E_TableColumnType.IMAGE,
                name: 'image',
                label: 'diamond-sponsor.picture',
            },
            {
                sort: 'description',
                name: 'description',
                label: 'diamond-sponsor.description',
            },

            {
                sort: 'valid_from',
                name: 'validFrom',
                label: 'diamond-sponsor.validFrom',
                render: formatDate,
            },
            {
                sort: 'valid_to',
                name: 'validTo',
                label: 'diamond-sponsor.validTo',
                render: formatDate,
            },
            {
                name: 'companyFullName',
                label: 'diamond-sponsor.companyName',
                render: (_, __, row) => {
                    return row?.user?.supplier?.companyFullName;
                },
            },

            {
                type: E_TableColumnType.HTML,
                sort: 'is_active',
                name: 'isActive',
                label: 'coupon.status',
                render: (cell) => {
                    return `<div class="text-white text-center p-[10px] bg-${cell ? 'active' : 'inactive'}">
                    ${this.translateService.instant(cell ? 'masterData.active' : 'masterData.inactive')}
                    </div>`;
                },
            },
            {
                type: E_TableColumnType.HTML,
                sort: 'is_confirmed',
                name: 'isConfirmed',
                label: 'diamond-sponsor.isConfirm',
                render: (cell) => {
                    let status = '';
                    let statusText = '';

                    switch (cell) {
                        case 1:
                            status = 'approved';
                            statusText = this.translateService.instant('diamond-sponsor.approve');
                            break;
                        case 2:
                            status = 'pending';
                            statusText = this.translateService.instant('diamond-sponsor.pending');
                            break;
                        case 3:
                            status = 'rejected';
                            statusText = this.translateService.instant('diamond-sponsor.reject');
                            break;
                    }

                    return `<div class="text-white text-center p-[10px] bg-${status}">
                                ${statusText}
                            </div>`;
                },
            },
            {
                name: 'reachNumberCount',
                label: 'diamond-sponsor.reachNumber',
            },
            {
                name: 'clickNumber',
                label: 'diamond-sponsor.clickNumber',
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
                        onClick: (row: I_UserDiamondSponsor) => {
                            this.routeService.goTo({ mode: E_Form_Mode.UPDATE, id: row.id });
                        },
                    },
                ],
            },
        ];
        this.form.config = [
            {
                name: 'textEditor',
                fieldType: E_FieldType.TEXT_EDITOR,
            },
        ];
        this.table.config.refetch = this.getUserDiamondSponsors;

        this.routeService.onChange(({ hash }) => {
            this.getUserDiamondSponsor(hash);
        });
    }

    detail = null;

    ngOnInit() {
        this.getUserDiamondSponsor();
        this.getUserDiamondSponsors();
    }

    getUserDiamondSponsor = async (hash?: string) => {
        this.detail = await this.routeService.getDetail({
            hash,
            detail: ({ id }) =>
                this.userDiamondSponsorDataService.getUserDiamondSponsor({
                    id,
                }),
        });
    };

    getUserDiamondSponsors = async (variables?: I_QueryVariables) => {
        const userDiamondSponsors = await this.userDiamondSponsorDataService.getUserDiamondSponsors(
            {
                ...getQueryVariables({ variables }),
            },
            { extra: { variables } },
        );

        if (userDiamondSponsors.data.length > 0) {
            this.form.patchValue({ textEditor: userDiamondSponsors.data[0].textEditer });
        }

        this.table.state.data = userDiamondSponsors.data;
        this.table.state.pagination = userDiamondSponsors.pagination;
        this.table.state.selection?.clear();
    };

    handleFilter = (values) => {
        this.table.handleFilter({
            ...values,
            validFrom: formatDate(values.validFrom, { format: 'YYYY-MM-DD' }),
            validTo: formatDate(values.validTo, { format: 'YYYY-MM-DD' }),
        });
    };

    handleSaveTextEditor = async () => {
        this.form.submit(async (values) => {
            const { userDiamondSponsorCreateTextEditer } =
                await this.userDiamondSponsorDataService.createDiamondSponsorTextEditer({
                    textEditer: values.textEditor,
                });

            if (userDiamondSponsorCreateTextEditer.status) {
                await this.table.refetch();
                this.notificationService.success('notification.updateSuccessfully');
            } else {
                this.notificationService.error(userDiamondSponsorCreateTextEditer.error?.message);
            }
        });
    };

    handleUpdateStatus = async (isConfirmed) => {
        const selectedUserDiamondSponsors = this.table.state.selection.selected;

        const { userUserDiamondSponsorIsConfirmedUpdate } =
            await this.userDiamondSponsorDataService.updateUserDiamondSponsorIsConfirmed({
                listIsConfirmed: selectedUserDiamondSponsors.map((userDiamondSponsor) => ({
                    id: userDiamondSponsor.id,
                    isConfirmed,
                })),
            });

        if (userUserDiamondSponsorIsConfirmedUpdate.status) {
            await this.table.refetch();
            this.notificationService.success('notification.updateSuccessfully');
        } else {
            this.notificationService.error(userUserDiamondSponsorIsConfirmedUpdate.error?.message);
        }
    };

    handleCloseDetailDrawer = () => {
        this.routeService.removeHash();
        this.detail = null;
    };
}
