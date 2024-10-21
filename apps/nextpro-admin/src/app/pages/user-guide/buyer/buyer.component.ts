import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SyncTabsWithAnchorDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';
import { UserGuideBuyerCourseListPage } from './course/list/course-list.component';
import { UserGuideBuyerModuleListPage } from './module/list/module-list.component';

@Component({
    standalone: true,
    selector: 'nextpro-admin-user-guide-buyer',
    templateUrl: './buyer.component.html',
    styleUrl: './buyer.component.scss',
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModules,
        UserGuideBuyerModuleListPage,
        UserGuideBuyerCourseListPage,
        SyncTabsWithAnchorDirective,
    ],
})
export class UserGuideBuyerPage {}
