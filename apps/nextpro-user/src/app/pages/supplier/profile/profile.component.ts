import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import {
    ImageComponent,
    LoadingComponent,
    SupplierAdvertisementComponent,
    SupplierBasicInformationFormComponent,
    SupplierCoreBusinessComponent,
    SupplierProductListComponent,
    SupplierUpgradeProfileComponent,
    SupplierVerificationComponent,
} from '#shared/components';
import { SyncTabsWithAnchorDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';
import { AccountService, LoadingService, NotificationService } from '#shared/services';
import { E_Form_Mode, I_ProfileFeaturesSupplier, I_SicpRegistration, I_Supplier } from '#shared/types';
import { asyncMap, dayJS, getFile } from '#shared/utils';
import { NavbarComponent } from 'apps/nextpro-user/src/app/layout';
import { UserSupplierProfileSubAccountListComponent } from './sub-account/list/sub-account-list.component';

@Component({
    standalone: true,
    selector: 'nextpro-user-supplier-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    providers: [DatePipe],
    imports: [
        NavbarComponent,
        MaterialModules,
        CommonModule,
        TranslateModule,
        LoadingComponent,
        SupplierBasicInformationFormComponent,
        SupplierCoreBusinessComponent,
        UserSupplierProfileSubAccountListComponent,
        SupplierUpgradeProfileComponent,
        SupplierVerificationComponent,
        SupplierProductListComponent,
        SupplierAdvertisementComponent,
        ImageComponent,
        SyncTabsWithAnchorDirective,
    ],
})
export class SupplierProfilePage {
    constructor(
        public loadingService: LoadingService,
        private accountService: AccountService,
        private activatedRoute: ActivatedRoute,
        private notificationService: NotificationService,
    ) {}
    mode = E_Form_Mode.UPDATE;
    supplier: I_Supplier;
    basicInformation = null;
    coreBusiness = null;
    profileFeature: I_ProfileFeaturesSupplier = null;
    sicpRegistration: I_SicpRegistration = null;
    subAccounts = null;

    async ngOnInit() {
        const supplier = await this.accountService.getSupplier({
            id: this.activatedRoute.snapshot.paramMap.get('id'),
        });

        this.supplier = supplier;

        this.basicInformation = {
            id: supplier.id,
            companyFullName: supplier.companyFullName,
            companyAddress: supplier.companyAddress,
            companyNumberOfEmployee: supplier.companyNumberOfEmployee.id,
            companyTax: supplier.companyTax,
            companyCountry: supplier.companyCountry.id,
            companyCountryState: supplier.companyCountryState.id,
            companyWebsite: supplier.companyWebsite,
            currency: supplier.currency.id,
            companyLogo: await getFile(supplier.companyLogo),
            fullName: supplier.fullName,
            email: supplier.email,
            phone: supplier.phone,
            gender: supplier.gender.id,
            position: supplier.position.id,
            picture: await getFile(supplier.picture),
            username: supplier.username,
            profileFeatures: supplier.profileFeatures,
            created: supplier.created,
        };

        this.coreBusiness = {
            bankName: supplier.bankName,
            bankCode: supplier.bankCode,
            bankAddress: supplier.bankAddress,
            beneficiaryName: supplier.beneficiaryName,
            switchBicCode: supplier.switchBicCode,
            bankCurrency: supplier.bankCurrency.id,
            bankAccountNumber: supplier.bankAccountNumber,
            internationalBank: supplier.internationalBank,
            companyDescription: supplier.companyDescription,
            companyEstablishedSince: dayJS(`${supplier.companyEstablishedSince}-01-01`).toISOString(),
            companyTagLine: supplier.companyTagLine,
            companyAnniversaryDate: supplier.companyAnniversaryDate,
            imageBanner: await getFile(supplier.imageBanner),
            coreBusiness: supplier.suppliercategorySet.edges.map(({ node }) => {
                return {
                    coreBusinessSubCluster: {
                        label: node.category.subClusterCode.name,
                        value: node.category.subClusterCode.id,
                    },
                    coreBusinessDetailed: {
                        label: node.category.name,
                        value: node.category.id,
                    },
                    percentage: node.percentage,
                    minimumOfValue: node.minimumOfValue,
                };
            }),
            industries: supplier.supplierindustrySet.edges.map(({ node }) => {
                return {
                    industryFocus: {
                        label: node.industrySubSectors.name,
                        value: node.industrySubSectors.id,
                    },
                    percentage: node.percentage,
                };
            }),
            clientFocus: supplier.supplierclientfocusSet.edges.map(({ node }) => {
                return {
                    name: {
                        label: node.clientFocus.name,
                        value: node.clientFocus.id,
                    },
                    percentage: node.percentage,
                };
            }),
            portfolios: await asyncMap(supplier.supplierPortfolio.edges, async ({ node }) => ({
                id: node.id,
                projectName: node.projectName,
                customerName: node.company,
                value: node.value,
                projectDescription: node.projectDescription,
                image: await getFile(node.image),
            })),
            certificate: await asyncMap(supplier.certificate, async (cer) => ({
                id: cer.id,
                file: await getFile(cer.file),
            })),
        };

        this.supplier = supplier;
        this.profileFeature = supplier.profileFeatures;
        this.sicpRegistration = supplier.sicpRegistration;

        this.subAccounts = {
            id: supplier.id,
        };
    }

    handleImageError(event: Event) {
        (event.target as HTMLImageElement).src = '/assets/images/default_product_image.png';
    }

    onSubmitBasicInformation = async (values, callback) => {
        const { supplierDetailUpdate } = await this.accountService.updateSupplierDetail({
            input: values,
        });

        if (supplierDetailUpdate.status) {
            this.notificationService.success('notification.updateSuccessfully');

            if (callback && typeof callback === 'function') {
                callback();
            }
        } else {
            this.notificationService.error(supplierDetailUpdate.error?.message);
        }
    };

    onSubmitCoreBusiness = async (values, callback) => {
        const { supplierDetailUpdate } = await this.accountService.updateSupplierDetail({
            input: values,
        });

        if (supplierDetailUpdate.status) {
            this.notificationService.success('notification.updateSuccessfully');

            if (callback && typeof callback === 'function') {
                callback();
            }
        } else {
            this.notificationService.error(supplierDetailUpdate.error?.message);
        }
    };
}
