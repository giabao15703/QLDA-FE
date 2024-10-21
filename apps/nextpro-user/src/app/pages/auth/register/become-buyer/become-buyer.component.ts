import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { BuyerBasicInformationFormComponent, FormComponent } from '#shared/components';
import { ROUTES } from '#shared/constants';
import { MaterialModules } from '#shared/modules';
import { AuthService, LoadingService } from '#shared/services';
import { E_Form_Mode } from '#shared/types';
import { NavbarLoginComponent } from 'apps/nextpro-user/src/app/layout';

@Component({
    standalone: true,
    selector: 'nextpro-user-auth-register-become-buyer',
    templateUrl: './become-buyer.component.html',
    styleUrl: './become-buyer.component.scss',
    imports: [
        CommonModule,
        MaterialModules,
        NavbarLoginComponent,
        DatePipe,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        FormComponent,
        BuyerBasicInformationFormComponent,
    ],
})
export class BecomeBuyerPage {
    constructor(
        public router: Router,
        public loadingService: LoadingService,
        private authService: AuthService,
    ) {}

    mode = E_Form_Mode.CREATE;

    onSubmit = ({ email, fullName, password, ...rest }) => {
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
                this.router.navigateByUrl(ROUTES.USER.AUTH.REGISTER.THANK_YOU);
            },
        );
    };
}
