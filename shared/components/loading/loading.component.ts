import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MaterialModules } from '#shared/modules';

@Component({
    standalone: true,
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    imports: [CommonModule, MaterialModules],
})
export class LoadingComponent {
    @Input() isGlobal?: boolean = false;
    @Input() backdrop?: boolean = false;
    @Input() diameter?: number = 100;
}
