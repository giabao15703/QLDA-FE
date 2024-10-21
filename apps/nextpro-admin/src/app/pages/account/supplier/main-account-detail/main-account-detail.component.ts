import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SupplierBasicInformationFormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { AuthService, LoadingService } from '#shared/services';
import { E_Form_Mode } from '#shared/types';

@Component({
    standalone: true,
    selector: 'nextpro-admin-account-supplier-main-account-detail',
    templateUrl: './main-account-detail.component.html',
    styleUrl: './main-account-detail.component.scss',
    imports: [CommonModule, TranslateModule, MaterialModules, SupplierBasicInformationFormComponent],
})
export class AccountSupplierMainAccountDetailComponent {
    constructor(
        public loadingService: LoadingService,
        private authService: AuthService,
    ) {}

    @Input() mode: E_Form_Mode;
    @Input() data;
    @Input() onCloseDrawer;
    @Input() refetch;

    currentDate = new Date();
    language: number;

    handleSave = (values, callback) => {
        if (this.mode === E_Form_Mode.CREATE) {
            this.authService.registerSupplier(
                {
                    input: values,
                },
                () => {
                    this.refetch();

                    if (callback && typeof callback === 'function') {
                        callback();
                    }
                },
            );
        }
    };
}
