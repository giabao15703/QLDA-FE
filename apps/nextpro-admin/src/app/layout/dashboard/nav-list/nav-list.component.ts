import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialModules } from '#shared/modules';
import { I_NavItem } from '#shared/types';

import { NavItemComponent } from '../nav-item/nav-item.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-layout-dashboard-nav-list',
    templateUrl: './nav-list.component.html',
    styleUrl: './nav-list.component.scss',
    imports: [CommonModule, RouterModule, MaterialModules, NavItemComponent],
})
export class NavListComponent {
    @Input() navItems: I_NavItem[] = [];
}
