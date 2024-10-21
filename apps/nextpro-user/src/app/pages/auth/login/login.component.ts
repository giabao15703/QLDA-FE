import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { AuthService, FormService } from '#shared/services';
import { E_FieldType, E_InputType } from '#shared/types';

@Component({
    standalone: true,
    selector: 'nextpro-user-auth-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    providers: [FormService],
    imports: [MaterialModules, ReactiveFormsModule, TranslateModule, FormComponent],
})
export class LoginComponent {
    constructor(
        private authService: AuthService,
        public form: FormService,
    ) {
        this.form.config = [
            {
                label: 'auth.login.input-userID-label',
                name: 'username',
                class: 'w-full field-transparent',
            },
            {
                label: 'auth.login.input-password-placeholder',
                name: 'password',
                inputType: E_InputType.PASSWORD,
                class: 'w-full field-transparent',
            },
            {
                class: 'flex justify-between items-center w-full',
                fieldType: E_FieldType.CONTAINER,
                children: [
                    {
                        label: 'auth.login.remember-me',
                        name: 'rememberMe',
                        wrapperClass: 'flex items-center justify-between',
                        fieldType: E_FieldType.CHECKBOX,
                    },
                    {
                        label: 'auth.login.forgot-password',
                        fieldType: E_FieldType.BUTTON,
                        onClick: () => this.toggleForgotPassword(),
                    },
                ],
            },
        ];
    }

    @Input() toggleForgotPassword: () => void;

    async onSubmit() {
        if (this.form.form.valid) {
            await this.authService.login(this.form.form.value);
            this.form.reset();
        }
    }
}
