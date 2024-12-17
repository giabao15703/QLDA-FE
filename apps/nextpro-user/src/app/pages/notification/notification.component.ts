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
    selectedNotification: any = null;

    constructor(
        private notificationQLDAService: NotificationQLDAService,
        private datePipe: DatePipe,
    ) {}

    ngOnInit() {
        this.getNotifications();
    }
    getNotifications = async () => {
        const notifications = await this.notificationQLDAService.getNotifications({});
        this.notifications = (notifications.data || []).filter((n: any) => n.status === true);
    };
    formatDate(date: string): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    }
    openModal(notification: any): void {
        this.selectedNotification = notification;
    }
    closeModal(): void {
        this.selectedNotification = null;
    }
}
