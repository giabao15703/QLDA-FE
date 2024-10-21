import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
    InviteGQL,
    InviteMutation,
    InviteMutationVariables,
    LoginGQL,
    LoginMutation,
    LoginMutationVariables,
    LogoutGQL,
    LogoutMutation,
    LogoutMutationVariables,
    RegisterBuyerGQL,
    RegisterBuyerMutation,
    RegisterBuyerMutationVariables,
    RegisterSupplierGQL,
    RegisterSupplierMutation,
    RegisterSupplierMutationVariables,
} from '#shared/graphql/types';
import { GraphqlService, LocalStorageService, NotificationService } from '#shared/services';
import { I_InviteInput, I_LoginInput } from '#shared/types';

const userTypeMapper = {
    1: 'admin',
    2: 'buyer',
    3: 'supplier',
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        public router: Router,
        private translateService: TranslateService,
        private notificationService: NotificationService,
        private graphqlService: GraphqlService,
        private localStorageService: LocalStorageService,
        private loginGQL: LoginGQL,
        private logoutGQL: LogoutGQL,
        private registerBuyerGQL: RegisterBuyerGQL,
        private registerSupplierGQL: RegisterSupplierGQL,
        private inviteGQL: InviteGQL,
    ) {}

    getUserType(): string {
        const user = this.localStorageService.get('user');
        const userType = user?.userType;
        return userTypeMapper[userType] || 'guest';
    }

    getToken = (): string => {
        return this.localStorageService.get('token');
    };

    isLoggedIn = (): boolean => {
        return !!this.getToken();
    };

    login = async (variables?: I_LoginInput) => {
        const loginResult = await this.graphqlService.mutate<LoginMutation, LoginMutationVariables>(this.loginGQL, {
            user: {
                username: variables?.username,
                password: variables?.password,
            },
        });
        // const loginResult = {
        //     login: {
        //         token: '9a2f522e648ec7e6267c41fe6269dda7d4aa3052',
        //         status: true,
        //         user: {
        //             id: '1',
        //             password: 'pbkdf2_sha256$180000$N70MNjCOuiz7$mte+2Z9v4pjMdf9a3zs+wNCd5H7NU/Uf9fhiyxdFI0c=',
        //             lastLogin: null,
        //             isSuperuser: false,
        //             created: '2022-12-13T07:41:31.796000+00:00',
        //             modified: '2023-08-30T10:03:00.905594+00:00',
        //             username: '700001',
        //             isStaff: false,
        //             isActive: true,
        //             userType: 1,
        //             email: 'admin@nextpro.io',
        //             activateToken: '',
        //             activateTime: null,
        //             firstName: null,
        //             lastName: null,
        //             status: 1,
        //             shortName: '',
        //             fullName: null,
        //             localTime: 'Asia/Ho_Chi_Minh',
        //             companyPosition: 1,
        //             language: {
        //                 id: '1',
        //                 itemCode: 'en',
        //                 name: '1312en',
        //                 __typename: 'LanguageNode',
        //             },
        //             pk: 1,
        //             __typename: 'UserNode',
        //         },
        //         error: null,
        //         __typename: 'Login',
        //     },
        // };

        if (!loginResult?.login?.status) {
            this.notificationService.error(loginResult?.login?.error?.message);
        }

        if (loginResult?.login?.token) {
            if (!variables.rememberMe) {
                this.localStorageService.set('session', new Date());
            }

            this.localStorageService.set('token', loginResult.login.token);
            this.localStorageService.set('user', loginResult?.login?.user);
            this.localStorageService.set('languageCode', loginResult.login.user.language.itemCode);
            setTimeout(() => {
                this.localStorageService.set(
                    'user',
                    loginResult?.login?.user?.[userTypeMapper?.[loginResult?.login?.user?.userType]] ??
                        loginResult?.login?.user,
                );
            }, 0);
            this.router.navigateByUrl('/');
        }
    };

    logout = async (redirectLink?: string) => {
        const loginResult = await this.graphqlService.mutate<LogoutMutation, LogoutMutationVariables>(this.logoutGQL, {
            token: this.getToken(),
        });

        if (!loginResult?.logout?.status) {
            this.notificationService.error(loginResult?.logout?.error?.message);
        }

        this.graphqlService.resetStore();
        this.localStorageService.clear();

        this.router.navigateByUrl(redirectLink ?? '/auth');
    };

    registerBuyer = async (variables, successCallback: (value) => void) => {
        const registerBuyerResult = await this.graphqlService.mutate<
            RegisterBuyerMutation,
            RegisterBuyerMutationVariables
        >(this.registerBuyerGQL, variables);

        if (!registerBuyerResult?.buyerRegister?.status) {
            this.notificationService.error(registerBuyerResult?.buyerRegister?.error?.message);
        } else {
            if (successCallback && typeof successCallback === 'function') {
                successCallback(registerBuyerResult?.buyerRegister);
            }
        }

        return registerBuyerResult?.buyerRegister;
    };

    registerSupplier = async (variables, successCallback: (value) => void) => {
        const registerSupplierResult = await this.graphqlService.mutate<
            RegisterSupplierMutation,
            RegisterSupplierMutationVariables
        >(this.registerSupplierGQL, variables);

        if (!registerSupplierResult?.supplierRegister?.status) {
            this.notificationService.error(registerSupplierResult?.supplierRegister?.error?.message);
        } else {
            if (successCallback && typeof successCallback === 'function') {
                successCallback(registerSupplierResult?.supplierRegister);
            }
        }

        return registerSupplierResult?.supplierRegister;
    };

    invite = async (variables?: I_InviteInput, callback?: () => void) => {
        const inviteResult = await this.graphqlService.mutate<InviteMutation, InviteMutationVariables>(
            this.inviteGQL,
            variables,
        );

        if (!inviteResult?.inviteRegister?.status) {
            this.notificationService.error(inviteResult?.inviteRegister?.error?.message);
        } else {
            this.notificationService.success(this.translateService.instant('notification.successfully'));

            if (callback && typeof callback === 'function') {
                callback();
            }
        }
    };
}
