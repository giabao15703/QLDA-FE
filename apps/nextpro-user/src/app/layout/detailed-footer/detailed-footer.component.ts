import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'nextpro-user-detailed-footer',
    templateUrl: './detailed-footer.component.html',
    styleUrl: './detailed-footer.component.scss',
    imports: [TranslateModule],
})
export class DetailedFooterComponent {}
