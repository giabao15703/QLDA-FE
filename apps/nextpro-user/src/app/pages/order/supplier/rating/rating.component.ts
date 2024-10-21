import { FormComponent, InteractiveComponent, RatingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { FormService } from '#shared/services';
import { E_FieldType } from '#shared/types';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DetailedFooterComponent, NavbarComponent } from 'apps/nextpro-user/src/app/layout';

@Component({
    standalone: true,
    selector: 'nextpro-user-rating-supplier',
    templateUrl: './rating.component.html',
    styleUrl: './rating.component.scss',
    providers: [FormService],
    imports: [
        CommonModule,
        FormsModule,
        FormComponent,
        RatingComponent,
        InteractiveComponent,
        NavbarComponent,
        DetailedFooterComponent,
        TranslateModule,
        MaterialModules,
    ],
})
export class RatingSupplierPage {
    constructor(
        public opinionForm: FormService,
        public supplierResponseForm: FormService,
    ) {
        this.opinionForm.config = [
            {
                class: 'mt-2 w-full min-h-32',
                name: 'opinion',
                fieldType: E_FieldType.TEXTAREA,
            },
        ];
        this.supplierResponseForm.config = [
            {
                class: 'mt-3 w-full min-h-32',
                name: 'supplierResponse',
                fieldType: E_FieldType.TEXTAREA,
            },
        ];
    }

    isTermAccept = false;
    ratingInfo = [
        {
            id: 0,
            productCode: 123456789,
            description:
                'Chúng tôi chuyên cung cấp thiết bị điều khiển tắt/ mở từ xa bằng remote (hoặc trên smartphone ) công nghệ mới, học được lệnh tắt mở tất cả các remote có tần số 315~433MHz,hoặc bằng sóng hồng ngoai (tv,quạt,máy lạnh...) và hẹn được giờ tắt theo ý muốn.',
            status: 'Đã giao',
        },
    ];
    supplierInfo = [
        {
            id: 0,
            supplierAvatar: '/assets/icons/avatar-supplier.svg',
            supplierName: 'Công ty TNHH NextPro',
            timeFeedback: '09:35',
            dateFeedback: '12/12/2023',
        },
    ];

    onIsTermAcceptChange = (event) => {
        this.isTermAccept = event.checked;
    };
}
