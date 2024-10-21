import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { BuyerBasicInformationFormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService } from '#shared/services';
import { E_Form_Mode } from '#shared/types';

@Component({
    standalone: true,
    selector: 'nextpro-admin-account-buyer-sub-account-detail',
    templateUrl: './sub-account-detail.component.html',
    styleUrl: './sub-account-detail.component.scss',
    imports: [CommonModule, TranslateModule, MaterialModules, BuyerBasicInformationFormComponent],
})
export class AccountBuyerSubAccountDetailComponent {
    constructor(public loadingService: LoadingService) {}

    @Input() mode: E_Form_Mode;
    @Input() data;
    @Input() onCloseDrawer;
    @Input() refetch;

    currentDate = new Date();
    language: number;
}
