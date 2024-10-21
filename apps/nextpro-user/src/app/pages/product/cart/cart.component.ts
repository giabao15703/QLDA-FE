import { MaterialModules } from '#shared/modules';
import { LocalStorageService, OrderService } from '#shared/services';
import { E_OrderStatus, I_Order, I_Profile } from '#shared/types';
import { QuantitySelectorComponent } from '#user/components/common';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
interface I_ProductInfo {
    id?: string;
    productCode?: string;
    companyName?: string;
    productImages?: any;
    description?: string;
    quantity?: number;
    price?: number;
    totalPrice?: number;
    receivedDate?: string;
    status?: string;
}

@Component({
    standalone: true,
    selector: 'nextpro-user-cart-component',
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss',
    imports: [CommonModule, MaterialModules, FormsModule, QuantitySelectorComponent],
})
export class CartComponent {
    constructor(
        private orderService: OrderService,
        private localStorageService: LocalStorageService,
        private router: Router,
    ) {
        this.user = this.localStorageService.get('user');
    }

    user: I_Profile = {};
    order: I_Order;

    productInfo: I_ProductInfo[] = [
        // {
        //     id: 0,
        //     productCode: 123456789,
        //     companyName: 'Công ty Cổ phần Thiết bị điều khiển từ xa DSU',
        //     productImages: '/assets/images/product-cart.png',
        //     description:
        //         'Điều khiển từ xa dành cho các loại TV, loa, máy lạnh, máy giặt, máy phát điện, cửa, rèm và các loại thiết bị có thể điều khiển được bằng sóng hồng ngoại. Sản phẩm được thiết kế nhỏ gọn, dễ sử dụng, tiết kiệm điện năng, giúp bạn điều khiển các thiết bị từ xa một cách dễ dàng và nhanh chóng.',
        //     quantity: 200,
        //     price: 25000,
        //     receivedDate: '30/05/2023',
        //     status: 'Đang giao',
        //     totalPrice: 5000000,
        // },
    ];

    async ngOnInit(): Promise<void> {
        await this.getOrder();
        if (this.order) {
            this.loadCarts();
        }
    }

    private async getOrder() {
        const { data } = await this.orderService.getOrders({
            buyerName: this.user.companyFullName,
            orderStatus: E_OrderStatus.CART,
        });
        this.order = data[0];
    }
    private async loadCarts() {
        const carts = this.order?.orderItems;
        this.productInfo = carts?.map((item) => ({
            id: item?.product?.id,
            productCode: item?.product?.skuNumber,
            companyName: item?.product?.userSupplier?.companyFullName,
            productImages: item?.product?.productImages[0],
            description: item?.product?.description,
            quantity: item?.amount,
            price: item?.product?.discountedPrice,
            // receivedDate: '30/05/2023',
            // status: 'Đang giao',
            totalPrice: item?.amount * item?.product?.discountedPrice,
        }));
    }

    async onQuantityChange(newQuantity: number, product: I_ProductInfo) {
        await this.orderService.updateOrder({
            id: this.order.id,
            order: {
                orderStatus: 'CART',
            },
            orderItems: [
                {
                    productId: Number(product.id),
                    amount: newQuantity,
                },
            ],
        });
        if (newQuantity === 0) {
            this.productInfo = this.productInfo.filter((p) => p.id !== product.id);
        } else {
            const updatedProduct = this.productInfo.find((p) => p.id === product.id);
            if (updatedProduct) {
                updatedProduct.quantity = newQuantity;
                updatedProduct.totalPrice = newQuantity * (updatedProduct.price || 0);
            }
        }
    }

    async onDeleteProduct(product: I_ProductInfo) {
        await this.orderService.updateOrder({
            id: this.order.id,
            order: {
                orderStatus: 'CART',
            },
            orderItems: [
                {
                    productId: Number(product.id),
                    amount: 0,
                },
            ],
        });

        this.productInfo = this.productInfo.filter((p) => p.id !== product.id);
    }
    onBuyNow = async () => {
        this.getOrder();
        await this.orderService.updateOrderStatus({
            id: this.order?.id,
            orderStatus: E_OrderStatus.PENDING,
        });
        const vat = 0;
        const promotionPaymentFee = 0;
        const paymentFee = this.order?.totalAmount;
        const acc = {
            orderNumber: this.order?.id,
            accountCode: this.order?.supplier?.companyFullName,
            description: 'Order Payment',
            paymentFee,
            notes: '',
            promotionPaymentFee,
            fullName: this.order?.supplier?.companyFullName,
            accountName: this.order?.supplier?.companyFullName,
            taxCode: this.order?.supplier?.companyTax,
            registeredAddress: this.order?.supplier?.companyAddress,
            grandTotal: this.calculateGrandTotal(paymentFee, promotionPaymentFee, vat),
            profileFeatures: {
                id: this.user?.profileFeatures?.id,
            },
            vat,
        };
        this.localStorageService.set('AccountPaymentInfo', acc);
        this.router.navigate(['/payment/payment-account']);
    };
    calculateGrandTotal(paymentFee: number, promotionPaymentFee: number, VAT: number): number {
        const discountPrice = paymentFee - promotionPaymentFee;
        const vat = (discountPrice * VAT) / 100;
        return discountPrice + vat;
    }
}
