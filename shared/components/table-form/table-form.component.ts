import { Component, Input, ViewEncapsulation, forwardRef } from '@angular/core';

import { FormService, LoadingService, LocalStorageService } from '#shared/services';
import { I_FieldConfig } from '#shared/types';
import { FormComponent } from '../form/form.component';

@Component({
    standalone: true,
    selector: 'app-table-form',
    templateUrl: './table-form.component.html',
    styleUrls: ['./table-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [FormService],
    imports: [forwardRef(() => FormComponent)],
})
export class TableFormComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService,
        private localStorageService: LocalStorageService,
    ) {}

    @Input() formClass: string;
    @Input() name: string;
    @Input() config: I_FieldConfig[];
    @Input() data;
    @Input() index: number;

    ngOnInit() {
        if (this.name) {
            this.form.name = this.name;
        }

        this.form.config = this.config.map((item) => ({ ...item, index: this.index }));
        this.form.form.patchValue(this.data);

        if (this?.form?.getAsyncOptions) {
            this.form.getAsyncOptions({ isInit: true });
            this.localStorageService.onChange('languageCode', async (_, newValue) => {
                if (newValue) {
                    this.form.getAsyncOptions({ isInit: false });
                }
            });
        }
    }
}
