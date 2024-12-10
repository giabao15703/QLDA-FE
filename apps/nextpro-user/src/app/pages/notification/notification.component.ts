import { Component } from '@angular/core';
import { SidebarComponent } from '#user/layout/sidebar/sidebar.component';
import { NavbarComponent } from '#user/layout';
import { I_QueryVariables } from '#shared/types';
import { NotificationQLDAService } from '#shared/services';
import { getQueryVariables } from '#shared/utils';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    imports: [SidebarComponent, NavbarComponent, CommonModule],
    providers: [DatePipe],
})
export class NotificationComponent {
    notifications: any[] = [];

    constructor(
        private notificationQLDAService: NotificationQLDAService,
        private datePipe: DatePipe,
    ) {}

    ngOnInit() {
        this.getNotifications();
    }
    getNotifications = async (variables?: I_QueryVariables) => {
        const notifications = await this.notificationQLDAService.getNotifications({}, { extra: { variables } });
        console.log('Danh sách thông báo:', notifications);
        this.notifications = (notifications.data || []).filter((notification: any) => notification.status === true);
    };
    formatDate(date: string): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    }
}
