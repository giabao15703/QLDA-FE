import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';

@Component({
    standalone: true,
    selector: 'nextpro-user-auth-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    imports: [MaterialModules, FormsModule, TranslateModule],
})
export class RegisterComponent {}
