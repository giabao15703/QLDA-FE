import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { debounce } from 'lodash';

import { FormComponent, LoadingComponent } from '#shared/components';
import { MatAutocompleteOptionsScrollDirective } from '#shared/directives';
import { MaterialModules } from '#shared/modules';
import { LoadingService, LocalStorageService, MasterDataService } from '#shared/services';
import { I_SelectOption } from '#shared/types';
import { translateData } from '#shared/utils';

@Component({
    standalone: true,
    selector: 'nextpro-user-global-search',
    templateUrl: './global-search.component.html',
    styleUrls: ['./global-search.component.scss'],
    imports: [
        CommonModule,
        MaterialModules,
        ReactiveFormsModule,
        LoadingComponent,
        TranslateModule,
        FormComponent,
        MatAutocompleteOptionsScrollDirective,
    ],
})
export class GlobalSearchComponent {
    constructor(
        private masterDataService: MasterDataService,
        private loadingService: LoadingService,
        private localStorageService: LocalStorageService,
        private router: Router,
    ) {
        this.localStorageService.onChange('languageCode', async (_, newValue) => {
            if (newValue) {
                this.resetSearch();
            }
        });
    }

    searchControl = new FormControl('', [Validators.required, this.validObject]);
    options: I_SelectOption[] = [];
    searchCount = 0;

    validObject(controller: AbstractControl) {
        if (!(controller.value instanceof Object)) {
            return { '!Object': true };
        }
        return null;
    }

    isLoading() {
        return this.loadingService.checkLoading([
            'getFamilyCodes',
            'getClusterCodes',
            'getSubClusterCodes',
            'getCategories',
        ]);
    }

    appendOptions = async (data) => {
        const currentLanguage = this.localStorageService.get('languageCode');

        this.options = [
            ...this.options,
            ...data.map((option) => ({
                value: option.id,
                label: translateData(option, currentLanguage, 'name'),
                hrefType: option.hrefType,
            })),
        ];
    };

    resetSearch = () => {
        this.searchControl.reset();
        this.searchCount = 0;
        this.options = [];
    };

    search = async (searchCount?: number) => {
        if (!searchCount) {
            this.searchCount = 0;
            this.options = [];
        }

        const currentLanguage = this.localStorageService.get('languageCode');

        const searchParams = {
            nameEn: currentLanguage === 'en' ? this.searchControl.value : '',
            nameVi: currentLanguage === 'vi' ? this.searchControl.value : '',
            first: 5,
            orderBy: 'id',
            ...(searchCount && { after: (searchCount - 1).toString() }),
        };
        const [familyCodes, clusterCodes, subClusterCode, categories] = await Promise.all([
            this.masterDataService.getFamilyCodes(searchParams).then((res) => res.data),
            this.masterDataService.getClusterCodes(searchParams).then((res) => res.data),
            this.masterDataService.getSubClusterCodes(searchParams).then((res) => res.data),
            this.masterDataService.getCategories(searchParams).then((res) => res.data),
        ]);

        const newOptions = [
            ...familyCodes.map((item) => ({ ...item, hrefType: 'family-code' })),
            ...clusterCodes.map((item) => ({ ...item, hrefType: 'cluster-code' })),
            ...subClusterCode.map((item) => ({ ...item, hrefType: 'sub-cluster-code' })),
            ...categories.map((item) => ({ ...item, hrefType: 'category' })),
        ];

        this.appendOptions(newOptions);

        this.searchCount += 5;
    };

    onSearch = debounce(() => {
        this.search();
    }, 500);

    onOptionsScroll() {
        this.search(this.searchCount);
    }

    onSelectOption(option: I_SelectOption) {
        this.router.navigateByUrl(`/suppliers?${option['hrefType']}=${option.value}`);
    }
    onInputClick() {
        this.search();
    }
}
