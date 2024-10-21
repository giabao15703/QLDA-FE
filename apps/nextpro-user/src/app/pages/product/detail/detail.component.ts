import { LoadingComponent, RatingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    LoadingService,
    LocalStorageService,
    NotificationService,
    OrderService,
    ProductService,
} from '#shared/services';
import { E_OrderType, E_ProductInventoryStatusInput, I_Product, I_Profile } from '#shared/types';
import { getQueryVariables } from '#shared/utils';
import { BuyNowComponent } from '#user/components/common';
import { ProductItemComponent } from '#user/pages/product/item/item.component';
import { ProductSameCategoryComponent } from '#user/pages/product/product-same-category/product-same-category.component';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';

@Component({
    standalone: true,
    selector: 'nextpro-user-product-detail',
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss',
    imports: [
        CarouselModule,
        CommonModule,
        MaterialModules,
        FormsModule,
        TranslateModule,
        ProductSameCategoryComponent,
        RatingComponent,
        LoadingComponent,
        ProductItemComponent,
    ],
})
export class ProductDetailComponent {
    hasRelatedProducts: boolean = false;
    hasSameCategoryProducts: boolean = false;
    hasSizeInfo: boolean = false;
    hasColorInfo: boolean = false;
    @ViewChild('targetElement', { static: true }) targetElement: ElementRef;
    @Input() pagination;
    @Input() onPageChange;
    products: I_Product[];
    product: I_Product;
    productPage = 1;
    productSize = 10;
    productTabs = [
        {
            key: 'technical-specification',
            title: 'product.product-detail.technical-specification',
        },
        {
            key: 'certificate',
            title: 'product.product-detail.certificate',
        },
        {
            key: 'other-informations',
            title: 'product.product-detail.other-informations',
        },
    ];
    activeTab = 'technical-specification';

    currentPicIndex = 0;

    customOptions: OwlOptions = {
        loop: true,
        navSpeed: 600,
        items: 1,
        nav: true,
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
        dots: false,
    };

    setActiveTab(tab: string): void {
        this.activeTab = tab;
    }

    selectPic(picIndex: number) {
        if (!this.product?.productImages || this.product.productImages.length === 0) {
            return;
        }
        if (picIndex > this.product.productImages.length - 1) {
            this.currentPicIndex = 0;
        } else if (picIndex < 0) {
            this.currentPicIndex = this.product.productImages.length - 1;
        } else {
            this.currentPicIndex = picIndex;
        }
    }

    choosePreviousPic() {
        this.selectPic(this.currentPicIndex - 1);
    }

    chooseNextPic() {
        this.selectPic(this.currentPicIndex + 1);
    }

    constructor(
        public loadingService: LoadingService,
        private productService: ProductService,
        private activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        private router: Router,
        private orderService: OrderService,
        private notificationService: NotificationService,
        private localStorageService: LocalStorageService,
    ) {
        this.user = this.localStorageService.get('user');
    }

    user: I_Profile = {};

    async ngOnInit() {
        this.supplierProductClickCount();
        this.getSupplierProduct();
        const sameCategoryProducts = await this.productService.getSameCategoryProducts({
            ...getQueryVariables({ page: this.productPage, pageSize: this.productSize }),
            supplierProductId: this.activatedRoute.snapshot.paramMap.get('id'),
        });
        this.products = sameCategoryProducts.data;
        this.hasSameCategoryProducts = this.products.length > 0;
        this.targetElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
        this.hasSizeInfo = !!this.product?.size;
        this.hasColorInfo = !!this.product?.color;
    }
    ngAfterViewInit() {
        if (!this.isMobileView()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    trackById(index: number, item: I_Product): string {
        return item.id;
    }
    supplierProductClickCount = async () => {
        const supplierProductId = this.activatedRoute.snapshot.paramMap.get('id');
        await this.productService.productClickCount({ supplierProductId });
    };

    getSupplierProduct = async () => {
        const product = await this.productService.getSupplierProduct({
            id: this.activatedRoute.snapshot.paramMap.get('id'),
        });

        this.product = product;
        this.hasRelatedProducts = this.product.relatedSupplierProductList?.length > 0;
    };

    // getMinMaxPrice(product: SupplierProductNode) {
    //     const priceBracket = product?.productWholesalePriceList;
    //     if (!priceBracket?.edges?.length) {
    //         return null;
    //     }

    //     let _minPrice = priceBracket.edges[0].node.priceBracket;
    //     let _maxPrice = priceBracket.edges[0].node.priceBracket;
    //     const tempBracket = priceBracket.edges.slice(1);

    //     tempBracket.forEach((item) => {
    //         if (item.node.priceBracket > _maxPrice) _maxPrice = item.node.priceBracket;
    //         if (item.node.priceBracket < _minPrice) _minPrice = item.node.priceBracket;
    //     });

    //     return { min: _minPrice, max: _maxPrice, equal: _minPrice == _maxPrice };
    // }

    // getDelivery(prod: SupplierProductNode) {
    //     if (!prod?.productWholesalePriceList.edges?.length) return null;
    //     const listDays = prod?.productWholesalePriceList.edges?.map((item) => Number(item.node.deliveryDays));
    //     const _min = Math.min(...listDays);
    //     const _max = Math.max(...listDays);
    //     return {
    //         min: _min,
    //         max: _max,
    //         isEqual: _min == _max,
    //     };
    // }

    /* ngAfterViewInit() {
        if (!this.isMobileView()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } */

    isMobileView(): boolean {
        return window.innerWidth <= 500;
    }

    inventoryStatus: { value: E_ProductInventoryStatusInput; view: string }[] = [
        {
            value: E_ProductInventoryStatusInput.STOCKING,
            view: 'account.product.productStatuses.STOCKING',
        },
        {
            value: E_ProductInventoryStatusInput.OUT_OF_STOCK,
            view: 'account.product.productStatuses.OUT_OF_STOCK',
        },
    ];

    onSlideChange(event: SlidesOutputData): void {
        const currentIndex = event.startPosition;
        const currentTab = this.productTabs[currentIndex];
        if (currentTab) {
            this.setActiveTab(currentTab.key);
        }
    }

    openBuyNowDialog(): void {
        const dialogRef = this.dialog.open(BuyNowComponent, {
            width: '900px',
            panelClass: 'custom-dialog',
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Dialog was closed. Result:', result);
        });
    }

    async addToCart() {
        const supplierProductId = this.activatedRoute.snapshot.paramMap.get('id');
        const { createOrder } = await this.orderService.createOrder({
            buyerId: Number(this?.user?.id),
            items: [
                {
                    productId: Number(supplierProductId),
                    taxGTGT: 10,
                    amount: 1,
                },
            ],
            type: E_OrderType.KCS as any,
        });
        if (createOrder.status) {
            this.notificationService.success('Thêm giỏ hàng thành công');
        } else {
            this.notificationService.error('Thêm giỏ hàng thất bại');
        }
    }

    get productImagesNodes() {
        return this.product?.productImages?.[0]?.edges.map((edge) => edge.node) || [];
    }

    get productWholesalePriceNodes() {
        return this.product?.productWholesalePriceList?.[0]?.edges.map((edge) => edge.node) || [];
    }
}
