import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GroupQLDAService } from '#shared/services';
import { I_GroupQLDA, I_QueryVariables } from '#shared/types';
import { SidebarComponent } from '#user/layout/sidebar/sidebar.component';
import { NavbarComponent } from '#user/layout';
import { getQueryVariables } from '#shared/utils';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss'],
    imports: [SidebarComponent, NavbarComponent, CommonModule],
})
export class GroupComponent implements OnInit {
    constructor(
        private groupService: GroupQLDAService,
        private cdr: ChangeDetectorRef,
    ) {}
    groups: I_GroupQLDA[] = [];
    students: any[] = [];
    ngOnInit() {
        this.getStudentInGroup();
    }

    getStudentInGroup = async (variables?: I_QueryVariables) => {
        const users = await this.groupService.getStudentsInGroup({}, { extra: { variables } });
        console.log('Danh sách sinh viên trong nhóm:', users); // Kiểm tra xem dữ liệu có đúng không
        this.students = users.data || []; // Gán vào students
        console.log('Dữ liệu sinh viên:', this.students); // Kiểm tra mảng students
        this.cdr.detectChanges();
    };
}
