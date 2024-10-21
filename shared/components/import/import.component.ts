import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';
import {
    FormService,
    LoadingService,
    LocalStorageService,
    NotificationService,
    RestApiService,
} from '#shared/services';
import { E_FieldType, I_FamilyCode } from '#shared/types';
import { FormComponent } from '../form/form.component';
import { LoadingComponent } from '../loading/loading.component';
import { TableComponent } from '../table/table.component';

@Component({
    standalone: true,
    selector: 'app-import',
    templateUrl: './import.component.html',
    styleUrl: './import.component.scss',
    providers: [FormService],
    imports: [CommonModule, TranslateModule, LoadingComponent, MaterialModules, FormComponent, TableComponent],
})
export class ImportComponent {
    constructor(
        public loadingService: LoadingService,
        public form: FormService,
        private translateService: TranslateService,
        private notificationService: NotificationService,
        private localStorageService: LocalStorageService,
        private restApiService: RestApiService,
    ) {
        this.form.config = [
            {
                name: 'file',
                label: 'import.importFile',
                fieldType: E_FieldType.UPLOAD,
                accept: '.xlsx,.xls,.csv',
            },
        ];
    }

    @Input() data: I_FamilyCode;
    @Input() onCloseDrawer;
    @Input() refetch;
    @Input() importUrl: string;
    @Input() importTitle: string;
    @Input() foreignKeyColumn: string;
    @Input() entityTitle: string;

    summary: {
        inserted: number;
        translationInserted: number;
        translationUpdated: number;
        updated: number;
    };
    errors = [];
    errorsWithPageSize = [];
    displayedColumns = [];
    genericColumns = [];
    inlineErrors: string = '';
    pageSizes = [20, 50, 100];

    handleSave = async () => {
        const formValues = this.form.getRawValue();
        const formData = new FormData();
        formData.append('file', formValues.file);

        const result = await this.restApiService.post(this.importUrl, formData, {
            observe: 'response',
            headers: {
                Authorization: `Token ${this.localStorageService.get('token')}`,
            },
        });

        if (result.body?.code == 'import_invalid_header') {
            this.inlineErrors = this.translateService.instant('import.headerImportMustBe') + `<b>${result.body.exp}<b>`;
        } else if (result.body?.errors && Object.keys(result.body?.errors).length > 0) {
            this.displayedColumns = result.body.columns;
            this.genericColumns = result.body.columns.map((e) => e);
            this.displayedColumns.push('items');

            Object.keys(result.body.errors).map((key) => {
                const item = {};
                const data = key.split('\r\n');

                for (let i = 0; i < result.body.headers.length - 1; i++) {
                    const column = result.body.headers[i];

                    if (this.displayedColumns.indexOf(column) >= 0) {
                        item[column] = data[i];
                    }
                }

                item['items'] = [];

                result.body?.errors[key].map((err) => {
                    switch (err) {
                        case 'import_mandatory_item_code':
                            item['items'].push('Code' + this.translateService.instant('import.mandatoryField'));
                            break;
                        case 'duplicated_item_code':
                            item['items'].push('Code' + this.translateService.instant('import.duplicatedField'));
                            break;
                        case 'import_mandatory_fk_code':
                            item['items'].push(
                                this.foreignKeyColumn + this.translateService.instant('import.mandatoryField'),
                            );
                            break;
                        case 'import_fk_code_does_not_exist':
                            item['items'].push(
                                this.foreignKeyColumn + this.translateService.instant('import.doesNotExist'),
                            );
                            break;
                    }
                });

                this.errors.push(item);
            });
            this.errorsWithPageSize = this.errors.filter((e, i) => i < 20);
        } else {
            if (result.body?.summary) {
                this.summary = result.body?.summary;
            }
            this.errors = [];
            this.errorsWithPageSize = [];
            this.displayedColumns = [];
            this.genericColumns = [];
            this.inlineErrors = '';
            this.notificationService.success('notification.successfully');
        }

        this.refetch();
    };

    nextPage = (event) => {
        const page = event.pageIndex;
        const pageSize = event.pageSize;
        this.errorsWithPageSize = this.errors.filter((e, i) => i >= page * pageSize && i < (page + 1) * pageSize);
    };
}
