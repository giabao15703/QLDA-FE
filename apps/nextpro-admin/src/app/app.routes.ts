import { Router, Routes } from '@angular/router';

import { LayoutBlank, LayoutDashboard } from '#admin/layout';
import { AccountAdminListPage } from '#admin/pages/account/admin/list/admin-list.component';
import { AccountBuyerPage } from '#admin/pages/account/buyer/buyer.component';
import { AccountSupplierPage } from '#admin/pages/account/supplier/supplier.component';
import { AuthGuard } from '#admin/pages/auth/guard';
import { LoginPage } from '#admin/pages/auth/login/login.component';
import { NotFoundPage } from '#admin/pages/page-not-found/page-not-found.component';
import { DeTaiListPage } from './pages/deTai/list/deTai-list.component';
import { KeHoachListPage } from './pages/keHoach/list/keHoach-list.component';
import { HomePage } from './pages/home/home.component';
import { GroupListPage } from './pages/group/list/group-list.component';

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
                path: 'deTai',
                children: [{ path: '', component: DeTaiListPage, data: { breadcrumb: 'Đề tài' } }],
            },
            {
                path: 'keHoach',
                children: [{ path: '', component: KeHoachListPage, data: { breadcrumb: 'Kế hoạch đồ án' } }],
            },
            {
                path: 'group',
                children: [{ path: '', component: GroupListPage, data: { breadcrumb: 'Nhóm đồ án' } }],
            },
        ],
        canActivate: [AuthGuard],
    },
    { path: '**', component: NotFoundPage },
];
