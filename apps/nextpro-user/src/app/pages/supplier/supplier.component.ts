import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgAnimateScrollService } from 'ng-animate-scroll';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { AccountService, BannerService, LoadingService, MasterDataService, OurPartnerService } from '#shared/services';
import { E_LoadingType, I_Banner, I_FamilyCode, I_OurPartner, I_Supplier } from '#shared/types';
import { getQueryVariables } from '#shared/utils';
import { DiscountedProductsComponent, FamilyCodeComponent, GlobalSearchComponent } from '#user/components/common';
import { OurPartnerComponent } from '#user/pages/supplier/our-partner/our-partner.component';
import { ListSupplierComponent } from '#user/pages/supplier/search/list-supplier/list-supplier.component';
import { FooterComponent, NavbarComponent } from 'apps/nextpro-user/src/app/layout';

@Component({
    standalone: true,
    selector: 'nextpro-user-supplier-page',
    templateUrl: './supplier.component.html',
    styleUrl: './supplier.component.scss',
    imports: [
        GlobalSearchComponent,
        CommonModule,
        MaterialModules,
        CarouselModule,
        NavbarComponent,
        FooterComponent,
        FamilyCodeComponent,
        DiscountedProductsComponent,
        ListSupplierComponent,
        OurPartnerComponent,
        TranslateModule,
        LoadingComponent,
    ],
})
export class HomepageSupplierPage {
    constructor(
        public loadingService: LoadingService,
        private animateScrollService: NgAnimateScrollService,
        private bannerService: BannerService,
        private masterDataService: MasterDataService,
        private accountService: AccountService,
        private ourPartnerService: OurPartnerService,
    ) {}

    @Output() removeSupplier = new EventEmitter<string>();

    banners: I_Banner[];
    familyCodes: I_FamilyCode[];
    suppliers: I_Supplier[];
    suppliersPage = 1;
    suppliersSize = 10;
    suppliersHasNextPage;
    ourPartners: I_OurPartner[];
    selectedSuppliers: I_Supplier[] = [];
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

    navigateFindNow(id: string, duration = 750) {
        this.animateScrollService.scrollToElement(id, duration);
    }

    async ngOnInit() {
        this.banners = await this.bannerService.getBannerList();
        this.familyCodes = await this.masterDataService.getFamilyCodes().then((res) => res.data);
        const suppliers = await this.accountService.getSuppliers({
            ...getQueryVariables({
                page: this.suppliersPage,
                pageSize: this.suppliersSize,
            }),
        });
        this.suppliers = suppliers.data;
        this.suppliersHasNextPage = suppliers.pagination.hasNextPage;
        const ourPartners = await this.ourPartnerService.getOurPartners();

        this.ourPartners = ourPartners.data;
    }

    ngOnDestroy() {
        this.loadingService.unsubscribe();
    }

    onToggleSupplier(supplier: I_Supplier) {
        const supplierIndex = this.selectedSuppliers.findIndex((s) => s.id === supplier.id);
        if (supplierIndex > -1) this.selectedSuppliers.splice(supplierIndex, 1);
        else this.selectedSuppliers.push(supplier);
    }

    onRemoveSupplier(supplierId: string) {
        const supplierIndex = this.selectedSuppliers.findIndex((s) => s.id === supplierId);
        if (supplierIndex > -1) this.selectedSuppliers.splice(supplierIndex, 1);
    }

    remove(sup: I_Supplier) {
        const supplierIndex = this.selectedSuppliers.findIndex((s) => s.id === sup.id);
        if (supplierIndex > -1) {
            this.selectedSuppliers.splice(supplierIndex, 1);
            this.removeSupplier.emit(sup.id);
        }
    }
    async loadMoreSuppliers() {
        if (this.loadingService.checkLoading(['getSuppliers'])) {
            return;
        }

        this.suppliersPage++;
        const moresuppliers = await this.accountService.getSuppliers(
            {
                ...getQueryVariables({
                    page: this.suppliersPage,
                    pageSize: this.suppliersSize,
                }),
            },
            {
                loading: E_LoadingType.LOCAL,
            },
        );

        this.suppliers = [...this.suppliers, ...moresuppliers.data];
        this.suppliersHasNextPage = moresuppliers.pagination.hasNextPage;
    }
}
