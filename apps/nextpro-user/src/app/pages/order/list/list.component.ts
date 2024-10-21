import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MaterialModules } from '#shared/modules';
import { E_OrderStatus, E_OrderType, I_Order, I_Profile, T_Any } from '#shared/types';
import { LocalStorageService, OrderService } from '#shared/services';
import { ROUTES } from '#shared/constants';
import { FormsModule } from '@angular/forms';
@Component({
    standalone: true,
    selector: 'nextpro-user-order-list',
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
    imports: [CommonModule, MaterialModules, TranslateModule, FormsModule],
})
export class ListComponent {
    @Output() detailClicked = new EventEmitter<T_Any>();
    isSupplier = false;
    showCancelModal = false;
    selectedOrder: I_Order | null = null;

    public orderStatus = {
        PENDING: E_OrderStatus.PENDING,
        DELIVERING: E_OrderStatus.DELIVERING,
        COMPLETED: E_OrderStatus.COMPLETED,
        CANCELLED: E_OrderStatus.CANCELLED,
        PAID: E_OrderStatus.PAID,
    };
    constructor(
        private orderService: OrderService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.user = this.localStorageService.get('user');
    }

    user: I_Profile = {};
    order: I_Order;
    orderList = [
        // {
        //     id: 0,
        //     productCode: 123456789,
        //     companyName: 'Công ty Cổ phần Thiết bị điều khiển từ xa DSU',
        //     productImages: '/assets/images/order-images.png',
        //     description:
        //         'Chúng tôi chuyên cung cấp thiết bị điều khiển tắt/ mở từ xa bằng remote (hoặc trên smartphone ) công nghệ mới, học được lệnh tắt mở tất cả các remote có tần số 315~433MHz,hoặc bằng sóng hồng ngoai (tv,quạt,máy lạnh...) và hẹn được giờ tắt theo ý muốn.',
        //     quantity: 200,
        //     price: 25000,
        //     receivedDate: '30/05/2023',
        //     status: 'Đang giao',
        //     totalPrice: 5500000,
        // },
    ];
    openCancelModal(item: I_Order) {
        this.selectedOrder = item;
        this.showCancelModal = true;
    }

    closeCancelModal() {
        this.showCancelModal = false;
        this.selectedOrder = null;
    }

    async confirmCancel(item: any) {
        if (this.selectedOrder) {
            try {
                await this.orderService.updateOrder({
                    id: item.order.id,
                    order: {
                        orderStatus: 'CANCELLED',
                    },
                    orderItems: [
                        {
                            productId: item.productId,
                            amount: 0,
                        },
                    ],
                });

                await this.loadOrders();
                this.closeCancelModal();
            } catch (error) {
                console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
            }
        }
    }
    async onStatusChange(item: any) {
        await this.orderService.updateOrderStatus({
            id: item.order.id,
            orderStatus: item.status as unknown as E_OrderStatus,
        });
    }

    loadOrders = async () => {
        const currentPath = this.route.snapshot.routeConfig?.path;
        let queryParams = {};
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        ROUTES;
        if (currentPath === ROUTES.USER.ORDER.BUYER) {
            queryParams = { buyerName: this.user.companyFullName };
        } else if (currentPath === ROUTES.USER.ORDER.SUPPLIER) {
            queryParams = { supplierName: this.user.companyFullName };
        }

        const orders = await this.orderService.getOrders(queryParams);

        this.orderList = orders.data
            .filter((order) => order?.orderStatus !== 'CART')
            .map((order) => ({
                orderCode: order?.orderCode,
                companyName: order?.buyer[0]?.companyFullName,
                productId: order?.orderItems[0]?.product?.id,
                productImages: order?.orderItems[0]?.product?.productImages,
                description: order?.orderItems[0]?.product?.description,
                price: order?.orderItems[0]?.product?.initialPrice,
                amount: order?.orderItems[0]?.amount,
                status: order?.orderStatus,
                orderID: order?.id,
                specification: order?.orderItems[0]?.product?.specifications,
                order,
            }))
            .filter((order) => order.productId && order.amount);
    };

    ngOnInit(): void {
        const currentPath = this.route.snapshot.routeConfig?.path;
        if (currentPath === ROUTES.USER.ORDER.SUPPLIER) {
            this.isSupplier = true;
        } else {
            this.isSupplier = false;
        }
        this.loadOrders();
    }
    onDetailClick(item: I_Order): void {
        this.detailClicked.emit(item);
    }
    async onReOrder() {
        await this.orderService.createOrder({
            buyerId: Number(this.user.id),
            type: E_OrderType.KCS as any,
            items: this.orderList.map((item) => ({
                productId: item.productId,
                amount: item.amount,
            })),
        });
        this.router.navigate(['/cart']);
    }
}
