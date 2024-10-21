import { FormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { FormService } from '#shared/services';
import { TimelineComponent } from '#user/components/common';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

interface InputGroup {
    title?: string;
    productName: string;
    file: string | null;
    specifications: string;
    quantity: string;
    unitPrice: string;
    tax: string;
    voucher: string;
    buyerClub: string;
    repay: string;
    totalPrice: string;
}

@Component({
    standalone: true,
    selector: 'nextpro-user-order-detail-transporter',
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss',
    imports: [CommonModule, FormsModule, FormComponent, MaterialModules, TimelineComponent, TranslateModule],
})
export class OrderDetailTransporterComponent {
    constructor(private form: FormService) {
        this.form.config = [
            {
                name: 'transportFee',
                label: 'order.detail.delivery-fee',
            },
            {
                name: 'totalPayment',
                label: 'order.detail.total-payment',
            },
        ];
    }

    fileName = '';

    paymentForm: FormGroup;

    orderInformation = [
        {
            id: 0,
            productCode: 123456789,
            supplierFullName: 'Công ty Cổ phần Thiết bị điều khiển từ xa DSU',
            address: 'Số 1, Đường 1, Phường 1, Quận 1, TP.HCM',
            shippingInformation: 'Giao hàng nhanh',
            status: 'Đang vận chuyển',
            contactPhoneNumber: '0923456789',
            deliveryAddress: 'Lầu 4, 57 Lê Thị Hồng Gấm, Phường Nguyễn Thái Bình, Quận 1',
            city: 'Hồ Chí Minh',
            country: 'Việt Nam',
        },
    ];

    orderTimeline = [
        { id: 0, title: 'Ngày đặt hàng', date: '15/10/2023', time: '08:25:39' },
        { id: 1, title: 'Xác nhận đơn hàng', date: '15/10/2023', time: '10:48:23' },
        { id: 2, title: 'Vận chuyển', date: '17/10/2023', time: '15:20:46' },
        { id: 3, title: 'Ngày nhận hàng', date: '18/10/2023', time: '' },
    ];

    receiveInformation = [
        {
            id: 0,
            deliveryAddress: 'Lầu 4, 57 Lê Thị Hồng Gấm, Phường Nguyễn Thái Bình, Quận 1',
            city: 'Hồ Chí Minh',
            country: 'Việt Nam',
            contactFullName: 'Nguyễn Văn A',
            contactPhoneNumber: '0923456789',
            contactEmail: 'abc123@gmail.com',
        },
    ];

    inputGroups: InputGroup[] = [
        {
            title: 'Sản phẩm 1',
            productName: '',
            file: null,
            specifications: '',
            quantity: '',
            unitPrice: '',
            tax: '',
            voucher: '',
            buyerClub: '',
            repay: '',
            totalPrice: '',
        },
    ];

    addInputGroup(): void {
        if (this.inputGroups.length < 2) {
            this.inputGroups.push({
                title: `Sản phẩm ${this.inputGroups.length + 1}`,
                productName: '',
                file: null,
                specifications: '',
                quantity: '',
                unitPrice: '',
                tax: '',
                voucher: '',
                buyerClub: '',
                repay: '',
                totalPrice: '',
            });
        } else {
            console.log('Thêm tối đa 2 sản phẩm.');
        }
    }

    fileChanged(event: Event, group: InputGroup): void {
        if (event.target instanceof HTMLInputElement) {
            const file = event.target.files ? event.target.files[0] : null;
            if (file) {
                group.file = file.name;
            }
        }
    }
}
