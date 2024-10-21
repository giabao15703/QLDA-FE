import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ImageComponent, VideoComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { getKeyByValue } from '#shared/utils';
import { ForgotPasswordComponent } from '#user/pages/auth/forgot-password/forgot-password.component';
import { InviteComponent } from '#user/pages/auth/invite/invite.component';
import { LoginComponent } from '#user/pages/auth/login/login.component';
import { RegisterComponent } from '#user/pages/auth/register/register.component';
import { NavbarLoginComponent } from 'apps/nextpro-user/src/app/layout';

const TAB_MAPPER = {
    login: 0,
    register: 1,
    invite: 2,
};

@Component({
    standalone: true,
    selector: 'nextpro-user-auth',
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
    imports: [
        CommonModule,
        MaterialModules,
        NavbarLoginComponent,
        ImageComponent,
        VideoComponent,
        LoginComponent,
        InviteComponent,
        RegisterComponent,
        ForgotPasswordComponent,
        TranslateModule,
        RouterModule,
    ],
})
export class UserAuthPage {
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    currentTab = 0;
    showForgotPassword = false;
    selectedIndex = '0';

    ngOnInit() {
        this.currentTab = TAB_MAPPER[this.activatedRoute.snapshot.fragment];
    }

    toggleForgotPassword = () => {
        this.showForgotPassword = !this.showForgotPassword;
    };

    changeTab({ index }: { index: number }) {
        this.currentTab = index;
        this.router.navigateByUrl(`/auth#${getKeyByValue(TAB_MAPPER, index)}`);
    }
}
