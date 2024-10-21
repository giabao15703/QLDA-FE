import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SyncTabsWithAnchorDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';
import { UserGuideSupplierCourseListPage } from './course/list/course-list.component';
import { UserGuideSupplierModuleListPage } from './module/list/module-list.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-user-guide-supplier',
    templateUrl: './supplier.component.html',
    styleUrl: './supplier.component.scss',
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        UserGuideSupplierModuleListPage,
        UserGuideSupplierCourseListPage,
        SyncTabsWithAnchorDirective,
    ],
})
export class UserGuideSupplierPage {}
