import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';
import { FormService } from '#shared/services';
import { I_FieldConfig } from '#shared/types';
import { isFormHasValue } from '#shared/utils';
import { FormComponent } from '../form/form.component';

@Component({
    standalone: true,
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, MaterialModules, FormComponent],
})
export class FilterComponent {
    constructor(public form: FormService) {}
    @Input() class = 'relative flex flex-col items-center h-full overflow-x-hidden';
    @Input() formClass;
    @Input() onFilter;
    @Input() formConfig: I_FieldConfig[];
    @Input() onCloseDrawer;
    @Input() showClose = true;
    @Input() showExportButton = false;

    ngOnChanges(changes) {
        if (changes?.formConfig?.currentValue) {
            this.form.config = changes.formConfig.currentValue;
        }
    }

    isOpened = false;

    isFormHasValue = () => isFormHasValue(this.form.form.value);

    handleFilter() {
        if (this.form.form.valid) {
            this.onFilter(this.form.form.value);
        }
    }

    handleReset() {
        this.form.reset();
        this.onFilter({});
    }

    handleExport() {
        console.log('Export');
    }
}
