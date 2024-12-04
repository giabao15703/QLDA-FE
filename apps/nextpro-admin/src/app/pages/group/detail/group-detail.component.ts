import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent, LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    AccountService,
    AuthService,
    FormService,
    LoadingService,
    LocalStorageService,
    MasterDataService,
    NotificationService,
    OrderService,
} from '#shared/services';
import { E_FieldType, E_Form_Mode, I_GroupQLDA } from '#shared/types';
import { group } from 'console';

const FORM_NAME = 'FORM_ADMIN_DELIVERY_GROUP_STUDENT';

@Component({
    standalone: true,
    selector: 'nextpro-admin-group-detail',
    templateUrl: './group-detail.component.html',
    styleUrl: './group-detail.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent],
})
export class GroupDetailComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService<I_GroupQLDA>,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private orderService: OrderService,
        private accountService: AccountService,
        private authService: AuthService,
    ) {
        this.form.config = [];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_GroupQLDA;
    @Input() onCloseDrawer;
    @Input() refetch;

    ngOnInit() {
        const oldData = this.localStorageService.get(FORM_NAME);

        if (oldData) {
            this.form.patchValue(oldData);
        }
    }

    ngOnChanges(changes) {
        if (changes?.mode?.currentValue === E_Form_Mode.CREATE) {
            this.form.reset();
        } else {
            if (this.data) {
                return;
            }
        }
    }

    handleSave = async () => {};
}
