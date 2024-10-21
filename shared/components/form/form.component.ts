import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation, forwardRef } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';
import { FormService, LoadingService, LocalStorageService } from '#shared/services';
import { I_FieldConfig, T_Any } from '#shared/types';
import { LoadingComponent } from '../loading/loading.component';
import { RatingComponent } from '../rating/rating.component';
import { TableComponent } from '../table/table.component';

@Component({
    standalone: true,
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MaterialModules,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        RatingComponent,
        LoadingComponent,
        CKEditorModule,
        GalleryModule,
        forwardRef(() => TableComponent),
    ],
})
export class FormComponent {
    constructor(
        public loadingService: LoadingService,
        private localStorageService: LocalStorageService,
    ) {}

    @Input() formClass: string;
    @Input() form: FormService;

    Editor = ClassicEditor as T_Any;

    ngOnInit() {
        if (this?.form?.getAsyncOptions) {
            this.form.getAsyncOptions({ isInit: true });
            this.localStorageService.onChange('languageCode', async (_, newValue) => {
                if (newValue) {
                    this.form.getAsyncOptions({ isInit: false });
                }
            });
        }

        this.initializeDynamicFields();
    }

    getFormControl = (config: I_FieldConfig) => {
        return this.form.getField(config.name) as FormControl;
    };

    initializeDynamicFields() {
        this.form.config.forEach((config) => {
            if (config.fieldType === 'dynamic') {
                const formArray = this.form.getDynamicFields(config.name);
                if (formArray && formArray.length === 0) {
                    this.form.createDynamicField(config);
                }
            }
        });
    }
}
