import { Router, Routes } from '@angular/router';

import { LayoutBlank, LayoutDashboard } from '#admin/layout';
import { AccountAdminListPage } from '#admin/pages/account/admin/list/admin-list.component';
import { AccountBuyerPage } from '#admin/pages/account/buyer/buyer.component';
import { AuthGuard } from '#admin/pages/auth/guard';
import { LoginPage } from '#admin/pages/auth/login/login.component';
import { NotFoundPage } from '#admin/pages/page-not-found/page-not-found.component';
import { DeTaiListPage } from './pages/deTai/list/deTai-list.component';
import { KeHoachListPage } from './pages/keHoach/list/keHoach-list.component';
import { HomePage } from './pages/home/home.component';
import { GroupListPage } from './pages/group/list/group-list.component';
import { ChamHuongDanListPage } from './pages/cham-huong-dan/list/cham-huong-dan-list.component';
import { ChamPhanBienListPage } from './pages/cham-phan-bien/list/cham-phan-bien-list.component';
import { NotificationListPage } from './pages/notification/list/notification-list.component';

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
                path: 'cham-huong-dan',
                children: [{ path: '', component: ChamHuongDanListPage, data: { breadcrumb: 'Chấm hướng dẫn' } }],
            },
            {
                path: 'cham-phan-bien',
                children: [{ path: '', component: ChamPhanBienListPage, data: { breadcrumb: 'Chấm phản biện' } }],
            },
            {
                path: 'group',
                children: [{ path: '', component: GroupListPage, data: { breadcrumb: 'Nhóm đồ án' } }],
            },
            {
                path: 'notification',
                children: [
                    {
                        path: '',
                        component: NotificationListPage,
                        data: { breadcrumb: 'Thông báo' },
                    },
                ],
            },
        ],
        canActivate: [AuthGuard],
    },
    { path: '**', component: NotFoundPage },
];
