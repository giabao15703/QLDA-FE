import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { AuthService, FormService } from '#shared/services';
import { E_FieldType, E_InputType } from '#shared/types';

@Component({
    standalone: true,
    selector: 'nextpro-admin-auth-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [FormService],
    imports: [CommonModule, MaterialModules, TranslateModule, FormComponent],
})
export class LoginPage {
    constructor(
        public router: Router,
        public form: FormService,
        private authService: AuthService,
    ) {
        this.form.config = [
            {
                label: 'auth.login.username',
                placeholder: 'auth.login.username',
                name: 'username',
                validate: [
                    {
                        rule: Validators.required,
                        message: 'auth.login.fieldRequired',
                    },
                ],
            },
            {
                label: 'auth.login.password',
                placeholder: 'auth.login.password',
                name: 'password',
                inputType: E_InputType.PASSWORD,
                validate: [
                    {
                        rule: Validators.required,
                        message: 'auth.login.fieldRequired',
                    },
                ],
            },
            {
                label: 'auth.login.rememberMe',
                name: 'rememberMe',
                fieldType: E_FieldType.CHECKBOX,
            },
        ];
    }

    onSubmit() {
        if (this.form.form.valid) {
            this.authService.login(this.form.form.value);
        }
    }
}
