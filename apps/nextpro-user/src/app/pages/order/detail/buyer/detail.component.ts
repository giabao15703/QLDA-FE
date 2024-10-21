import { FormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { LocalStorageService } from '#shared/services';
import { E_OrderType, I_Buyer, I_Order } from '#shared/types';
import { formatDate } from '#shared/utils';
import { TimelineComponent } from '#user/components/common';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from 'shared/services/order.service';

interface InputGroup {
    title?: string;
    productName?: string;
    file?: string;
    specifications?: string;
    amount?: string;
    price?: number;
    tax?: string;
    voucherCodeOrder?: string;
    repay?: string;
    currency?: string;
}

@Component({
    standalone: true,
    selector: 'nextpro-user-order-detail-buyer',
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss',
    imports: [CommonModule, FormsModule, FormComponent, MaterialModules, TimelineComponent, TranslateModule],
})
export class OrderDetailBuyerComponent implements OnInit {
    @Input() orderDetail?: I_Order;
    @Input() orderType?: I_Buyer;

    deliveryFee?: string;
    totalPayment?: string;
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
    user: any;

    constructor(
        private orderService: OrderService, // Inject dịch vụ OrderService
        private router: Router, // Inject Router để điều hướng
        private localStorageService: LocalStorageService, // Inject để lấy thông tin người dùng
    ) {
        this.user = this.localStorageService.get('user'); // Lấy thông tin user từ local storage
    }

    ngOnInit(): void {
        this.loadData();
    }

    private loadData(): void {
        console.log(this.orderDetail);
        if (this.orderDetail) {
            this.orderInformation = [
                {
                    orderCode: this.orderDetail.orderCode,
                    supplierFullName: this.orderDetail.supplier?.companyFullName,
                    companyAddress: this.orderDetail.buyer?.[0]?.address,
                    state: this.orderDetail.city?.name,
                    status: this.orderDetail.orderStatus,
                    contactFullName: this.orderDetail.buyer?.[0]?.fullName,
                    phone: this.orderDetail.buyer?.phone,
                    email: this.orderDetail.buyer?.email,
                    taxCode: this.orderDetail.taxCode,
                },
            ];

            this.orderTimeline =
                this.orderTimeline.map((defaultItem, index) => {
                    const item = this.orderDetail?.orderDeliveryTimelines?.[index];
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
                    deliveryAddress: this.orderDetail.address,
                    city: this.orderDetail.city?.name,
                    country: this.orderDetail.city?.country?.name,
                },
                {
                    id: 2,
                    deliveryAddress: this.orderDetail.address,
                    city: this.orderDetail.city?.name,
                    country: this.orderDetail.city?.country?.name,
                },
            ];

            this.inputGroups = this.orderDetail.orderItems.map((item, index) => {
                return {
                    productId: item.product.id,
                    title: `${index + 1}`,
                    productName: item.product?.productName,
                    file: this.orderDetail.orderItems?.[0]?.product?.productImages?.toString(),
                    specifications: this.orderDetail.orderItems?.[0]?.product?.specifications?.toString(),
                    amount: item.amount?.toString(),
                    price: this.orderDetail.orderItems?.[0]?.product?.initialPrice,
                    tax: item.taxGTGT?.toString(),
                    repay: `${item.refund}`,
                    currency: this.orderDetail?.orderItems?.[0]?.product?.currency?.name,
                    voucherCodeOrder: this.orderDetail.voucherCodeOrder?.voucherCode,
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
    async onReOrder() {
        await this.orderService.createOrder({
            buyerId: Number(this.user.id),
            type: E_OrderType.KCS as any,
            items: this.orderDetail.orderItems.map((item) => ({
                productId: item.product.id as any,
                amount: item.amount,
            })),
        });
        this.router.navigate(['/cart']);
    }
}
