import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'nextpro-user-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    imports: [TranslateModule],
})
export class FooterComponent {}
