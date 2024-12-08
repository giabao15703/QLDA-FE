import { Routes } from '@angular/router';

import { OrderBuyerComponent, OrderSupplierComponent } from '#shared/components';
import { ROUTES } from '#shared/constants';
import { UserAuthPage } from '#user/pages/auth/auth.component';
import { BecomeBuyerPage } from '#user/pages/auth/register/become-buyer/become-buyer.component';
import { BecomeSupplierPage } from '#user/pages/auth/register/become-supplier/become-supplier.component';
import { ThankYouPage } from '#user/pages/auth/register/thank-you/thank-you.component';
import { BuyerClubPage } from '#user/pages/buyer/buyer-club/buyer-club.component';
// import { CartPage } from '#user/pages/cart/cart.component';
// import { CustomerSupportBuyerPage } from '#user/pages/customer-support/buyer/buyer.component';
// import { CustomerSupportSupplierPage } from '#user/pages/customer-support/supplier/supplier.component';
// import { EAuctionComponent } from '#user/pages/e-auction/e-auction.component';
// import { OrderManagementBuyerPage } from '#user/pages/order/buyer/buyer.component';
// import { RatingBuyerPage } from '#user/pages/order/buyer/rating/rating.component';
// import { CancelOrderPage } from '#user/pages/order/cancel-order/cancel-order.component';
// import { RatingSupplierPage } from '#user/pages/order/supplier/rating/rating.component';
// import { OrderManagementSupplierPage } from '#user/pages/order/supplier/supplier.component';
// import { OrderManagementTransporterPage } from '#user/pages/order/transporter/transporter.component';
import { NotFoundPage } from '#user/pages/page-not-found/page-not-found.component';
// import { MyPaymentAccountComponent } from '#user/pages/payment/my-account/my-account.component';
// import { PaymentComponent } from '#user/pages/payment/payment.component';
// import { PendingPaymentComponent } from '#user/pages/payment/pending/pending.component';
// import { TopUpComponent } from '#user/pages/payment/top-up/top-up.component';
// import { ProductDetailsPage } from '#user/pages/product/detail/product-detail.component';
// import { ProductSetAdvertisingPage } from '#user/pages/product/product-set/product-set.component';
// import { HomepageProductPage } from '#user/pages/product/product.component';
// import { ProductSearchPage } from '#user/pages/product/search/product-search.component';
// import { RequirementComponent } from '#user/pages/requirement/requirement.component';
// import { SupplierDetailPage } from '#user/pages/supplier/detail/detail.component';
// import { SupplierProfilePage } from '#user/pages/supplier/profile/profile.component';
// import { SupplierSearchPage } from '#user/pages/supplier/search/supplier-search.component';
// import { HomepageSupplierPage } from '#user/pages/supplier/supplier.component';
import { SupplierPaymentAccountPage } from 'shared/components/account/supplier/upgrade-profile_deleted/payment/payment.component';
import { DashboardComponent } from '#user/pages/dashboard/dashboard.component';
import { ProjectRegistrationComponent } from '#user/pages/project-registration/project-registration.component';
import { GroupComponent } from '#user/pages/group/group.component';
import { GroupRegistrationComponent } from '#user/pages/group-registration/group-registration.component';
import { NotificationComponent } from '#user/pages/notification/notification.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: ROUTES.USER.DASHBOARD.ROOT, pathMatch: 'full' },
    // #region AUTHENTICATION
    {
        path: ROUTES.USER.AUTH.ROOT,
        component: UserAuthPage,
    },
    {
        path: ROUTES.USER.AUTH.REGISTER.THANK_YOU,
        component: ThankYouPage,
    },
    {
        path: ROUTES.USER.AUTH.REGISTER.BECOME_BUYER,
        component: BecomeBuyerPage,
    },
    {
        path: ROUTES.USER.AUTH.REGISTER.BECOME_SUPPLIER,
        component: BecomeSupplierPage,
    },
    // #endregion

    {
        path: ROUTES.USER.DASHBOARD.ROOT,
        component: DashboardComponent,
    },

    {
        path: ROUTES.USER.GROUP.ROOT,
        component: GroupComponent,
    },
    {
        path: ROUTES.USER.NOTIFICATION.ROOT,
        component: NotificationComponent,
    },
    {
        path: ROUTES.USER.GROUP_REGISTRATION.ROOT,
        component: GroupRegistrationComponent,
    },

    {
        path: ROUTES.USER.PROJECT_REGISTRATION.ROOT,
        component: ProjectRegistrationComponent,
    },

    // // #region PRODUCT
    // {
    //     path: ROUTES.USER.PRODUCT.ROOT,
    //     component: HomepageProductPage,
    // },
    // {
    //     path: ROUTES.USER.PRODUCT.SEARCH,
    //     component: ProductSearchPage,
    // },
    // {
    //     path: ROUTES.USER.PRODUCT.DETAIL,
    //     component: ProductDetailsPage,
    // },
    // // #endregion

    // // #region SUPPLIER
    // {
    //     path: ROUTES.USER.SUPPLIER.ROOT,
    //     component: HomepageSupplierPage,
    // },
    // {
    //     path: ROUTES.USER.SUPPLIER.SEARCH,
    //     component: SupplierSearchPage,
    // },
    // {
    //     path: ROUTES.USER.SUPPLIER.PROFILE,
    //     component: SupplierProfilePage,
    // },
    // {
    //     path: ROUTES.USER.SUPPLIER.DETAIL,
    //     component: SupplierDetailPage,
    // },
    {
        path: ROUTES.USER.SUPPLIER.PAYMENT.ROOT,
        component: SupplierPaymentAccountPage,
    },
    {
        path: ROUTES.USER.SUPPLIER.ORDER.ROOT,
        component: OrderSupplierComponent,
    },
    // #endregion

    // #region BUYER
    {
        path: ROUTES.USER.BUYER.ORDER.ROOT,
        component: OrderBuyerComponent,
    },
    {
        path: ROUTES.USER.BUYER_CLUB.ROOT,
        component: BuyerClubPage,
    },
    // #endregion

    // {
    //     path: ROUTES.USER.CART.ROOT,
    //     component: CartPage,
    // },
    // {
    //     path: ROUTES.USER.REQUIREMENT.ROOT,
    //     component: RequirementComponent,
    // },
    // {
    //     path: ROUTES.USER.EAUCTION.ROOT,
    //     component: EAuctionComponent,
    // },

    // // #region PAYMENT
    // {
    //     path: ROUTES.USER.PAYMENT.ROOT,
    //     component: PaymentComponent,
    //     children: [
    //         {
    //             path: '',
    //             redirectTo: ROUTES.USER.PAYMENT.MY_ACCOUNT,
    //             pathMatch: 'full',
    //         },
    //         {
    //             path: ROUTES.USER.PAYMENT.MY_ACCOUNT,
    //             component: MyPaymentAccountComponent,
    //         },
    //         {
    //             path: ROUTES.USER.PAYMENT.PENDING_PAYMENT,
    //             component: PendingPaymentComponent,
    //         },
    //     ],
    // },
    // {
    //     path: ROUTES.USER.TOPUP.ROOT,
    //     component: TopUpComponent,
    // },
    // // #endregion

    // {
    //     path: ROUTES.USER.ORDER.BUYER,
    //     component: OrderManagementBuyerPage,
    // },
    // {
    //     path: ROUTES.USER.ORDER.SUPPLIER,
    //     component: OrderManagementSupplierPage,
    // },
    // {
    //     path: ROUTES.USER.ORDER.TRANSPORTER,
    //     component: OrderManagementTransporterPage,
    // },
    // {
    //     path: ROUTES.USER.ORDER.DETAIL.CANCEL,
    //     component: CancelOrderPage,
    // },
    // {
    //     path: ROUTES.USER.PRODUCT_SET_ADVERTISING.ROOT,
    //     component: ProductSetAdvertisingPage,
    // },
    // {
    //     path: 'buyer-rating',
    //     component: RatingBuyerPage,
    // },
    // {
    //     path: 'supplier-rating',
    //     component: RatingSupplierPage,
    // },
    // {
    //     path: 'customer-support',
    //     children: [
    //         {
    //             path: 'buyer',
    //             component: CustomerSupportBuyerPage,
    //         },
    //         {
    //             path: 'supplier',
    //             component: CustomerSupportSupplierPage,
    //         },
    //     ],
    // },

    { path: '**', component: NotFoundPage },
];
