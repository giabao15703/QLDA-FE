// dashboard.component.ts
import { Component } from '@angular/core';
import { SidebarComponent } from '#user/layout/sidebar/sidebar.component';
import { NavbarComponent } from '#user/layout';
import { AccountService, DeTaiService, GroupQLDAService, NotificationService } from '#shared/services';
import { I_JoinGroup, I_JoinRequest, I_TableState, I_User } from '#shared/types';
import { CommonModule, DatePipe } from '@angular/common';
import { toPromise } from '@apollo/client/core';
import { Router } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'], // Nếu bạn có tệp CSS cho trang này
    imports: [CommonModule, SidebarComponent, NavbarComponent],
    providers: [DatePipe],
})
export class DashboardComponent {
    constructor(
        private deTaiService: DeTaiService,
        private groupService: GroupQLDAService,
        private accountService: AccountService,
        private groupQLDAService: GroupQLDAService,
        private notification: NotificationService,
        private groupQldaService: GroupQLDAService,
        private notificationService: NotificationService,
        private router: Router,
        private datePipe: DatePipe,
    ) { }

    // Biến dữ liệu
    user = JSON.parse(localStorage.getItem('user') || '{}');
    shortName: string = '';
    mssv: string = '';
    lop: string = '';
    nganh: string = '';
    ngaySinh: string = '';
    noiSinh: string = '';
    phone: string = '';
    picture: string = '';
    loaiHinhDaoTao: string = ''; // Biến để lưu loại hình đào tạo
    khoaHoc: string = ''; // Biến để lưu khóa học
    gender: string = ''; // Biến để lưu giới tính
    bacDaoTao: string = ''; // Biến để lưu bậc đào tạo
    isLoading: boolean = false;
    isSidebarOpen = true; // Trạng thái mở/đóng Sidebar
    groupData: I_JoinGroup;
    errorMessage: string = '';
    joinGroupData: any[] = [];
    users: any[] = [];
    groupName: string = '';
    memberCount: number = 0;
    maxMember: number = 0;
    deTaiName: string = '';
    deTaiStatus: string = '';
    maDeTai: string = '';
    filteredUsers: I_User[] = [];
    tenGVHD: string = '';
    emailGVHD: string = '';
    mota: string = '';
    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    async ngOnInit() {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            this.shortName = user?.shortName ?? 'Không có shortName';
            this.mssv = user?.mssv ?? 'Không có mssv';
            this.lop = user?.lop ?? 'Không có lớp';
            this.nganh = user?.nganh ?? 'Không có ngành';
            this.ngaySinh = user?.ngaySinh ?? 'Không có ngày sinh';
            this.noiSinh = user?.noiSinh ?? 'Không có nơi sinh';
            this.phone = user?.phone ?? 'Không có số điện thoại';
            this.picture = user?.picture ?? 'https://via.placeholder.com/150';
            this.loaiHinhDaoTao = user?.loaiHinhDaoTao ?? 'Không có loại hình đào tạo';
            this.khoaHoc = user?.khoaHoc ?? 'Không có khóa học';
            this.gender = user?.gender ?? 'Không có giới tính';
            this.bacDaoTao = user?.bacDaoTao ?? 'Không có bậc đào tạo';
        }

        console.log('Picture URL:', this.picture);

        try {
            const groupIdResponse = await this.groupService.getJoinGroups({ userId: this.user.id });
            console.log('groupIdResponse:', groupIdResponse); // Log kết quả groupIdResponse

            if (groupIdResponse?.data?.length > 0) {
                const groupId = groupIdResponse.data[0]?.group?.id;
                console.log('Group ID:', groupId);

                if (groupId) {
                    // Lấy thông tin nhóm chi tiết
                    const groupResponse = await this.groupService.getJoinGroups({ groupId: parseInt(groupId) });
                    console.log('groupResponse:', groupResponse); // Log kết quả groupResponse

                    if (groupResponse?.data?.length > 0) {
                        this.groupData = groupResponse.data[0]; // Thông tin nhóm
                        console.log('Thông tin nhóm:', this.groupData);

                        const group = this.groupData.group;
                        const deTai = group.deTai;
                        this.groupName = group.name;
                        this.memberCount = group.memberCount;
                        this.maxMember = group.maxMember;
                        this.deTaiName = deTai?.tendoan ?? 'Chưa có đề tài';
                        this.deTaiStatus = deTai?.trangthai ?? 'Chưa có trạng thái';
                        this.tenGVHD = deTai.idgvhuongdan.shortName;
                        this.emailGVHD = deTai.idgvhuongdan.email;
                        this.maDeTai = deTai?.madoan ?? 'Chưa có mã đồ án';
                        this.mota = deTai?.mota ?? 'Chưa có mô tả';
                    } else {
                        console.log('Không tìm thấy thông tin nhóm chi tiết.');
                        this.errorMessage = 'Không tìm thấy thông tin nhóm chi tiết.';
                    }
                } else {
                    console.log('Không tìm thấy groupId.');
                    this.errorMessage = 'Không tìm thấy thông tin nhóm hiện tại.';
                }
            } else {
                console.log('Bạn chưa tham gia nhóm nào.');
                this.errorMessage = 'Bạn chưa tham gia nhóm nào.';
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin nhóm:', error);
            this.errorMessage = 'Không thể tải thông tin nhóm, vui lòng thử lại sau!';
        }

        this.getStudentsWithoutGroup();
    }

    getStudentsWithoutGroup() {
        const user = localStorage.getItem('user'); // Lấy thông tin user từ localStorage

        if (!user) {
            this.errorMessage = 'Không tìm thấy thông tin người dùng.';
            console.log('Không tìm thấy thông tin user trong localStorage!');
            return;
        }

        const parsedUser = JSON.parse(user);
        const currentUserId = parsedUser?.id;

        if (!currentUserId) {
            this.errorMessage = 'Không tìm thấy userId trong thông tin người dùng.';
            console.log('Không tìm thấy userId trong thông tin user!');
            return;
        }

        console.log('UserId từ localStorage:', currentUserId);

        // Gọi API lấy danh sách JoinGroup
        this.groupQLDAService
            .getJoinGroups()
            .then((response: I_TableState<I_JoinGroup>) => {
                console.log('Dữ liệu JoinGroup nhận được:', response);

                if (response?.data?.length) {
                    // Kiểm tra xem user hiện tại có phải là leader không
                    const isLeader = response.data.some((joinGroup) => {
                        const userIdInGroup = joinGroup.user?.id;
                        return joinGroup.role === 'leader' && String(userIdInGroup) === String(currentUserId);
                    });

                    if (isLeader) {
                        console.log('UserId là leader, kiểm tra nhóm chưa đầy thành viên.');

                        // Kiểm tra xem có nhóm nào chưa đầy không
                        const hasAvailableGroup = response.data.some((joinGroup) => {
                            const group = joinGroup.group;

                            // Kiểm tra điều kiện: member_count < max_member
                            if (group?.memberCount < group?.maxMember) {
                                console.log(
                                    `Nhóm ${group.name} có member_count=${group.memberCount}, max_member=${group.maxMember} -> Chưa đầy.`,
                                );
                                return true;
                            }
                            console.log(
                                `Nhóm ${group.name} đã đầy: member_count=${group.memberCount}, max_member=${group.maxMember}`,
                            );
                            return false;
                        });

                        if (hasAvailableGroup) {
                            // Nếu có nhóm chưa đầy, gọi API lấy danh sách sinh viên không có nhóm
                            console.log('Có nhóm chưa đầy, tiến hành tải danh sách sinh viên không có nhóm.');

                            this.groupQLDAService
                                .getStudentsWithoutGroup()
                                .then((studentsResponse: I_TableState<I_User>) => {
                                    console.log('Dữ liệu sinh viên không có nhóm:', studentsResponse);

                                    if (studentsResponse?.data) {
                                        this.filteredUsers = studentsResponse.data;
                                        console.log('Cập nhật danh sách sinh viên không có nhóm:', this.filteredUsers);
                                    }
                                })
                                .catch((error) => {
                                    console.error('Lỗi khi lấy danh sách sinh viên không có nhóm:', error);
                                    this.errorMessage =
                                        'Không thể tải danh sách sinh viên không có nhóm, vui lòng thử lại sau!';
                                });
                        } else {
                            // Tất cả nhóm đã đầy, không gọi API
                            this.errorMessage = 'Tất cả các nhóm đã đủ thành viên.';
                            console.log('Tất cả các nhóm đã đầy, không tải danh sách sinh viên.');
                        }
                    } else {
                        this.errorMessage = 'Bạn không phải là leader, không thể tải danh sách sinh viên.';
                        console.log('UserId không phải là leader, không thể tải danh sách sinh viên.');
                    }
                } else {
                    this.errorMessage = 'Không có dữ liệu JoinGroup.';
                    console.log('Không có dữ liệu JoinGroup.');
                }
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách JoinGroup:', error);
                this.errorMessage = 'Không thể tải danh sách nhóm, vui lòng thử lại sau!';
            });
    }

    async inviteUserToGroup(user: I_User) {
        console.log('Inviting user:', user); // Đảm bảo hàm này được gọi
        try {
            // Kiểm tra xem groupData và group có hợp lệ không
            if (!this.groupData || !this.groupData.group) {
                this.errorMessage = 'Thông tin nhóm không hợp lệ.';
                console.log('Group data không hợp lệ:', this.groupData);
                return;
            }

            // Gọi API gửi lời mời
            const response = await this.groupQLDAService.getInviteUserToGroup({
                groupId: this.groupData.group.id,
                userId: user.id,
            });
            console.log('API Response:', response);

            if (response?.inviteUserToGroup?.status) {
                this.notification.success('Đã gửi lời mời tới ' + user.fullName);
                this.filteredUsers = this.filteredUsers.filter((u) => u.id !== user.id); // Loại user khỏi danh sách
                this.errorMessage = ''; // Xóa thông báo lỗi nếu có
            } else {
                this.notification.error(response?.inviteUserToGroup?.error?.message || 'Lỗi khi gửi lời mời');
                this.errorMessage = response?.inviteUserToGroup?.error?.message || 'Lỗi khi gửi lời mời.';
            }
        } catch (error) {
            console.error('Lỗi khi mời người dùng vào nhóm:', error);
            this.errorMessage = 'Không thể mời người dùng vào nhóm, vui lòng thử lại sau.';
        }
    }
    openModal() {
        this.router.navigate(['/group']);
    }
    formatDate(date: string): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    }
    getDeTai() {}
}
