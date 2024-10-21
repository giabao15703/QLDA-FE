import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'nextpro-admin-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss'],
    imports: [TranslateModule],
})
export class NotFoundPage {}
