import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent, TableComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { formatDate, getQueryVariables } from '#shared/utils';
import {
    AccountService,
    AuthService,
    FormService,
    GroupQLDAService,
    LoadingService,
    LocalStorageService,
    MasterDataService,
    NotificationService,
    OrderService,
    TableService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_GroupQLDA, I_JoinGroup, I_QueryVariables } from '#shared/types';

const FORM_NAME = 'FORM_ADMIN_DELIVERY_GROUP_STUDENT';

@Component({
    standalone: true,
    selector: 'nextpro-admin-group-detail',
    templateUrl: './group-detail.component.html',
    styleUrl: './group-detail.component.scss',
    providers: [TableService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent, TableComponent],
})
export class GroupDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public table: TableService<I_JoinGroup>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private groupQLDAService: GroupQLDAService,
        private accountService: AccountService,
        private authService: AuthService,
    ) {
        this.table.config.columns = [
            {
                name: 'user.shortName',
                label: 'Tên thành viên',
                cellStyle: { 'justify-content': 'start' },
            },
            {
                name: 'class',
                label: 'Lớp',
                cellStyle: { 'justify-content': 'start' },
            },
            {
                name: 'user.email',
                label: 'Email',
                cellStyle: { 'justify-content': 'start' },
            },
            {
                name: 'numberPhone',
                label: 'Số điện thoại',
                cellStyle: { 'justify-content': 'start' },
            },
            {
                name: 'role',
                label: 'Chức vụ',
                cellStyle: { 'justify-content': 'start' },
            },
        ];

        this.table.config.refetch = this.getJoinGroups;
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_GroupQLDA;
    @Input() onCloseDrawer;
    @Input() refetch;

    ngOnInit() {
        this.getJoinGroups();
        const oldData = this.localStorageService.get(FORM_NAME);

        // if (oldData) {
        //     this.form.patchValue(oldData);
        // }
    }

    getJoinGroups = async (variables?: I_QueryVariables) => {
        const joinGroups = await this.groupQLDAService.getJoinGroups(
            {
                ...getQueryVariables({
                    variables: {
                        ...variables,
                        groupId: this.data.id,
                    },
                }),
            },
            { extra: { variables } },
        );

        this.table.state.data = joinGroups.data;
        this.table.state.pagination = joinGroups.pagination;
        this.table.state.selection?.clear();
    };

    ngOnChanges(changes) {
        if (this.data) {
            console.log(this.data);
        }
    }
    handleSave = async () => {};
}
