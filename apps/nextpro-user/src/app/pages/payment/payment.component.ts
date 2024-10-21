import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ROUTES } from '#shared/constants';
import { SyncTabsWithAnchorDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';

import { AuthService } from '#shared/services';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from 'apps/nextpro-user/src/app/layout';
import { MyPaymentAccountComponent } from './my-account/my-account.component';
import { PendingPaymentComponent } from './pending/pending.component';
@Component({
    standalone: true,
    selector: 'nextpro-user-payment',
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss',
    providers: [DatePipe],
    imports: [
        NavbarComponent,
        MaterialModules,
        CommonModule,
        TranslateModule,
        SyncTabsWithAnchorDirective,
        PendingPaymentComponent,
        MyPaymentAccountComponent,
        RouterModule,
    ],
})
export class PaymentComponent {
    constructor(
        public authService: AuthService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.userType = this.authService.getUserType();
    }

    userType: string;

    onTabChange(event: MatTabChangeEvent) {
        const index = event.index;

        if (index === 0) {
            this.navigateToPath(ROUTES.USER.PAYMENT.MY_ACCOUNT);
        } else if (index === 1) {
            this.navigateToPath(ROUTES.USER.PAYMENT.PENDING_PAYMENT);
        }
    }

    navigateToPath(path: string) {
        const lastSegment = path.split('/').pop();
        this.router.navigate([`payment/${lastSegment}`]);
    }
}
