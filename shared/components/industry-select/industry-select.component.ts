import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService } from '#shared/services';
import { I_FieldConfig, I_Industry, I_IndustryCluster, I_IndustrySector } from '#shared/types';
import { FilterComponent } from '../filter/filter.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
    standalone: true,
    selector: 'app-industry-select',
    templateUrl: 'industry-select.component.html',
    styleUrl: './industry-select.component.scss',
    imports: [CommonModule, MaterialModules, CdkTreeModule, TranslateModule, LoadingComponent, FilterComponent],
})
export class IndustrySelectComponent {
    constructor(
        public loadingService: LoadingService,
        private masterDataService: MasterDataService,
    ) {}

    @Input() data?: {
        industriesSelected?: I_Industry[];
    };
    @Output() handleSubmit = new EventEmitter<I_Industry[]>();

    filterFormConfig: I_FieldConfig[] = [
        {
            label: 'shared.search-industry.searchIndustry',
            name: 'name',
            class: 'w-[500px]',
        },
    ];

    industries: I_Industry[] = [];
    industriesSelected: I_Industry[] = [];
    treeControl = new NestedTreeControl<I_Industry>((node) => node.children);
    dataSource = new MatTreeNestedDataSource<I_Industry>();
    hasChild = (_: number, node: I_Industry) => node?.children?.length > 0;

    ngOnInit() {
        if (this?.data?.industriesSelected) {
            this.industriesSelected = this.data.industriesSelected;
        }

        this.masterDataService
            .getIndustries(
                {},
                {
                    normalize: (data) => {
                        return {
                            data: data.industries.edges
                                .filter((industry) => industry?.node?.id !== '1' && industry?.node?.name !== 'All')
                                .map((industry) => {
                                    const industryNode = {
                                        id: industry?.node?.id,
                                        name: this.getTranslatedName(industry?.node?.translations),
                                        translations: industry?.node?.translations,
                                        children: [],
                                        fetchChildren: () => this.getIndustryChildren(industry?.node?.id, industryNode),
                                    };

                                    this.treeControl.expand(industryNode);

                                    return industryNode;
                                }),
                        };
                    },
                },
            )
            .then((res) => {
                this.industries = res.data;
                this.updateDataSource();
            });
    }

    handleFilter = () => {
        //TODO: Implement filter
    };

    getIndustryChildren(id: string, industryNode: I_Industry) {
        this.masterDataService.getIndustryWithIndustryCluster({ id }).then((res) => {
            industryNode.children = res.industryCluster.edges.map((industryCluster) => {
                const industryClusterNode = {
                    id: industryCluster?.node?.id,
                    name: this.getTranslatedName(industryCluster?.node?.translations),
                    translations: industryCluster?.node?.translations,
                    children: [],
                    fetchChildren: () =>
                        this.getIndustryClusterChildren(industryCluster?.node?.id, industryClusterNode),
                };

                this.treeControl.expand(industryClusterNode);

                return industryClusterNode;
            });

            this.updateDataSource();
        });
    }

    getIndustryClusterChildren(id: string, industryClusterNode: I_IndustryCluster) {
        this.masterDataService.getIndustryClusterWithIndustrySectors({ id }).then((res) => {
            industryClusterNode.children = res.industrySectors.edges.map((industrySectors) => {
                const industrySectorsNode = {
                    id: industrySectors?.node?.id,
                    name: this.getTranslatedName(industrySectors?.node?.translations),
                    translations: industrySectors?.node?.translations,
                    children: [],
                    fetchChildren: () =>
                        this.getIndustrySectorsChildren(industrySectors?.node?.id, industrySectorsNode),
                };
                this.treeControl.expand(industrySectorsNode);

                return industrySectorsNode;
            });

            this.updateDataSource();
        });
    }

    getIndustrySectorsChildren(id: string, industrySectorsNode: I_IndustrySector) {
        this.masterDataService.getIndustrySectorWithIndustrySubSectors({ id }).then((res) => {
            industrySectorsNode.children = res.industrySubSectors.edges.map((industrySubSectors) => {
                const industrySubSectorsNode = {
                    id: industrySubSectors?.node?.id,
                    name: this.getTranslatedName(industrySubSectors?.node?.translations),
                    translations: industrySubSectors?.node?.translations,
                    children: [],
                };

                return industrySubSectorsNode;
            });

            this.updateDataSource();
        });
    }

    updateDataSource() {
        this.dataSource.data = null;
        this.dataSource.data = this.industries;
    }

    isSelected(id) {
        const check = this.industriesSelected.find((node) => node.id === id);

        if (check) {
            return true;
        } else {
            return false;
        }
    }

    toggleAll() {
        if (this.industriesSelected.length > 0) {
            this.industriesSelected = [];
        } else {
            this.industriesSelected = this.industries;
        }
    }

    select(node: I_Industry) {
        if (!this.isSelected(node.id)) {
            this.industriesSelected.push(node);
        } else {
            this.industriesSelected = this.industriesSelected.filter((item) => item.id !== node.id);
        }
    }

    remove(node: { id?: string; name?: string }) {
        this.industriesSelected = this.industriesSelected.filter((item) => item.id !== node.id);
    }

    onSubmit(): void {
        this.handleSubmit.emit(this.industriesSelected);
    }

    private getTranslatedName(translations: { languageCode: string; name: string }[]): string {
        const languageCode = JSON.parse(localStorage.getItem('languageCode') || 'en');
        const translation = translations.find((t) => t.languageCode === languageCode);
        return translation ? translation.name : translations.find((t) => t.languageCode === 'en').name;
    }
}
