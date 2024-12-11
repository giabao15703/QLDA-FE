import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { BuyerBasicInformationFormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { AuthService, LoadingService } from '#shared/services';
import { E_Form_Mode } from '#shared/types';

@Component({
    standalone: true,
    selector: 'nextpro-admin-account-buyer-main-account-detail',
    templateUrl: './main-account-detail.component.html',
    styleUrl: './main-account-detail.component.scss',
    imports: [CommonModule, TranslateModule, MaterialModules, BuyerBasicInformationFormComponent],
})
export class AccountBuyerMainAccountDetailComponent {
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

    handleSave = ({ email, fullName, password, ...rest }, callback) => {
        if (this.mode === E_Form_Mode.CREATE) {
            this.authService.registerBuyer(
                {
                    input: {
                        ...rest,
                        user: {
                            email,
                            fullName,
                            password,
                        },
                    },
                },
                () => {
                    this.refetch();

                    if (callback && typeof callback === 'function') {
                        callback();
                    }
                },
            );
        }
        else if (this.mode === E_Form_Mode.UPDATE) {
            this.authService.updateBuyer(
                {
                    userId: this.data.id,
                    
                    user: {
                        email,
                        password,
                        ...rest,
                    },
                },
            );
        }
    }
}
