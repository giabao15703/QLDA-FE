import { MaterialModules } from '#shared/modules';
import { FormService } from '#shared/services';
import { E_ContainerType, E_FieldType } from '#shared/types';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { FormComponent } from '../../../../form/form.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-update-status-ad',
    templateUrl: './set-products-ad.component.html',
    styleUrls: ['./set-products-ad.component.scss'],
    providers: [FormService],
    imports: [
        MaterialModules,
        MatButtonModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent,
        TranslateModule,
        FormComponent,
    ],
})
export class StatusAdComponent {
    constructor(
        public form: FormService,
        public dialogRef: MatDialogRef<StatusAdComponent>,
    ) {
        this.form.config = [
            {
                name: 'statusAdContainer',
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.FIELDSET,
                class: 'grid gap-2 grid-cols-1 lg:grid-cols-3',
                label: 'supplier-profile.tabs.advertisement.create.set-products-ad.advertising-banner.title',
                children: [
                    {
                        label: 'supplier-profile.tabs.advertisement.status-ad.product',
                        name: 'product',
                        fieldType: E_FieldType.SELECT,
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.status-ad.advertisingType',
                        name: 'advertisingType',
                        fieldType: E_FieldType.SELECT,
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.status-ad.validFrom',
                        name: 'validFrom',
                        fieldType: E_FieldType.DATEPICKER,
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.status-ad.status',
                        name: 'status',
                        fieldType: E_FieldType.SELECT,
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.status-ad.duration',
                        name: 'duration',
                        fieldType: E_FieldType.SELECT,
                    },
                    {
                        label: 'supplier-profile.tabs.advertisement.status-ad.validTo',
                        name: 'validTo',
                        fieldType: E_FieldType.DATEPICKER,
                    },
                    {
                        value: 'supplier-profile.tabs.advertisement.status-ad.price',
                        name: 'price',
                    },
                ],
            },
        ];
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
