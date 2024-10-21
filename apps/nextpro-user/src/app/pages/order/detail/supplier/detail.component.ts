import { FormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { I_Order } from '#shared/types';
import { formatDate } from '#shared/utils';
import { TimelineComponent } from '#user/components/common';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

interface InputGroup {
    title?: string;
    productName: string;
    file: string;
    specifications: string;
    amount: string;
    price: number;
    tax: string;
    voucherCodeOrder: string;
    /* buyerClub: string; */
    repay: string;
    /* totalPrice: string; */
    /* deliveryFee?: number; */
    currency?: string;
}

@Component({
    standalone: true,
    selector: 'nextpro-user-order-detail-supplier',
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss',
    imports: [CommonModule, FormsModule, FormComponent, MaterialModules, TimelineComponent, TranslateModule],
})
export class OrderDetailSupplierComponent {
    @Input() orderDetail: I_Order;

    deliveryFee: string;
    totalPayment: string;
    fileName = '';
    orderInformation: any[] = [];
    orderTimeline: any[] = [
        { id: 0, title: 'Ngày đặt hàng', date: '', time: '' },
        { id: 1, title: 'Xác nhận đơn hàng', date: '', time: '' },
        { id: 2, title: 'Vận chuyển', date: '', time: '' },
        { id: 3, title: 'Ngày nhận hàng', date: '', time: '' },
    ];
    receiveInformation: any[] = [];
    inputGroups: InputGroup[] = [];

    ngOnInit(): void {
        // console.log(this.orderDetail);
        this.loadData();
    }

    private loadData(): void {
        console.log(this.orderDetail);
        if (this.orderDetail) {
            this.orderInformation = [
                {
                    orderCode: this.orderDetail?.orderCode,
                    supplierFullName: this.orderDetail?.buyer[0]?.companyFullName,
                    companyAddress: this.orderDetail?.buyer[0]?.address,
                    state: this.orderDetail.city?.name,
                    status: this.orderDetail?.orderStatus,
                    contactFullName: this.orderDetail?.buyer[0]?.fullName,
                    phone: this.orderDetail?.buyer[0]?.phone,
                    email: this.orderDetail?.buyer[0]?.email,
                    taxCode: this.orderDetail?.taxCode,
                },
            ];

            this.orderTimeline =
                this.orderTimeline.map((defaultItem, index) => {
                    const item = this.orderDetail.orderDeliveryTimelines[index];
                    if (item) {
                        return {
                            ...defaultItem,
                            date: formatDate(item.date || defaultItem.date),
                            time: item.time || defaultItem.time,
                        };
                    }
                    return defaultItem;
                }) || [];

            this.receiveInformation = [
                {
                    id: 1,
                    deliveryAddress: '123 Tân Sơn Nhất',
                    country: 'Việt Nam',
                    city: 'TP. HCM',
                },
            ];

            this.inputGroups = this.orderDetail.orderItems.map((item, index) => {
                /* const unitPrice = item.flashSaleInitialPrice ? item.flashSaleInitialPrice : 0; */
                /* const totalPrice = (item.quantity * unitPrice + item.taxGTGT).toFixed(2); */
                return {
                    title: `${index + 1}`,
                    productName: item?.product?.productName,
                    file: this.orderDetail?.orderItems[0]?.product?.productImages.toString(),
                    specifications: this.orderDetail?.orderItems[0]?.product?.specifications.toString(),
                    amount: item?.amount.toString(),
                    price: this.orderDetail?.orderItems[0]?.product?.initialPrice,
                    tax: item?.taxGTGT.toString(),
                    /* buyerClub: `${item.buyerClub}`, */
                    repay: `${item.refund}`,
                    /* totalPrice: totalPrice.toString(), */
                    /* deliveryFee: this.orderDetail.deliveryFee, */
                    currency: this.orderDetail?.orderItems[0]?.product?.currency?.name,
                    voucherCodeOrder: this.orderDetail?.voucherCodeOrder?.voucherCode,
                };
            });
        }
    }

    addInputGroup(): void {
        if (this.inputGroups.length < 2) {
            this.inputGroups.push({
                title: `Sản phẩm ${this.inputGroups.length + 1}`,
                productName: '',
                file: null,
                specifications: '',
                tax: '',
                repay: '',
                currency: '',
                voucherCodeOrder: '',
                amount: '',
                price: 0,
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
