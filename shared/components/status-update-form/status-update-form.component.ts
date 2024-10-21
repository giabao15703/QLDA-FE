import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';
import { FormService, LoadingService } from '#shared/services';
import { E_FieldType } from '#shared/types';
import { FormComponent } from '../form/form.component';
import { LoadingComponent } from '../loading/loading.component';
import { TableComponent } from '../table/table.component';

const FORM_NAME = 'FORM_UPDATE_STATUS';

@Component({
    standalone: true,
    selector: 'app-status-update-form',
    templateUrl: './status-update-form.component.html',
    styleUrl: './status-update-form.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, TableComponent, FormComponent],
})
export class StatusUpdateComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService,
        private el: ElementRef,
    ) {
        this.form.config = [
            {
                label: 'account.buyer-accounts.buyer-accounts-list.content',
                placeholder: 'account.buyer-accounts.buyer-accounts-list.content',
                name: 'reasonManual',
                fieldType: E_FieldType.TEXTAREA,
                maxLength: 256,
                validate: [
                    {
                        rule: Validators.required,
                        message: 'VALIDATE_DESCRIPTION.companyAddress.required',
                    },
                ],
            },
        ];
    }

    @Input() isLoading: boolean;
    @Output() handleSubmit = new EventEmitter<{ reasonManual: string }>();

    onSubmit = () => {
        this.form.submit(({ reasonManual }) => {
            const submitData = {
                reasonManual,
            };

            this.handleSubmit.emit(submitData);
        }, FORM_NAME);
    };
}
