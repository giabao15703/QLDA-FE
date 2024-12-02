import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import {
    BuyerBasicInformationFormComponent,
    BuyerUpgradeProfileComponent,
    ImageComponent,
    LoadingComponent,
} from '#shared/components';
import { SyncTabsWithAnchorDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';
import { AccountService, LoadingService, NotificationService } from '#shared/services';
import { E_Form_Mode, I_Buyer, I_ProfileFeaturesBuyer } from '#shared/types';
import { getFile, omit } from '#shared/utils';
import { NavbarComponent } from '#user/layout';
import { UserBuyerProfileSubAccountListComponent } from './sub-account/list/sub-account-list.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-buyer-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    providers: [DatePipe],
    imports: [
        NavbarComponent,
        MaterialModules,
        CommonModule,
        TranslateModule,
        LoadingComponent,
        BuyerBasicInformationFormComponent,
        UserBuyerProfileSubAccountListComponent,
        BuyerUpgradeProfileComponent,
        ImageComponent,
        SyncTabsWithAnchorDirective,
    ],
})
export class BuyerProfilePage {
    constructor(
        public loadingService: LoadingService,
        private accountService: AccountService,
        private activatedRoute: ActivatedRoute,
        private notificationService: NotificationService,
    ) {}
    mode = E_Form_Mode.UPDATE;
    buyer: I_Buyer;
    basicInformation = null;
    profileFeature: I_ProfileFeaturesBuyer = null;
    subAccounts = null;

    async ngOnInit() {
        /* const buyer = await this.accountService.getBuyer({
            id: this.activatedRoute.snapshot.paramMap.get('id'),
        });
        this.buyer = buyer;

        this.basicInformation = {
            id: buyer.id,
            companyFullName: buyer.companyFullName,
            companyAddress: buyer.companyAddress,
            companyNumberOfEmployee: buyer.companyNumberOfEmployee.id,
            companyTax: buyer.companyTax,
            companyCountry: buyer.companyCountry.id,
            companyCountryState: buyer.companyCountryState.id,
            companyWebsite: buyer.companyWebsite,
            currency: buyer.currency.id,
            companyLogo: await getFile(buyer.companyLogo),
            fullName: buyer.user.fullName,
            email: buyer.user.email,
            phone: buyer.phone,
            gender: buyer.gender.id,
            position: buyer.position.id,
            picture: await getFile(buyer.picture),
            username: buyer.username,
            profileFeatures: buyer.profileFeatures,
            created: buyer.created,
            industries: buyer.buyerIndustry.edges.map(({ node }) => ({
                label: node.industry.name,
                value: node.industry.id,
            })),
        };

        this.profileFeature = buyer.profileFeatures;

        this.subAccounts = {
            id: buyer.id,
        }; */
    }

    handleImageError(event: Event) {
        // (event.target as HTMLImageElement).src = '/assets/images/default_product_image.png';
    }

    onSubmitBasicInformation = async (values, callback) => {
        const { buyerDetailUpdate } = await this.accountService.updateBuyerDetail({
            input: omit(values, ['email']),
        });

        if (buyerDetailUpdate.status) {
            this.notificationService.success('notification.updateSuccessfully');

            if (callback && typeof callback === 'function') {
                callback();
            }
        } else {
            this.notificationService.error(buyerDetailUpdate.error?.message);
        }
    };
}
