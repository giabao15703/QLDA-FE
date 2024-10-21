import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgAnimateScrollService } from 'ng-animate-scroll';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import {
    BannerService,
    LoadingService,
    LocalStorageService,
    MasterDataService,
    ProductService,
    StoreService,
} from '#shared/services';
import { I_Banner, I_FamilyCode, I_Product } from '#shared/types';
import { getQueryVariables, shuffleArray } from '#shared/utils';
import {
    DiscountedProductsComponent,
    FamilyCodeComponent,
    GlobalSearchComponent,
    ScrollingTextComponent,
} from '#user/components/common';
import { ProductListComponent } from '#user/pages/product/list/list.component';
import { SupplierNavigationComponent } from '#user/pages/supplier/search/navigation/navigation.component';
import { FooterComponent, NavbarComponent } from 'apps/nextpro-user/src/app/layout';

@Component({
    standalone: true,
    selector: 'nextpro-user-product-page',
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss',
    imports: [
        RouterModule,
        LoadingComponent,
        MaterialModules,
        CarouselModule,
        CommonModule,
        NavbarComponent,
        FooterComponent,
        FamilyCodeComponent,
        DiscountedProductsComponent,
        ProductListComponent,
        SupplierNavigationComponent,
        TranslateModule,
        ScrollingTextComponent,
        GlobalSearchComponent,
    ],
})
export class HomepageProductPage {
    constructor(
        public loadingService: LoadingService,
        private animateScrollService: NgAnimateScrollService,
        private bannerService: BannerService,
        private productService: ProductService,
        private masterDataService: MasterDataService,
        private localStorageService: LocalStorageService,
        private storeService: StoreService,
    ) {
        this.localStorageService.onChange('languageCode', async () => {
            this.familyCodes = await this.masterDataService.getFamilyCodesWithClusterCode().then((res) => res.data);
        });
    }

    banners: I_Banner[];
    products: I_Product[];
    productPage = 1;
    productSize = 30;
    productHasNextPage;
    productFlashSalesTop: I_Product[];
    productFlashSalesBottom: I_Product[];
    familyCodes: I_FamilyCode[];

    slides = [
        { image: '../assets/images/slider/1.jpeg' },
        { image: '../assets/images/slider/2.jpeg' },
        { image: '../assets/images/slider/3.jpeg' },
        { image: '../assets/images/slider/4.jpeg' },
        { image: '../assets/images/slider/5.jpeg' },
    ];

    customOptions: OwlOptions = {
        loop: true,
        autoplay: true,
        navSpeed: 700,
        items: 1,
    };

    ngOnInit() {
        this.masterDataService.getFamilyCodesWithClusterCode().then((familyCodes) => {
            this.familyCodes = familyCodes.data;
            this.storeService.set('familyCodesWithClusterCode', this.familyCodes);
        });

        this.bannerService.getBannerList().then((banners) => {
            this.banners = banners;
        });

        this.productService
            .getSupplierProductList({
                type: 'product',
                ...getQueryVariables({
                    page: this.productPage,
                    pageSize: this.productSize,
                }),
            })
            .then((products) => {
                this.products = shuffleArray(products.data);
                this.productHasNextPage = products.pagination.hasNextPage;
            });

        this.productService
            .getSupplierProductList({
                type: 'flash_sale',
                ...getQueryVariables({
                    page: 1,
                    pageSize: 6,
                }),
            })
            .then((productFlashSalesTop) => {
                this.productFlashSalesTop = shuffleArray(productFlashSalesTop.data);
            });

        this.productService
            .getSupplierProductList({
                type: 'flash_sale',
                ...getQueryVariables({
                    page: 1,
                    pageSize: 6,
                }),
            })
            .then((productFlashSalesBottom) => {
                this.productFlashSalesBottom = shuffleArray(productFlashSalesBottom.data);
            });
    }

    navigateFindNow(id: string, duration = 750) {
        this.animateScrollService.scrollToElement(id, duration);
    }

    async loadMoreProducts() {
        if (this.loadingService.checkLoading(['getSupplierProductList'])) {
            return;
        }

        this.productPage++;
        const moreProducts = await this.productService.getSupplierProductList({
            type: 'product',
            ...getQueryVariables({
                page: this.productPage,
                pageSize: this.productSize,
            }),
        });

        this.products = [...this.products, ...shuffleArray(moreProducts.data)];
        this.productHasNextPage = moreProducts.pagination.hasNextPage;
    }
}
