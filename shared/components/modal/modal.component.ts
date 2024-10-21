import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';
import { ModalService } from '#shared/services';

@Component({
    standalone: true,
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    imports: [CommonModule, MaterialModules, TranslateModule],
})
export class ModalComponent {
    constructor(
        private modalService: ModalService,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            modal: {
                title?: string;
                content: ComponentType<ModalComponent>;
                footer?: {
                    onSubmit: (value) => void;
                };
            };
            data;
        },
    ) {}

    @ViewChild('dynamicContent', { read: ViewContainerRef }) dynamicContent: ViewContainerRef;
    dynamicContentRef;

    ngOnInit() {
        setTimeout(() => {
            if (this.dynamicContent && this?.data?.modal) {
                this.dynamicContentRef = this.dynamicContent.createComponent(this.data.modal.content);
                this.dynamicContentRef.instance.data = this.data.data;

                if (this.data.modal.footer?.onSubmit) {
                    this?.dynamicContentRef?.instance?.handleSubmit?.subscribe(this.data.modal.footer.onSubmit);
                }
            }
        }, 0);
    }

    close() {
        this.modalService.hide();
    }
}
