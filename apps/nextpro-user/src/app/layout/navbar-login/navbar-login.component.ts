import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { LanguageSwitchComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';

@Component({
    standalone: true,
    selector: 'nextpro-user-navbar-login',
    templateUrl: './navbar-login.component.html',
    styleUrl: './navbar-login.component.scss',
    imports: [MaterialModules, LanguageSwitchComponent, TranslateModule, RouterModule],
})
export class NavbarLoginComponent {}
