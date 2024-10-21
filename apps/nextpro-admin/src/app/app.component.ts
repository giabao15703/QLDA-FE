import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LoadingService } from '#shared/services';

@Component({
    standalone: true,
    selector: 'nextpro-admin-root',
    templateUrl: './app.component.html',
    styleUrls: ['app.component.scss'],
    imports: [CommonModule, RouterModule, LoadingComponent, MaterialModules],
})
export class AppComponent {
    constructor(
        private loadingService: LoadingService,
        private translateService: TranslateService,
    ) {}

    title = 'nextpro-admin';
    language = 'vi';
    isLoading = false;
    isGlobal = false;

    ngOnInit() {
        this.loadingService.subscribe(this);
        this.translateService.setDefaultLang(this.language);
    }

    ngOnDestroy() {
        this.loadingService.unsubscribe();
    }
}
