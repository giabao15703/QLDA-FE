import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// import { CategorySelectComponent, IndustrySelectComponent } from '#shared/components';
import {
    REGEX_ALPHANUMERIC,
    REGEX_ALPHANUMERIC_AND_SPACES,
    REGEX_ALPHANUMERIC_VIETNAMESE_CAPITALIZED_WORDS,
    REGEX_ALPHANUMERIC_VIETNAMESE_SPACES_EXCLAMATION,
    REGEX_ALPHANUMERIC_VIETNAMESE_WITH_SPACES_AND_UNDERSCORES,
    REGEX_TITLE_CASE_VIETNAMESE_WITH_SPACES,
} from '#shared/constants';
import { MaterialModules } from '#shared/modules';
import { AccountService, FormService, LocalStorageService, MasterDataService, ModalService } from '#shared/services';
import {
    E_ContainerType,
    E_FieldAppearance,
    E_FieldType,
    E_Form_Mode,
    E_TableColumnType,
    I_Category,
    I_Currency,
    I_Industry,
    I_Supplier,
} from '#shared/types';
import { formatDate, translateData } from '#shared/utils';
import { FormComponent } from '../../../form/form.component';

const FORM_NAME = 'FORM_CORE_BUSINESS';

const TABLE_HEADER_STYLE = { background: '#dbdbdb', borderRight: '1px solid #c0bcbc' };

const TABLE_CORE_BUSINESS_INFORMATION = 'coreBusiness';

const TABLE_CLIENT_INDUSTRY_FOCUS = 'industries';

const TABLE_CLIENT_FOCUS = 'clientFocus';

const TABLE_PORFOLIO = 'portfolios';

@Component({
    standalone: true,
    selector: 'app-supplier-core-business',
    templateUrl: './core-business.component.html',
    styleUrl: './core-business.component.scss',
    providers: [DatePipe, FormService],
    imports: [
        CommonModule,
        MaterialModules,
        DatePipe,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        TranslateModule,
        MaterialModules,
        ReactiveFormsModule,
        FormComponent,
    ],
})
export class SupplierCoreBusinessComponent {
    constructor(
        public form: FormService,
        private localStorageService: LocalStorageService,
        private modalService: ModalService,
        private masterDataService: MasterDataService,
        private accountService: AccountService,
    ) {
        this.form.config = [
            {
                label: 'supplier-profile.tabs.core-business.form.core-business-info',
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.FIELDSET,
                children: [
                    {
                        fieldType: E_FieldType.TABLE,
                        name: TABLE_CORE_BUSINESS_INFORMATION,
                        table: {
                            class: '!h-auto mt-3',
                            createButton: {
                                text: 'supplier-profile.tabs.core-business.form.btn-add',
                            },
                            columns: [
                                {
                                    headerStyle: TABLE_HEADER_STYLE,
                                    cellStyle: { width: '50px' },
                                    name: 'no',
                                    label: 'supplier-profile.tabs.core-business.form.no-header',
                                    render: (_, index) => {
                                        return index + 1;
                                    },
                                },
                                {
                                    cellContentStyle: {
                                        display: 'flex',
                                        alignItems: 'center',
                                    },
                                    name: 'coreBusinessSubCluster',
                                    label: 'supplier-profile.tabs.core-business.form.core-business-sub-cluster-header',
                                    headerStyle: TABLE_HEADER_STYLE,
                                    type: E_TableColumnType.ACTION,
                                    render: (cell) => cell.label,
                                    ctas: [
                                        {
                                            icon: 'search',
                                            onClick: () => this.openCategorySelectDialog(),
                                        },
                                    ],
                                },
                                {
                                    cellContentStyle: {
                                        display: 'flex',
                                        alignItems: 'center',
                                    },
                                    name: 'coreBusinessDetailed',
                                    label: 'supplier-profile.tabs.core-business.form.core-business-detailed-header',
                                    headerStyle: TABLE_HEADER_STYLE,
                                    type: E_TableColumnType.ACTION,
                                    render: (cell) => cell.label,
                                    ctas: [
                                        {
                                            icon: 'search',
                                            onClick: () => this.openCategorySelectDialog(),
                                        },
                                    ],
                                },
                                {
                                    name: 'percentage',
                                    label: 'supplier-profile.tabs.core-business.form.percentage-header',
                                    headerStyle: TABLE_HEADER_STYLE,
                                    type: E_TableColumnType.FORM,
                                    form: {
                                        name: `${TABLE_CORE_BUSINESS_INFORMATION}-percentage`,
                                        config: [
                                            {
                                                appearance: E_FieldAppearance.FILL,
                                                name: 'percentage',
                                                label: 'supplier-profile.tabs.core-business.form.percentage-label',
                                                validate: [
                                                    {
                                                        rule: Validators.min(1),
                                                        message: 'VALIDATE_DESCRIPTION.coreBusiness.percentage.pattern',
                                                    },
                                                    {
                                                        rule: Validators.max(100),
                                                        message: 'VALIDATE_DESCRIPTION.coreBusiness.percentage.pattern',
                                                    },
                                                    {
                                                        rule: () =>
                                                            this.form
                                                                .tableGetColumnValues(
                                                                    TABLE_CORE_BUSINESS_INFORMATION,
                                                                    'percentage',
                                                                )
                                                                .reduce((acc, cur) => acc + parseInt(cur), 0) <= 100,
                                                        message: 'VALIDATE_DESCRIPTION.coreBusiness.percentage.pattern',
                                                    },
                                                ],
                                                onChange: (e, _, config) => {
                                                    this.form.tableUpdateRows([
                                                        {
                                                            name: TABLE_CORE_BUSINESS_INFORMATION,
                                                            index: config.index,
                                                            key: 'percentage',
                                                            value: e.target.value,
                                                        },
                                                    ]);
                                                },
                                            },
                                        ],
                                    },
                                },
                                // {
                                //     name: 'minimumOfValue',
                                //     label: 'supplier-profile.tabs.core-business.form.min-order-value-header',
                                //     headerStyle: TABLE_HEADER_STYLE,
                                //     type: E_TableColumnType.FORM,
                                //     form: {
                                //         config: [
                                //             {
                                //                 appearance: E_FieldAppearance.FILL,
                                //                 name: 'minimumOfValue',
                                //                 label: 'supplier-profile.tabs.core-business.form.min-order-value-label',
                                //                 validate: [
                                //                     {
                                //                         rule: Validators.min(0),
                                //                         message: 'VALIDATE_DESCRIPTION.coreBusiness.minOrder.pattern',
                                //                     },
                                //                 ],
                                //                 onChange: (e, _, config) => {
                                //                     this.form.tableUpdateRows([
                                //                         {
                                //                             name: TABLE_CORE_BUSINESS_INFORMATION,
                                //                             index: config.index,
                                //                             key: 'minimumOfValue',
                                //                             value: e.target.value,
                                //                         },
                                //                     ]);
                                //                 },
                                //             },
                                //         ],
                                //     },
                                // },

                                // Don’t delete this code snippet.
                                {
                                    headerStyle: TABLE_HEADER_STYLE,
                                    cellStyle: { width: '50px' },
                                    sticky: 'right',
                                    type: E_TableColumnType.ACTION,
                                    name: 'action',
                                    ctas: [
                                        {
                                            icon: 'delete',
                                            shouldShow: (_, index) => index !== 0,
                                            onClick: (_, index) => {
                                                this.form.tableDeleteRows([
                                                    {
                                                        name: TABLE_CORE_BUSINESS_INFORMATION,
                                                        index,
                                                    },
                                                ]);
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ],
            },
            {
                class: 'grid grid-cols-1 lg:grid-cols-3 gap-2',
                label: 'supplier-profile.tabs.core-business.form.bank-info',
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.FIELDSET,
                children: [
                    {
                        label: 'supplier-profile.tabs.core-business.form.bank-name',
                        name: 'bankName',
                        maxLength: 250,
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.bankName.required',
                            },
                            {
                                rule: Validators.pattern(REGEX_ALPHANUMERIC_VIETNAMESE_CAPITALIZED_WORDS),
                                message: 'VALIDATE_DESCRIPTION.bankName.pattern',
                            },
                        ],
                    },
                    {
                        label: 'supplier-profile.tabs.core-business.form.bank-code',
                        name: 'bankCode',
                        validate: [
                            {
                                rule: Validators.pattern(REGEX_ALPHANUMERIC_AND_SPACES),
                                message: 'VALIDATE_DESCRIPTION.bankCode.pattern',
                            },
                        ],
                    },
                    {
                        label: 'supplier-profile.tabs.core-business.form.bank-branch',
                        name: 'bankAddress',
                        maxLength: 250,
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.bankAddress.required',
                            },
                            {
                                rule: Validators.pattern(REGEX_ALPHANUMERIC_VIETNAMESE_WITH_SPACES_AND_UNDERSCORES),
                                message: 'VALIDATE_DESCRIPTION.bankAddress.pattern',
                            },
                        ],
                    },
                    {
                        label: 'supplier-profile.tabs.core-business.form.beneficiary-name',
                        name: 'beneficiaryName',
                        maxLength: 250,
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.beneficiaryName.required',
                            },
                            {
                                rule: Validators.pattern(REGEX_ALPHANUMERIC_VIETNAMESE_CAPITALIZED_WORDS),
                                message: 'VALIDATE_DESCRIPTION.beneficiaryName.pattern',
                            },
                        ],
                    },
                    {
                        label: 'supplier-profile.tabs.core-business.form.swift-code',
                        name: 'switchBicCode',
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.switchBicCode.required',
                            },
                            {
                                rule: Validators.pattern(REGEX_ALPHANUMERIC_AND_SPACES),
                                message: 'VALIDATE_DESCRIPTION.switchBicCode.pattern',
                            },
                        ],
                    },
                    {
                        label: 'supplier-profile.tabs.core-business.form.account-currency',
                        name: 'bankCurrency',
                        loadingName: 'getCurrencies',
                        fieldType: E_FieldType.SELECT,
                        getOptions: () => this.masterDataService.getCurrencies().then((res) => res.data),
                        mapOption: (item: I_Currency) => ({
                            label: translateData(item, this.localStorageService.get('languageCode'), 'name'),
                            value: item.id,
                        }),
                        translateOptions: true,
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.bankCurrency.required',
                            },
                        ],
                    },
                    {
                        label: 'supplier-profile.tabs.core-business.form.bank-account-no',
                        name: 'bankAccountNumber',
                        validate: [
                            {
                                rule: Validators.required,
                                message: 'VALIDATE_DESCRIPTION.bankAccountNumber.required',
                            },
                            {
                                rule: Validators.pattern(REGEX_ALPHANUMERIC),
                                message: 'VALIDATE_DESCRIPTION.bankAccountNumber.pattern',
                            },
                        ],
                    },
                    {
                        label: 'supplier-profile.tabs.core-business.form.iban-code',
                        name: 'internationalBank',
                        validate: [
                            {
                                rule: Validators.pattern(REGEX_ALPHANUMERIC_AND_SPACES),
                                message: 'VALIDATE_DESCRIPTION.internationalBank.pattern',
                            },
                        ],
                    },
                ],
            },
            {
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.FIELDSET,
                label: 'supplier-profile.tabs.core-business.form.company-profile-info',
                children: [
                    {
                        fieldType: E_FieldType.CONTAINER,
                        class: 'grid grid-cols-2 gap-2',
                        children: [
                            {
                                label: 'supplier-profile.tabs.core-business.form.company-descripton',
                                name: 'companyDescription',
                                maxLength: 350,
                                validate: [
                                    {
                                        rule: Validators.required,
                                        message: 'VALIDATE_DESCRIPTION.companyDescription.required',
                                    },
                                    {
                                        rule: Validators.pattern(REGEX_ALPHANUMERIC_VIETNAMESE_SPACES_EXCLAMATION),
                                        message: 'VALIDATE_DESCRIPTION.companyDescription.pattern',
                                    },
                                    {
                                        rule: Validators.minLength(10),
                                        message: 'VALIDATE_DESCRIPTION.companyDescription.pattern',
                                    },
                                    {
                                        rule: Validators.maxLength(350),
                                        message: 'VALIDATE_DESCRIPTION.companyDescription.pattern',
                                    },
                                ],
                            },
                            {
                                label: 'supplier-profile.tabs.core-business.form.established-since',
                                name: 'companyEstablishedSince',
                                fieldType: E_FieldType.DATEPICKER,
                                max: new Date().toISOString(),
                                startView: 'multi-year',
                                yearSelected: (value, datepicker, field) => {
                                    const year = formatDate(value, { format: 'YYYY' });
                                    field.setValue(year);
                                    datepicker.close();
                                },
                                validate: [
                                    {
                                        rule: Validators.required,
                                        message: 'VALIDATE_DESCRIPTION.companyEstablishedSince.required',
                                    },
                                ],
                            },
                            {
                                label: 'supplier-profile.tabs.core-business.form.tag-line',
                                name: 'companyTagLine',
                                maxLength: 350,
                                validate: [
                                    {
                                        rule: Validators.pattern(REGEX_ALPHANUMERIC_VIETNAMESE_SPACES_EXCLAMATION),
                                        message: 'VALIDATE_DESCRIPTION.companyTagLine.pattern',
                                    },
                                    {
                                        rule: Validators.maxLength(50),
                                        message: 'VALIDATE_DESCRIPTION.companyTagLine.pattern',
                                    },
                                ],
                            },
                            {
                                label: 'supplier-profile.tabs.core-business.form.anniversary-date',
                                name: 'companyAnniversaryDate',
                                fieldType: E_FieldType.DATEPICKER,
                                max: new Date().toISOString(),
                            },
                            {
                                label: 'supplier-profile.tabs.core-business.form.banner-image',
                                name: 'imageBanner',
                                fieldType: E_FieldType.UPLOAD,
                                uploadType: 'single',
                            },
                        ],
                    },
                    {
                        label: 'supplier-profile.tabs.core-business.form.client-industry-focus',
                        fieldType: E_FieldType.CONTAINER,
                        containerType: E_ContainerType.FIELDSET,
                        children: [
                            {
                                fieldType: E_FieldType.TABLE,
                                name: TABLE_CLIENT_INDUSTRY_FOCUS,
                                table: {
                                    class: '!h-auto mt-3',
                                    createButton: {
                                        text: 'supplier-profile.tabs.core-business.form.btn-add',
                                    },
                                    columns: [
                                        {
                                            name: 'industryFocus',
                                            label: 'supplier-profile.tabs.core-business.form.industry-detail-header',
                                            headerStyle: TABLE_HEADER_STYLE,
                                            type: E_TableColumnType.ACTION,
                                            render: (cell) => cell.label,
                                            ctas: [
                                                {
                                                    icon: 'search',
                                                    onClick: () => this.openIndustrySelectDialog(),
                                                },
                                            ],
                                        },
                                        {
                                            name: 'percentage',
                                            label: 'supplier-profile.tabs.core-business.form.percentage-header',
                                            headerStyle: TABLE_HEADER_STYLE,
                                            type: E_TableColumnType.FORM,
                                            form: {
                                                name: `${TABLE_CLIENT_INDUSTRY_FOCUS}-percentage`,
                                                config: [
                                                    {
                                                        appearance: E_FieldAppearance.FILL,
                                                        name: 'percentage',
                                                        label: 'supplier-profile.tabs.core-business.form.percentage-label',
                                                        validate: [
                                                            {
                                                                rule: Validators.min(1),
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.percentageIndustry.format',
                                                            },
                                                            {
                                                                rule: Validators.max(100),
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.percentageIndustry.format',
                                                            },
                                                            {
                                                                rule: () =>
                                                                    this.form
                                                                        .tableGetColumnValues(
                                                                            TABLE_CLIENT_INDUSTRY_FOCUS,
                                                                            'percentage',
                                                                        )
                                                                        .reduce((acc, cur) => acc + parseInt(cur), 0) <=
                                                                    100,
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.percentageIndustry.format',
                                                            },
                                                        ],
                                                        onChange: (e, _, config) => {
                                                            this.form.tableUpdateRows([
                                                                {
                                                                    name: TABLE_CLIENT_INDUSTRY_FOCUS,
                                                                    index: config.index,
                                                                    key: 'percentage',
                                                                    value: e.target.value,
                                                                },
                                                            ]);
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            headerStyle: TABLE_HEADER_STYLE,
                                            cellStyle: { width: '50px' },
                                            sticky: 'right',
                                            type: E_TableColumnType.ACTION,
                                            name: 'action',
                                            ctas: [
                                                {
                                                    icon: 'delete',
                                                    onClick: (_, index) => {
                                                        this.form.tableDeleteRows([
                                                            {
                                                                name: TABLE_CLIENT_INDUSTRY_FOCUS,
                                                                index,
                                                            },
                                                        ]);
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    {
                        label: 'supplier-profile.tabs.core-business.form.client-focus',
                        fieldType: E_FieldType.CONTAINER,
                        containerType: E_ContainerType.FIELDSET,
                        children: [
                            {
                                fieldType: E_FieldType.TABLE,
                                name: TABLE_CLIENT_FOCUS,
                                table: {
                                    class: '!h-auto mt-3',
                                    columns: [
                                        {
                                            name: 'name',
                                            label: 'supplier-profile.tabs.core-business.form.client-scale-description-header',
                                            headerStyle: TABLE_HEADER_STYLE,
                                            render: (cell) => cell.label,
                                        },
                                        {
                                            name: 'percentage',
                                            label: 'supplier-profile.tabs.core-business.form.percentage-header',
                                            headerStyle: TABLE_HEADER_STYLE,
                                            type: E_TableColumnType.FORM,
                                            form: {
                                                name: `${TABLE_CLIENT_FOCUS}-percentage`,
                                                config: [
                                                    {
                                                        appearance: E_FieldAppearance.FILL,
                                                        name: 'percentage',
                                                        label: 'supplier-profile.tabs.core-business.form.percentage-label',
                                                        validate: [
                                                            {
                                                                rule: Validators.min(1),
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.clientFocus.percentage.pattern',
                                                            },
                                                            {
                                                                rule: Validators.max(100),
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.clientFocus.percentage.pattern',
                                                            },
                                                            {
                                                                rule: () =>
                                                                    this.form
                                                                        .tableGetColumnValues(
                                                                            TABLE_CLIENT_FOCUS,
                                                                            'percentage',
                                                                        )
                                                                        .reduce((acc, cur) => acc + parseInt(cur), 0) <=
                                                                    100,
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.clientFocus.percentage.pattern',
                                                            },
                                                        ],
                                                        onChange: (e, _, config) => {
                                                            this.form.tableUpdateRows([
                                                                {
                                                                    name: TABLE_CLIENT_FOCUS,
                                                                    index: config.index,
                                                                    key: 'percentage',
                                                                    value: e.target.value,
                                                                },
                                                            ]);
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    {
                        label: 'supplier-profile.tabs.core-business.form.portfolio',
                        fieldType: E_FieldType.CONTAINER,
                        containerType: E_ContainerType.FIELDSET,
                        children: [
                            {
                                fieldType: E_FieldType.TABLE,
                                name: TABLE_PORFOLIO,
                                table: {
                                    class: '!h-auto mt-3',
                                    createButton: {
                                        text: 'supplier-profile.tabs.core-business.form.btn-add',
                                    },
                                    columns: [
                                        {
                                            name: 'projectName',
                                            label: 'supplier-profile.tabs.core-business.form.project-name-header',
                                            headerStyle: TABLE_HEADER_STYLE,
                                            type: E_TableColumnType.FORM,
                                            form: {
                                                class: 'w-[150px]',
                                                config: [
                                                    {
                                                        appearance: E_FieldAppearance.FILL,
                                                        name: 'projectName',
                                                        label: 'supplier-profile.tabs.core-business.form.project-name-label',
                                                        validate: [
                                                            {
                                                                rule: Validators.required,
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.companyPortfolio.projectName.required',
                                                            },
                                                            {
                                                                rule: Validators.maxLength(50),
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.companyPortfolio.projectName.pattern',
                                                            },
                                                            {
                                                                rule: Validators.pattern(
                                                                    REGEX_TITLE_CASE_VIETNAMESE_WITH_SPACES,
                                                                ),
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.companyPortfolio.projectName.pattern',
                                                            },
                                                        ],
                                                        onChange: (e, _, config) => {
                                                            this.form.tableUpdateRows([
                                                                {
                                                                    name: TABLE_PORFOLIO,
                                                                    index: config.index,
                                                                    key: 'projectName',
                                                                    value: e.target.value,
                                                                },
                                                            ]);
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            name: 'customerName',
                                            label: 'supplier-profile.tabs.core-business.form.customer-name-header',
                                            headerStyle: TABLE_HEADER_STYLE,
                                            type: E_TableColumnType.FORM,
                                            form: {
                                                class: 'w-[150px]',
                                                config: [
                                                    {
                                                        appearance: E_FieldAppearance.FILL,
                                                        name: 'customerName',
                                                        label: 'supplier-profile.tabs.core-business.form.customer-name-label',
                                                        validate: [
                                                            {
                                                                rule: Validators.required,
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.companyPortfolio.customerName.required',
                                                            },
                                                            {
                                                                rule: Validators.maxLength(50),
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.companyPortfolio.customerName.pattern',
                                                            },
                                                        ],
                                                        onChange: (e, _, config) => {
                                                            this.form.tableUpdateRows([
                                                                {
                                                                    name: TABLE_PORFOLIO,
                                                                    index: config.index,
                                                                    key: 'customerName',
                                                                    value: e.target.value,
                                                                },
                                                            ]);
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            name: 'value',
                                            label: 'supplier-profile.tabs.core-business.form.value-header',
                                            headerStyle: TABLE_HEADER_STYLE,
                                            type: E_TableColumnType.FORM,
                                            form: {
                                                class: 'w-[150px]',
                                                config: [
                                                    {
                                                        appearance: E_FieldAppearance.FILL,
                                                        name: 'value',
                                                        label: 'supplier-profile.tabs.core-business.form.value-label',
                                                        validate: [
                                                            {
                                                                rule: Validators.required,
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.companyPortfolio.value.required',
                                                            },
                                                            {
                                                                rule: Validators.min(0),
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.companyPortfolio.value.pattern',
                                                            },
                                                        ],
                                                        onChange: (e, _, config) => {
                                                            this.form.tableUpdateRows([
                                                                {
                                                                    name: TABLE_PORFOLIO,
                                                                    index: config.index,
                                                                    key: 'value',
                                                                    value: e.target.value,
                                                                },
                                                            ]);
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            name: 'projectDescription',
                                            label: 'supplier-profile.tabs.core-business.form.project-description-header',
                                            headerStyle: TABLE_HEADER_STYLE,
                                            type: E_TableColumnType.FORM,
                                            form: {
                                                class: 'w-[150px]',
                                                config: [
                                                    {
                                                        appearance: E_FieldAppearance.FILL,
                                                        name: 'projectDescription',
                                                        label: 'supplier-profile.tabs.core-business.form.project-description-label',
                                                        validate: [
                                                            {
                                                                rule: Validators.required,
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.companyPortfolio.projectDesc.required',
                                                            },
                                                            {
                                                                rule: Validators.maxLength(350),
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.companyPortfolio.projectDesc.pattern',
                                                            },
                                                            {
                                                                rule: Validators.minLength(10),
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.companyPortfolio.projectDesc.pattern',
                                                            },
                                                        ],
                                                        onChange: (e, _, config) => {
                                                            this.form.tableUpdateRows([
                                                                {
                                                                    name: TABLE_PORFOLIO,
                                                                    index: config.index,
                                                                    key: 'projectDescription',
                                                                    value: e.target.value,
                                                                },
                                                            ]);
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            name: 'image',
                                            label: 'supplier-profile.tabs.core-business.form.project-image-header',
                                            headerStyle: TABLE_HEADER_STYLE,
                                            type: E_TableColumnType.FORM,
                                            form: {
                                                config: [
                                                    {
                                                        appearance: E_FieldAppearance.FILL,
                                                        name: 'image',
                                                        fieldType: E_FieldType.UPLOAD,
                                                        validate: [
                                                            {
                                                                rule: Validators.required,
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.companyPortfolio.projectPicture.required',
                                                            },
                                                            {
                                                                rule: (value) => {
                                                                    return (
                                                                        value.size < 4 * 1024 * 1024 &&
                                                                        [
                                                                            'image/png',
                                                                            'image/jpg',
                                                                            'image/jpeg',
                                                                        ].includes(value.type)
                                                                    );
                                                                },
                                                                message:
                                                                    'VALIDATE_DESCRIPTION.companyPortfolio.projectPicture.pattern',
                                                            },
                                                        ],
                                                        onChange: (value, _, config) => {
                                                            this.form.tableUpdateRows([
                                                                {
                                                                    name: TABLE_PORFOLIO,
                                                                    index: config.index,
                                                                    key: 'image',
                                                                    value,
                                                                },
                                                            ]);
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            headerStyle: TABLE_HEADER_STYLE,
                                            cellStyle: {
                                                width: '50px',
                                            },
                                            sticky: 'right',
                                            type: E_TableColumnType.ACTION,
                                            name: 'action',
                                            ctas: [
                                                {
                                                    icon: 'delete',
                                                    onClick: (_, index) => {
                                                        this.form.tableDeleteRows([
                                                            {
                                                                name: TABLE_PORFOLIO,
                                                                index,
                                                            },
                                                        ]);
                                                        this.portfoliosDelete.push(
                                                            `${this.data[TABLE_PORFOLIO][index].id}`,
                                                        );
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
            {
                label: 'supplier-profile.tabs.core-business.form.certificate',
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.FIELDSET,
                children: [
                    {
                        label: 'supplier-profile.tabs.core-business.form.certificate',
                        name: 'certificate',
                        fieldType: E_FieldType.UPLOAD,
                        uploadType: 'multiple',
                        showPreview: true,
                    },
                ],
            },
        ];
    }

    @Input() mode: E_Form_Mode;
    @Input() data: I_Supplier;
    @Input() onSave: (values, callback) => void;

    language: string;
    categoriesSelected: I_Category[] = [];
    industriesSelected: I_Industry[] = [];
    portfoliosDelete: string[] = [];
    certificateRemove: string[] = [];

    ngOnInit() {
        this.masterDataService.getLanguages().then((languages) => (this.language = languages?.data?.[0]?.id));
    }

    async ngOnChanges(changes) {
        switch (changes?.mode?.currentValue) {
            case E_Form_Mode.CREATE: {
                this.form.reset();
                break;
            }
            case E_Form_Mode.READ: {
                break;
            }
            case E_Form_Mode.UPDATE: {
                break;
            }
        }

        const oldData = this.localStorageService.get(FORM_NAME);

        if (oldData) {
            this.setFormData(oldData);
        } else if (changes?.data?.currentValue) {
            const newFormData = changes.data.currentValue;

            if (!changes.data.currentValue?.[TABLE_CLIENT_FOCUS]?.length) {
                const clientFocuses = await this.accountService.getClientFocuses().then((res) => res.data);

                const clientFocus = clientFocuses.map((cf) => ({
                    name: {
                        value: cf.id,
                        label: translateData(cf, this.localStorageService.get('languageCode'), 'name'),
                    },
                }));

                newFormData[TABLE_CLIENT_FOCUS] = clientFocus;
            }

            this.setFormData(newFormData);
        }
    }

    setFormData = async (values) => {
        this.form.patchValue({
            bankName: values.bankName,
            bankCode: values.bankCode,
            bankAddress: values.bankAddress,
            beneficiaryName: values.beneficiaryName,
            switchBicCode: values.switchBicCode,
            bankCurrency: values.bankCurrency,
            bankAccountNumber: values.bankAccountNumber,
            internationalBank: values.internationalBank,
            companyDescription: values.companyDescription,
            companyEstablishedSince: values.companyEstablishedSince,
            companyTagLine: values.companyTagLine,
            companyAnniversaryDate: values.companyAnniversaryDate,
            imageBanner: values.imageBanner,
            [TABLE_CORE_BUSINESS_INFORMATION]: values[TABLE_CORE_BUSINESS_INFORMATION],
            [TABLE_CLIENT_INDUSTRY_FOCUS]: values[TABLE_CLIENT_INDUSTRY_FOCUS],
            [TABLE_CLIENT_FOCUS]: values[TABLE_CLIENT_FOCUS],
            [TABLE_PORFOLIO]: values[TABLE_PORFOLIO],
            certificate: values.certificate.map((cer) => cer.file),
        });

        this.industriesSelected = values[TABLE_CLIENT_INDUSTRY_FOCUS].map((industry) => ({
            id: industry.industryFocus.value,
            name: industry.industryFocus.label,
        }));
        this.categoriesSelected = values[TABLE_CORE_BUSINESS_INFORMATION].map((cb) => ({
            id: cb.coreBusinessDetailed.value,
            name: cb.coreBusinessDetailed.label,
            subClusterCode: {
                id: cb.coreBusinessSubCluster.value,
                name: cb.coreBusinessSubCluster.label,
            },
        }));
    };

    openCategorySelectDialog = () => {
        // this.modalService.show({
        //     modal: {
        //         height: 'auto',
        //         title: 'supplier-profile.tabs.core-business.form.select-category-modal-title',
        //         content: CategorySelectComponent,
        //         footer: {
        //             onSubmit: (categoriesSelected: I_Category[]) => {
        //                 const rowsToUpdate = categoriesSelected.flatMap((category, index) => [
        //                     {
        //                         name: TABLE_CORE_BUSINESS_INFORMATION,
        //                         index,
        //                         key: 'coreBusinessSubCluster',
        //                         value: {
        //                             label: category.subClusterCode.name,
        //                             value: category.subClusterCode.id,
        //                         },
        //                     },
        //                     {
        //                         name: TABLE_CORE_BUSINESS_INFORMATION,
        //                         index,
        //                         key: 'coreBusinessDetailed',
        //                         value: {
        //                             label: category.name,
        //                             value: category.id,
        //                         },
        //                     },
        //                 ]);

        //                 this.form.tableUpdateRows(rowsToUpdate, true);
        //                 this.categoriesSelected = categoriesSelected;
        //                 this.modalService.hide();
        //             },
        //         },
        //     },
        //     data: {
        //         categoriesSelected: this.categoriesSelected,
        //     },
        // });
    };

    openIndustrySelectDialog = () => {
        // this.modalService.show({
        //     modal: {
        //         height: 'auto',
        //         title: 'supplier-profile.tabs.core-business.form.select-industry-modal-title',
        //         content: IndustrySelectComponent,
        //         footer: {
        //             onSubmit: (industriesSelected: I_Industry[]) => {
        //                 const rowsToUpdate = industriesSelected.flatMap((industry, index) => [
        //                     {
        //                         name: TABLE_CLIENT_INDUSTRY_FOCUS,
        //                         index,
        //                         key: 'industryFocus',
        //                         value: {
        //                             label: industry.name,
        //                             value: industry.id,
        //                         },
        //                     },
        //                 ]);

        //                 this.form.tableUpdateRows(rowsToUpdate, true);
        //                 this.industriesSelected = industriesSelected;
        //                 this.modalService.hide();
        //             },
        //         },
        //     },
        //     data: {
        //         industriesSelected: this.industriesSelected,
        //     },
        // });
    };

    onSubmit = async () => {
        this.form.submit(
            ({
                bankName,
                bankCode,
                bankAddress,
                beneficiaryName,
                switchBicCode,
                bankCurrency,
                bankAccountNumber,
                internationalBank,
                companyDescription,
                companyEstablishedSince,
                companyTagLine,
                companyAnniversaryDate,
                imageBanner,
                coreBusiness,
                industries,
                clientFocus,
                portfolios,
                certificate,
            }) => {
                const submitData = {
                    bankName,
                    bankCode,
                    bankAddress,
                    beneficiaryName,
                    switchBicCode,
                    bankCurrency,
                    bankAccountNumber,
                    internationalBank,
                    companyDescription,
                    companyEstablishedSince: parseInt(companyEstablishedSince),
                    companyTagLine,
                    companyAnniversaryDate,
                    imageBanner,
                    coreBusiness: [
                        coreBusiness.map((cb) => {
                            return {
                                category: cb.coreBusinessDetailed.value,
                                percentage: parseInt(cb.percentage),
                                minimumOfValue: parseInt(cb.minimumOfValue),
                            };
                        }),
                    ],
                    industries: industries.map((id) => {
                        return {
                            industrySubSectors: id.industryFocus.value,
                            percentage: parseInt(id.percentage),
                        };
                    }),
                    clientFocus: clientFocus.map((cf) => {
                        return {
                            clientFocus: cf.name.value,
                            percentage: parseInt(cf.percentage),
                        };
                    }),
                    portfolios:
                        portfolios?.length > 0
                            ? portfolios?.map((po) => {
                                  return {
                                      id: null,
                                      projectName: po.projectName,
                                      company: po.customerName,
                                      value: parseInt(po.value),
                                      projectDescription: po.projectDescription,
                                      isDeleteImage: false,
                                      ...(po.image && { image: po.image }),
                                  };
                              })
                            : [],
                    portfoliosDelete: this.portfoliosDelete,
                    ...(certificate && { certificateList: certificate }),
                    certificateRemove: this.certificateRemove,
                    formRegistrations: null,
                    bankCertifications: null,
                    qualityCertifications: null,
                    businessLicenses: null,
                    taxCertifications: null,
                    other: null,
                };

                this.onSave(submitData, () => {
                    this.localStorageService.remove(FORM_NAME);
                });
            },
            FORM_NAME,
        );
    };
}
