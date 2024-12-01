import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';
import { LoadingService, MasterDataService } from '#shared/services';
import { I_Category, I_ClusterCode, I_FamilyCode, I_FieldConfig, I_SubClusterCode } from '#shared/types';
import { FilterComponent } from '../filter/filter.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
    standalone: true,
    selector: 'app-category-select',
    templateUrl: 'category-select.component.html',
    styleUrl: './category-select.component.scss',
    imports: [CommonModule, MaterialModules, CdkTreeModule, TranslateModule, LoadingComponent, FilterComponent],
})
export class CategorySelectComponent {
    constructor(
        public loadingService: LoadingService,
        private masterDataService: MasterDataService,
    ) {}

    @Input() data?: {
        categoriesSelected?: I_Category[];
    };
    @Output() handleSubmit = new EventEmitter<I_FamilyCode[]>();

    filterFormConfig: I_FieldConfig[] = [
        {
            label: 'shared.search-ccc.searchCategory',
            name: 'name',
        },
    ];
    familyCodes: I_FamilyCode[] = [];
    categoriesSelected: I_Category[] = [];
    treeControl = new NestedTreeControl<I_FamilyCode>((node) => node.children);
    dataSource = new MatTreeNestedDataSource<I_FamilyCode>();

    ngOnInit() {
        if (this?.data?.categoriesSelected) {
            this.categoriesSelected = this.data.categoriesSelected;
        }

        this.masterDataService
            .getFamilyCodes(
                {},
                {
                    normalize: (data) => {
                        return {
                            data: data.familyCodes.edges.map((familyCode) => {
                                const familyCodeNode = {
                                    id: familyCode?.node?.id,
                                    name: familyCode?.node?.name,
                                    translations: familyCode?.node?.translations,
                                    children: [],
                                    fetchChildren: () =>
                                        this.getFamilyCodeChildren(familyCode?.node?.id, familyCodeNode),
                                };

                                this.treeControl.expand(familyCodeNode);

                                return familyCodeNode;
                            }),
                        };
                    },
                },
            )
            .then((res) => {
                this.familyCodes = res.data;
                this.updateDataSource();
            });
    }

    hasChild = (_: number, node: I_FamilyCode) => node?.children?.length > 0;

    handleFilter = () => {
        //TODO: Implement filter
    };

    getFamilyCodeChildren = (id: string, familyCodeNode: I_FamilyCode) => {
        this.masterDataService.getFamilyCodeWithClusterCode({ id }).then((res) => {
            familyCodeNode.children = res.clusterCode.edges.map((clusterCode) => {
                const clusterCodeNode = {
                    id: clusterCode?.node?.id,
                    name: clusterCode?.node?.name,
                    translations: clusterCode?.node?.translations,
                    children: [],
                    fetchChildren: () => this.getClusterCodeChildren(clusterCode?.node?.id, clusterCodeNode),
                };

                this.treeControl.expand(clusterCodeNode);

                return clusterCodeNode;
            });

            this.updateDataSource();
        });
    };

    getClusterCodeChildren = (id: string, clusterCodeNode: I_ClusterCode) => {
        this.masterDataService.getClusterCodeWithSubClusterCode({ id }).then((res) => {
            clusterCodeNode.children = res.subClusterCode.edges.map((subClusterCode) => {
                const subClusterCodeNode = {
                    id: subClusterCode?.node?.id,
                    name: subClusterCode?.node?.name,
                    translations: subClusterCode?.node?.translations,
                    children: [],
                    fetchChildren: () => this.getSubClusterCodeChildren(subClusterCode?.node?.id, subClusterCodeNode),
                };

                this.treeControl.expand(subClusterCodeNode);

                return subClusterCodeNode;
            });

            this.updateDataSource();
        });
    };

    getSubClusterCodeChildren = (id: string, subClusterCodeNode: I_SubClusterCode) => {
        this.masterDataService.getSubClusterCodeWithCategory({ id }).then((res) => {
            subClusterCodeNode.children = res.category.edges.map((category) => {
                const categoryNode = {
                    id: category?.node?.id,
                    name: category?.node?.name,
                    translations: category?.node?.translations,
                };

                return categoryNode;
            });

            this.updateDataSource();
        });
    };

    updateDataSource = () => {
        this.dataSource.data = null;
        this.dataSource.data = this.familyCodes;
    };

    isSelected = (node: I_Category) => {
        return !!this.categoriesSelected.find((item) => item.id === node.id);
    };

    select = (node: I_Category) => {
        if (!this.isSelected(node)) {
            this.familyCodes.forEach((familyCode: I_FamilyCode) => {
                if (familyCode.children) {
                    familyCode.children.forEach((clusterCode: I_ClusterCode) => {
                        if (clusterCode.children) {
                            clusterCode.children.forEach((subClusterCode: I_SubClusterCode) => {
                                if (subClusterCode.children) {
                                    subClusterCode.children.forEach((category: I_Category) => {
                                        if (category.id === node.id) {
                                            this.categoriesSelected.push({
                                                ...node,
                                                subClusterCode: {
                                                    id: subClusterCode.id,
                                                    name: subClusterCode.name,
                                                    translations: subClusterCode.translations,
                                                },
                                                clusterCode: {
                                                    id: clusterCode.id,
                                                    name: clusterCode.name,
                                                    translations: clusterCode.translations,
                                                },
                                                familyCode: {
                                                    id: familyCode.id,
                                                    name: familyCode.name,
                                                    translations: familyCode.translations,
                                                },
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            this.categoriesSelected = this.categoriesSelected.filter((item) => item.id !== node.id);
        }
    };

    remove = (node: I_Category) => {
        this.categoriesSelected = this.categoriesSelected.filter((item) => item.id !== node.id);
    };

    onSubmit(): void {
        this.handleSubmit.emit(this.categoriesSelected);
    }
}
