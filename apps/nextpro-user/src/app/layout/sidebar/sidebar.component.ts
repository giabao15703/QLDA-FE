import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import { LanguageSwitchComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
@Component({
    standalone: true,
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    imports: [MaterialModules, LanguageSwitchComponent, TranslateModule, RouterModule, CommonModule],
})
export class SidebarComponent {
    isSidebarOpen = true; // Trạng thái mở/đóng Sidebar

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}
