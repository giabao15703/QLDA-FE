import { Router, Routes } from '@angular/router';

import { LayoutBlank, LayoutDashboard } from '#admin/layout';
import { AccountAdminListPage } from '#admin/pages/account/admin/list/admin-list.component';
import { AccountBuyerPage } from '#admin/pages/account/buyer/buyer.component';
import { AccountSupplierPage } from '#admin/pages/account/supplier/supplier.component';
import { AuthGuard } from '#admin/pages/auth/guard';
import { LoginPage } from '#admin/pages/auth/login/login.component';
import { BannerListPage } from '#admin/pages/banner/list/banner-list.component';
import { BuyerClubListPage } from '#admin/pages/buyer-club/list/buyer-club-list.component';
import { CouponListPage } from '#admin/pages/coupon/list/coupon-list.component';
import { AdminDeliveryResponsibleListComponent } from '#admin/pages/delivery/delivery-responsible/list/delivery-responsible-list.component';
import { AdminDeliveryShippingFeeListComponent } from '#admin/pages/delivery/shipping-fee/list/shipping-fee-list.component';
import { AdminDeliveryTransporterListComponent } from '#admin/pages/delivery/transporter/list/transporter-list.component';
import { DiamondSponsorListPage } from '#admin/pages/diamond-sponsor/list/diamond-sponsor-list.component';
import { FlashSaleListPage } from '#admin/pages/flash-sale/list/flash-sale-list.component';
import { HomePage } from '#admin/pages/home/home.component';
import { CCCPage } from '#admin/pages/master-data/ccc/ccc.component';
import { CityListPage } from '#admin/pages/master-data/city/list/city-list.component';
import { CountryListPage } from '#admin/pages/master-data/country/list/country-list.component';
import { CurrencyListPage } from '#admin/pages/master-data/currency/list/currency-list.component';
import { DeliveryTermListPage } from '#admin/pages/master-data/delivery-term/list/delivery-term-list.component';
import { EmailTemplateListPage } from '#admin/pages/master-data/email-template/list/email-template-list.component';
import { GenderListPage } from '#admin/pages/master-data/gender/list/gender-list.component';
import { IndustrialListPage } from '#admin/pages/master-data/industrial-list/industrial-list.component';
import { LanguegeListPage } from '#admin/pages/master-data/language/list/language-list.component';
import { NumberOfEmployeeListPage } from '#admin/pages/master-data/number-of-employee/list/number-of-employee-list.component';
import { PaymentTermListPage } from '#admin/pages/master-data/payment-term/list/payment-term-list.component';
import { PositionListPage } from '#admin/pages/master-data/position/list/position-list.component';
import { PromotionPage } from '#admin/pages/master-data/promotion/promotion.component';
import { RejectReasonListPage } from '#admin/pages/master-data/reject-reason/list/reject-reason-list.component';
import { UnitOfMeasureListPage } from '#admin/pages/master-data/unit-of-measure/list/unit-of-measure-list.component';
import { VoucherListPage } from '#admin/pages/master-data/voucher/list/voucher-list.component';
import { OurPartnerListPage } from '#admin/pages/our-partner/list/our-partner-list.component';
import { NotFoundPage } from '#admin/pages/page-not-found/page-not-found.component';
import { BuyerPaymentListPage } from '#admin/pages/payment/buyer/list/buyer-list.component';
import { PaymentSupplierListPage } from '#admin/pages/payment/supplier/supplier.component';
import { ProductListPage } from '#admin/pages/product/list/product-list.component';
import { PurchaseOrderListPage } from '#admin/pages/purchase-order-list/list/purchase-order-list-list.component';
import { RfxListPage } from '#admin/pages/rfx/list/rfx-list.component';
import { SaleSchemeAuctionFeeListPage } from '#admin/pages/sale-scheme/auction-fee/list/auction-fee-list.component';
import { SaleSchemeBuyerListPage } from '#admin/pages/sale-scheme/buyer/list/buyer-list.component';
import { SaleSchemeFlatrateListPage } from '#admin/pages/sale-scheme/flatrate/list/flatrate-list.component';
import { SaleSchemeSponsorFeeListPage } from '#admin/pages/sale-scheme/sponsor-fee/list/sponsor-fee-list.component';
import { SaleSchemeSupplierListPage } from '#admin/pages/sale-scheme/supplier/supplier-list.component';
import { SicpPage } from '#admin/pages/sicp/sicp.component';
import { UserGuideBuyerPage } from '#admin/pages/user-guide/buyer/buyer.component';
import { UserGuideSupplierPage } from '#admin/pages/user-guide/supplier/supplier.component';
import { WarrantyTermListPage } from './pages/master-data/warranty-term/list/warranty-term-list.component';
import { Injector } from '@angular/core';
/* import { KeHoachListPage } from './pages/keHoach/list/keHoach-list.component'; */
/* import { GroupListComponent } from './pages/group/list/group-list.component'; */
/* import { DeTaiListPage} from './pages/deTai/list/deTai-list.component'; */

export const appRoutes: Routes = [
    { path: '', redirectTo: 'admin/home', pathMatch: 'full' },
    { path: 'admin', redirectTo: 'admin/home', pathMatch: 'full' },
    {
        path: 'auth',
        component: LayoutBlank,
        children: [{ path: 'login', component: LoginPage }],
    },
    {
        path: 'admin',
        component: LayoutDashboard,
        children: [
            { path: 'home', component: HomePage, data: { breadcrumb: 'Home' } },
            {
                path: 'account/buyer',
                children: [{ path: '', component: AccountSupplierPage, data: { breadcrumb: 'Account - Buyer' } }],
            },
            {
                path: 'account',
                children: [{ path: '', component: AccountBuyerPage, data: { breadcrumb: 'Account' } }],
            },
            {
                path: 'account/admin',
                children: [{ path: '', component: AccountAdminListPage, data: { breadcrumb: 'Account - Admin' } }],
            },
            {
                path: 'master-data/country',
                children: [{ path: '', component: CountryListPage, data: { breadcrumb: 'Master Data - Country' } }],
            },
            {
                path: 'master-data/city',
                children: [{ path: '', component: CityListPage, data: { breadcrumb: 'Master Data - City' } }],
            },
            {
                path: 'master-data/currency',
                children: [{ path: '', component: CurrencyListPage, data: { breadcrumb: 'Master Data - Currency' } }],
            },
            {
                path: 'master-data/unit-of-measure',
                children: [
                    {
                        path: '',
                        component: UnitOfMeasureListPage,
                        data: { breadcrumb: 'Master Data - Unit of Measure' },
                    },
                ],
            },
            {
                path: 'master-data/delivery-term',
                children: [
                    { path: '', component: DeliveryTermListPage, data: { breadcrumb: 'Master Data - Delivery Term' } },
                ],
            },
            {
                path: 'master-data/payment-term',
                children: [
                    { path: '', component: PaymentTermListPage, data: { breadcrumb: 'Master Data - Payment Term' } },
                ],
            },
            {
                path: 'master-data/reject-reason',
                children: [
                    { path: '', component: RejectReasonListPage, data: { breadcrumb: 'Master Data - Reject Reason' } },
                ],
            },
            {
                path: 'master-data/industrial-list',
                children: [
                    { path: '', component: IndustrialListPage, data: { breadcrumb: 'Master Data - Industrial List' } },
                ],
            },
            {
                path: 'master-data/position',
                children: [{ path: '', component: PositionListPage, data: { breadcrumb: 'Master Data - Position' } }],
            },
            {
                path: 'master-data/language',
                children: [{ path: '', component: LanguegeListPage, data: { breadcrumb: 'Master Data - Language' } }],
            },
            {
                path: 'master-data/gender',
                children: [{ path: '', component: GenderListPage, data: { breadcrumb: 'Master Data - Gender' } }],
            },
            {
                path: 'master-data/number-of-employee',
                children: [
                    {
                        path: '',
                        component: NumberOfEmployeeListPage,
                        data: { breadcrumb: 'Master Data - Number of Employee' },
                    },
                ],
            },
            {
                path: 'master-data/warranty-term',
                children: [
                    { path: '', component: WarrantyTermListPage, data: { breadcrumb: 'Master Data - Warranty Term' } },
                ],
            },
            {
                path: 'master-data/ccc',
                children: [{ path: '', component: CCCPage, data: { breadcrumb: 'Master Data - CCC' } }],
            },
            {
                path: 'master-data/promotion',
                children: [{ path: '', component: PromotionPage, data: { breadcrumb: 'Master Data - Promotion' } }],
            },
            {
                path: 'master-data/email-template',
                children: [
                    {
                        path: '',
                        component: EmailTemplateListPage,
                        data: { breadcrumb: 'Master Data - Email Template' },
                    },
                ],
            },
            /* {
                path: 'master-data/set-product-advertisement',
                children: [
                    {
                        path: '',
                        component: SetProductAdvertisementListPage,
                        data: { breadcrumb: 'Set Product Advertisement' },
                    },
                ],
            },
            {
                path: 'master-data/buyer-club-voucher',
                children: [
                    { path: '', component: BuyerClubVoucherListPage, data: { breadcrumb: 'Buyer Club Voucher' } },
                ],
            }, */
            {
                path: 'master-data/voucher',
                children: [
                    {
                        path: '',
                        component: VoucherListPage,
                        data: { breadcrumb: 'Master Data - Voucher' },
                    },
                ],
            },
            {
                path: 'sale-scheme/auction-fee',
                children: [
                    {
                        path: '',
                        component: SaleSchemeAuctionFeeListPage,
                        data: { breadcrumb: 'Sale Scheme - Auction Fee' },
                    },
                ],
            },
            {
                path: 'sale-scheme/flatrate',
                children: [
                    { path: '', component: SaleSchemeFlatrateListPage, data: { breadcrumb: 'Sale Scheme - Flatrate' } },
                ],
            },
            {
                path: 'sale-scheme/sponsor-fee',
                children: [
                    {
                        path: '',
                        component: SaleSchemeSponsorFeeListPage,
                        data: { breadcrumb: 'Sale Scheme - Sponsor Fee' },
                    },
                ],
            },
            {
                path: 'sale-scheme/buyer',
                children: [
                    { path: '', component: SaleSchemeBuyerListPage, data: { breadcrumb: 'Sale Scheme - Buyer' } },
                ],
            },
            {
                path: 'sale-scheme/supplier',
                children: [
                    { path: '', component: SaleSchemeSupplierListPage, data: { breadcrumb: 'Sale Scheme - Supplier' } },
                ],
            },
            {
                path: 'flash-sale',
                children: [{ path: '', component: FlashSaleListPage, data: { breadcrumb: 'Flash Sale' } }],
            },
            {
                path: 'product',
                children: [{ path: '', component: ProductListPage, data: { breadcrumb: 'Product' } }],
            },
            /* {
                path: 'group',
                children: [{ path: '', component: GroupListComponent, data: { breadcrumb: 'Group' } }],
            }, */
            {
                path: 'diamond-sponsor',
                children: [{ path: '', component: DiamondSponsorListPage, data: { breadcrumb: 'Diamond Sponsor' } }],
            },
            {
                path: 'payment/buyer',
                children: [{ path: '', component: BuyerPaymentListPage, data: { breadcrumb: 'Payment - Buyer' } }],
            },
            {
                path: 'payment/supplier',
                children: [
                    { path: '', component: PaymentSupplierListPage, data: { breadcrumb: 'Payment - Supplier' } },
                ],
            },

            {
                path: 'delivery',
                children: [
                    {
                        path: 'transporter-list',
                        component: AdminDeliveryTransporterListComponent,
                        data: { breadcrumb: 'Transporter List' },
                    },
                    {
                        path: 'delivery-responsible',
                        component: AdminDeliveryResponsibleListComponent,
                        data: { breadcrumb: 'Delivery Responsible' },
                    },
                    {
                        path: 'shipping-fee',
                        component: AdminDeliveryShippingFeeListComponent,
                        data: { breadcrumb: 'Shipping Fee' },
                    },
                ],
            },
            {
                path: 'coupon',
                children: [{ path: '', component: CouponListPage, data: { breadcrumb: 'Coupon' } }],
            },
            {
                path: 'deTai',
                /* children: [{ path: '', component: DeTaiListPage, data: { breadcrumb: 'Giảng Viên' } }], */
            },
            /* {
                path: 'keHoach',
                children: [{ path: '', component: KeHoachListPage, data: { breadcrumb: 'Trưởng Khoa' } }],
            }, */
            {
                path: 'our-partner',
                children: [{ path: '', component: OurPartnerListPage, data: { breadcrumb: 'Our Partners' } }],
            },
            {
                path: 'user-guide/buyer',
                children: [{ path: '', component: UserGuideBuyerPage, data: { breadcrumb: 'User Guide - Buyer' } }],
            },
            {
                path: 'user-guide/supplier',
                children: [
                    { path: '', component: UserGuideSupplierPage, data: { breadcrumb: 'User Guide - Supplier' } },
                ],
            },
            {
                path: 'banner',
                children: [{ path: '', component: BannerListPage, data: { breadcrumb: 'Banner' } }],
            },
            {
                path: 'sicp',
                children: [{ path: '', component: SicpPage, data: { breadcrumb: 'SICP' } }],
            },
            {
                path: 'rfx',
                children: [{ path: '', component: RfxListPage, data: { breadcrumb: 'RFx' } }],
            },
            {
                path: 'purchase-order-list',
                children: [{ path: '', component: PurchaseOrderListPage, data: { breadcrumb: 'Purchase Order List' } }],
            },

            {
                path: 'buyer-club',
                children: [{ path: '', component: BuyerClubListPage, data: { breadcrumb: 'Buyer Club' } }],
            },
            /* {
                path: 'organization-management',
                children: [
                    {
                        path: '',
                        component: OrganizationManagementListPage,
                        data: { breadcrumb: 'Organization Management' },
                    },
                ],
            }, */
            /* {
                path: 'banner-industry-focus',
                children: [
                    {
                        path: '',
                        component: BannerIndustryFocusListPage,
                        data: { breadcrumb: 'Banner Industry Focus' },
                    },
                ],
            }, */
        ],
        canActivate: [AuthGuard],
    },
    { path: '**', component: NotFoundPage },
];
