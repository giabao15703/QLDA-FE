import { FormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { FormService } from '#shared/services';
import { E_FieldAppearance, E_FieldType } from '#shared/types';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DetailedFooterComponent, NavbarComponent } from 'apps/nextpro-user/src/app/layout';

interface InputGroup {
    title?: string;
    productServiceName: string;
    numberOfOders: string;
    unit: string;
    deliveryDate: string;
}

@Component({
    standalone: true,
    selector: 'nextpro-user-cancel-order',
    templateUrl: './cancel-order.component.html',
    styleUrl: './cancel-order.component.scss',
    providers: [FormService],
    imports: [
        CommonModule,
        FormsModule,
        FormComponent,
        MaterialModules,
        TranslateModule,
        NavbarComponent,
        DetailedFooterComponent,
    ],
})
export class CancelOrderPage {
    constructor(public form: FormService) {
        this.form.config = [
            {
                name: 'reasonGroupContainer',
                fieldType: E_FieldType.CONTAINER,
                children: [
                    {
                        name: 'reasonGroup',
                        class: 'flex mt-2 lg:flex-row flex-col lg:items-center lg:gap-x-32',
                        fieldType: E_FieldType.RADIO,
                        appearance: E_FieldAppearance.FILL,
                        options: [
                            {
                                label: 'customer-support.cancel-order.duplicate-order',
                                value: 'duplicateOrder',
                            },
                            {
                                label: 'customer-support.cancel-order.no-need',
                                value: 'noNeed',
                            },
                        ],
                    },
                ],
            },
        ];
    }

    orderInfo = [
        {
            id: 0,
            productCode: 123456789,
            description:
                'Chúng tôi chuyên cung cấp thiết bị điều khiển tắt/ mở từ xa bằng remote (hoặc trên smartphone ) công nghệ mới, học được lệnh tắt mở tất cả các remote có tần số 315~433MHz,hoặc bằng sóng hồng ngoai (tv,quạt,máy lạnh...) và hẹn được giờ tắt theo ý muốn.',
            receivedDate: '30/05/2023',
            receivedTime: '10:00',
            status: 'Chờ xác nhận',
            totalPrice: 5000000,
        },
    ];

    inputGroups: InputGroup[] = [
        {
            title: 'Sản phẩm 1',
            productServiceName: '',
            numberOfOders: '',
            unit: '',
            deliveryDate: '',
        },
    ];

    addInputGroup(): void {
        if (this.inputGroups.length < 2) {
            this.inputGroups.push({
                title: `Sản phẩm ${this.inputGroups.length + 1}`,
                productServiceName: '',
                numberOfOders: '',
                unit: '',
                deliveryDate: '',
            });
        } else {
            console.log('Thêm tối đa 2 sản phẩm.');
        }
    }
}
