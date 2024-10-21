import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';

@Component({
    standalone: true,
    selector: 'app-form-header',
    templateUrl: './form-header.component.html',
    styleUrls: ['./form-header.component.scss'],
    imports: [CommonModule, TranslateModule, MaterialModules],
})
export class FormHeaderComponent {
    @Input() title: string = '';
    @Input() onClose: () => void;
}
