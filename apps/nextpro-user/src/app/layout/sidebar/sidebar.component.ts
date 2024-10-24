import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { LanguageSwitchComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
@Component({
    standalone: true,
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    imports: [MaterialModules, LanguageSwitchComponent, TranslateModule, RouterModule],
})
export class SidebarComponent {}
