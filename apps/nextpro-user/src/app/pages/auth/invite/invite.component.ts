import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { AuthService, FormService } from '#shared/services';
import { E_FieldType, E_UserType } from '#shared/types';

@Component({
    standalone: true,
    selector: 'nextpro-user-auth-invite',
    templateUrl: './invite.component.html',
    styleUrl: './invite.component.scss',
    providers: [FormService],
    imports: [MaterialModules, ReactiveFormsModule, TranslateModule, FormComponent],
})
export class InviteComponent {
    constructor(
        private authService: AuthService,
        public form: FormService,
    ) {
        this.form.config = [
            {
                label: 'auth.invite.full-name-label',
                name: 'fullName',
                class: 'w-full field-transparent',
            },
            {
                label: 'auth.invite.email-address-label',
                name: 'email',
                class: 'w-full field-transparent',
            },
            {
                label: 'auth.invite.referral-code-label',
                name: 'referralCode',
                class: 'w-full field-transparent',
            },
            {
                name: 'userType',
                class: 'flex justify-around w-full',
                fieldType: E_FieldType.RADIO,
                options: [
                    {
                        label: 'auth.invite.as-buyer',
                        value: E_UserType.BUYER,
                    },
                    {
                        label: 'auth.invite.as-supplier',
                        value: E_UserType.SUPPLIER,
                    },
                ],
            },
        ];
    }

    async onSubmit() {
        if (this.form.form.valid) {
            await this.authService.invite(this.form.form.value, () => {
                this.form.reset();
            });
        }
    }
}
