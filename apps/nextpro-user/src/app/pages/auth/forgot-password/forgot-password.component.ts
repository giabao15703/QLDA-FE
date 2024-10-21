import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ImageComponent, VideoComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { InviteComponent } from '#user/pages/auth/invite/invite.component';
import { LoginComponent } from '#user/pages/auth/login/login.component';
import { RegisterComponent } from '#user/pages/auth/register/register.component';
import { NavbarLoginComponent } from 'apps/nextpro-user/src/app/layout';

@Component({
    standalone: true,
    selector: 'nextpro-user-auth-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
    imports: [
        MaterialModules,
        NavbarLoginComponent,
        ImageComponent,
        VideoComponent,
        LoginComponent,
        InviteComponent,
        RegisterComponent,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
    ],
})
export class ForgotPasswordComponent {
    @Input() toggleForgotPassword: () => void;
}
