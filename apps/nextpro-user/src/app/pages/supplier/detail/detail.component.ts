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
import { AccountService, LoadingService, NotificationService, ProductService } from '#shared/services';
import {
    E_Form_Mode,
    I_Product,
    I_ProfileFeaturesSupplier,
    I_SicpRegistration,
    I_Supplier,
    I_SupplierClientFocus,
    I_SupplierIndustry,
} from '#shared/types';
import { getFile } from '#shared/utils';
import { FooterComponent, NavbarComponent } from '#user/layout';
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from 'chart.js';
import { UserSupplierProfileSubAccountListComponent } from '../profile/sub-account/list/sub-account-list.component';

@Component({
    selector: 'nextpro-user-supplier-detail',
    standalone: true,
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
        FooterComponent,
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss',
})
export class SupplierDetailPage {
    constructor(
        public loadingService: LoadingService,
        private accountService: AccountService,
        private activatedRoute: ActivatedRoute,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private productService: ProductService,
        private router: Router,
    ) {}
    mode = E_Form_Mode.UPDATE;
    supplier: I_Supplier;
    /* chart: I_SupplierSubClusterCode; */
    profileFeature: I_ProfileFeaturesSupplier = null;
    sicpRegistration: I_SicpRegistration = null;
    supplierProducts: I_Product[] = [];
    detail = null;
    detailchart = null;
    coreBusiness = null;
    subAccounts = null;
    tooltipText: string;
    activeSection: string = 'summary';
    isWindowScrolled: boolean = false;
    @HostListener('window:scroll', [])
    onWindowScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        this.isWindowScrolled = scrollTop > 100;
    }

    async ngOnInit() {
        Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
        const supplier = await this.accountService.getSupplier({
            id: this.activatedRoute.snapshot.paramMap.get('id'),
        });

        this.supplier = supplier;

        const productList = await this.productService.getSupplierProductList({
            type: 'product',
            userSupplier: this.supplier.id,
        });

        this.supplierProducts = productList.data;

        /* this.detailchart = {
            subClusterCode: this.chart.subClusterCode.name,
            minimumOfValue: this.chart.minimumOfValue,
            percentage: this.chart.percentage,
        }; */
        this.detail = {
            id: supplier.id,
            companyFullName: supplier.companyFullName,
            companyAddress: supplier.companyAddress,
            viewed: supplier.viewed,
            companyNumberOfEmployee: supplier.companyNumberOfEmployee.id,
            companyTax: supplier.companyTax,
            companyCountry: supplier.companyCountry.id,
            companyCountryState: supplier.companyCountryState.id,
            companyWebsite: supplier.companyWebsite,
            currency: supplier.currency.id,
            companyLogo: await getFile(supplier.companyLogo),
            imageBanner: await getFile(supplier.imageBanner),
            fullName: supplier.fullName,
            email: supplier.email,
            phone: supplier.phone,
            gender: supplier.gender.id,
            position: supplier.position.id,
            picture: await getFile(supplier.picture),
            username: supplier.username,
            profileFeatures: supplier.profileFeatures,
            created: supplier.created,
            supplierClientFocus: supplier.supplierclientfocusSet,
            supplierindustrySet: supplier.supplierindustrySet,
            supplierSubClusterCode: supplier.supplierSubClusterCode,
        };

        this.subAccounts = {
            id: supplier.id,
        };
        this.renderChart();

        this.translateService.get('supplier.detail.scroll').subscribe((res: string) => {
            this.tooltipText = res;
        });
    }

    renderChart() {
        const chartColors = ['#005066', '#178ea8', '#b5c7cd', '#57a84f'];

        const labelsClientFocus = this.supplier.supplierclientfocusSet.edges.length
            ? this.supplier.supplierclientfocusSet.edges.map(
                  (item: { node?: I_SupplierClientFocus }) => item.node?.clientFocus?.name,
              )
            : ['No data available'];

        const dataClientFocus = this.supplier.supplierclientfocusSet.edges.length
            ? this.supplier.supplierclientfocusSet.edges.map(
                  (item: { node?: I_SupplierClientFocus }) => item.node?.percentage,
              )
            : [0.01];

        const labelsClientIndustryFocus = this.supplier.supplierindustrySet.edges.length
            ? this.supplier.supplierindustrySet.edges.map(
                  (item: { node?: I_SupplierIndustry }) => item.node?.industrySubSectors?.name,
              )
            : ['No data available'];

        const dataClientIndustryFocus = this.supplier.supplierindustrySet.edges.length
            ? this.supplier.supplierindustrySet.edges.map(
                  (item: { node?: I_SupplierIndustry }) => item.node?.percentage,
              )
            : [0.01];

        const labelsLineService = this.supplier?.supplierSubClusterCode?.subClusterCode?.name
            ? this.supplier.supplierSubClusterCode.subClusterCode.name
            : 'No data available';

        const dataIndustryLineService = this.supplier?.supplierSubClusterCode?.percentage
            ? this.supplier.supplierSubClusterCode.percentage
            : 0.01;
        const disableDataClientIndustryFocus = !this.supplier.supplierindustrySet.edges.length
            ? ['#CCCCCC']
            : chartColors;
        const disableDataClientFocus = !this.supplier.supplierclientfocusSet.edges.length ? ['#CCCCCC'] : chartColors;
        const disableDataLineService = !this.supplier?.supplierSubClusterCode?.percentage ? ['#CCCCCC'] : chartColors;

        const ctx1 = document.getElementById('chartLineService') as HTMLCanvasElement;
        new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: [labelsLineService],
                datasets: [
                    {
                        label: 'Line Service',
                        data: dataIndustryLineService,
                        backgroundColor: disableDataLineService,
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        align: 'center',
                        labels: {
                            boxWidth: 20,
                            padding: 15,
                        },
                    },
                },
            },
        });

        const ctx2 = document.getElementById('chartClientFocus') as HTMLCanvasElement;
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: labelsClientFocus,
                datasets: [
                    {
                        label: 'Product Distribution',
                        data: dataClientFocus,
                        backgroundColor: disableDataClientFocus,
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        align: 'center',
                        labels: {
                            boxWidth: 20,
                            padding: 15,
                        },
                    },
                },
            },
        });

        const ctx3 = document.getElementById('chartClientIndustryFocus') as HTMLCanvasElement;
        new Chart(ctx3, {
            type: 'doughnut',
            data: {
                labels: labelsClientIndustryFocus,
                datasets: [
                    {
                        label: 'Category Breakdown',
                        data: dataClientIndustryFocus,
                        backgroundColor: disableDataClientIndustryFocus,
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        align: 'center',
                        labels: {
                            boxWidth: 20,
                            padding: 15,
                        },
                    },
                },
            },
        });
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

    getTooltipContent(): string {
        const sicpRegistrationName = this.supplier?.sicpRegistration?.name;
        switch (sicpRegistrationName) {
            case 'UNSECURED':
                return this.translateService.instant('tool-tip.sicpRegistration.UNSECURED');
            case 'BRONZE':
                return this.translateService.instant('tool-tip.sicpRegistration.BRONZE');
            case 'SILVER':
                return this.translateService.instant('tool-tip.sicpRegistration.SILVER');
            case 'GOLD':
                return this.translateService.instant('tool-tip.sicpRegistration.GOLD');
            default:
                return '';
        }
    }

    goToProductDetail(id: string): void {
        this.router.navigateByUrl(`/product/${id}`).then(() => {
            window.location.reload();
        });
    }

    getUnitOfMeasure(): number {
        const currentLang = JSON.parse(localStorage.getItem('languageCode') || '"en"');
        return currentLang === 'vi' ? 1 : 0;
    }

    getPriceRange(product) {
        if (!product.productWholesalePriceList || !product.productWholesalePriceList.edges) {
            return { minPrice: null, maxPrice: null };
        }

        const wholesalePrices = product.productWholesalePriceList.edges.map((edge) => edge.node.priceBracket);

        const minPrice = Math.min(...wholesalePrices);
        const maxPrice = Math.max(...wholesalePrices);

        return { minPrice, maxPrice };
    }

    scrollToSection(sectionId: string) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    scrollToTop() {
        (function smoothscroll() {
            const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;

            if (currentScroll > 0) {
                window.requestAnimationFrame(smoothscroll);
                window.scrollTo(0, currentScroll - currentScroll / 8);
            }
        })();
    }
}
