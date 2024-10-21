import { MaterialModules } from '#shared/modules';
import { FormService, SaleSchemeService } from '#shared/services';
import { E_ContainerType, E_FieldType, E_SicpType, E_TableColumnType, I_SupplierSicpTextEditor } from '#shared/types';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormComponent } from 'shared/components/form/form.component';

@Component({
    standalone: true,
    selector: 'app-supplier-verification',
    templateUrl: './verification.component.html',
    styleUrl: './verification.component.scss',
    providers: [FormService],
    imports: [CommonModule, FormComponent, MaterialModules, TranslateModule],
})
export class SupplierVerificationComponent {
    constructor(
        public form: FormService,
        private translateService: TranslateService,
        private saleSchemeService: SaleSchemeService,
    ) {
        this.form.config = [
            {
                name: 'documentsContainer',
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.DIV,
                children: [
                    {
                        fieldType: E_FieldType.TABLE,
                        name: 'document',
                        table: {
                            class: '!h-auto',
                            data: [
                                {
                                    key: 'legal-status',
                                    label: 'supplier-profile.tabs.verification.legal-status',
                                },
                                {
                                    key: 'bank-account',
                                    label: 'supplier-profile.tabs.verification.bank-account',
                                },
                                {
                                    key: 'sanction-check',
                                    label: 'supplier-profile.tabs.verification.sanction-check',
                                },
                                {
                                    key: 'certification-management',
                                    label: 'supplier-profile.tabs.verification.certification-management',
                                },
                                {
                                    key: 'due-diligence',
                                    label: 'supplier-profile.tabs.verification.due-diligence',
                                },
                                {
                                    key: 'financial-risk-management',
                                    label: 'supplier-profile.tabs.verification.financial-risk-management',
                                },
                            ],
                            columns: [
                                {
                                    name: 'label',
                                    label: 'supplier-profile.tabs.verification.sicp-module',
                                    render: (cell) => {
                                        return this.translateService.instant(cell);
                                    },
                                },
                                {
                                    headerStyle: { backgroundColor: '#dbdbdb', borderRight: '1px solid grey' },
                                    name: 'uploadDocuments',
                                    label: 'supplier-profile.tabs.verification.upload-document',
                                    type: E_TableColumnType.FORM,
                                    form: {
                                        config: [
                                            {
                                                label: 'supplier-profile.tabs.verification.upload-document',
                                                fieldType: E_FieldType.UPLOAD,
                                            },
                                        ],
                                    },
                                },
                                {
                                    headerStyle: { backgroundColor: '#dbdbdb', borderRight: '1px solid grey' },
                                    name: 'status',
                                    label: 'supplier-profile.tabs.verification.status-header',
                                },
                                {
                                    headerStyle: { backgroundColor: '#dbdbdb', borderRight: '1px solid grey' },
                                    name: 'documentAfterReview',
                                    label: 'supplier-profile.tabs.verification.document-after-review',
                                },
                            ],
                        },
                    },
                ],
            },
            {
                name: 'verificationContainer',
                label: 'supplier-profile.tabs.verification.history-documents',
                class: 'mb-10 border border-gray-400 rounded',
                fieldType: E_FieldType.CONTAINER,
                containerType: E_ContainerType.FIELDSET,
                children: [
                    {
                        fieldType: E_FieldType.TABLE,
                        name: 'historyDocuments',
                        table: {
                            class: '!h-auto',
                            columns: [
                                {
                                    cellStyle: { width: '50px' },
                                    name: 'no',
                                    label: 'supplier-profile.tabs.core-business.form.no-header',
                                    render: (_, index) => {
                                        return index + 1;
                                    },
                                },
                                {
                                    name: 'sicpModule',
                                    label: 'supplier-profile.tabs.verification.sicp-module',
                                    type: E_TableColumnType.FORM,
                                    form: {
                                        config: [
                                            {
                                                label: 'supplier-profile.tabs.verification.sicp-module',
                                            },
                                        ],
                                    },
                                },
                                {
                                    name: 'document',
                                    label: 'supplier-profile.tabs.verification.document',
                                    type: E_TableColumnType.FORM,
                                    form: {
                                        config: [
                                            {
                                                label: 'supplier-profile.tabs.verification.document',
                                            },
                                        ],
                                    },
                                },
                                {
                                    name: 'status',
                                    label: 'supplier-profile.tabs.verification.status',
                                    type: E_TableColumnType.FORM,
                                    form: {
                                        config: [
                                            {
                                                label: 'supplier-profile.tabs.verification.status',
                                            },
                                        ],
                                    },
                                },
                                {
                                    name: 'dateCreated',
                                    label: 'supplier-profile.tabs.verification.date-created',
                                    type: E_TableColumnType.FORM,
                                    form: {
                                        config: [
                                            {
                                                label: 'supplier-profile.tabs.verification.date-created',
                                            },
                                        ],
                                    },
                                },
                                {
                                    name: 'expiredDate',
                                    label: 'supplier-profile.tabs.verification.expired-date',
                                    type: E_TableColumnType.FORM,
                                    form: {
                                        config: [
                                            {
                                                label: 'supplier-profile.tabs.verification.expired-date',
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ];
    }

    keys = [
        'legal-status',
        'bank-account',
        'sanction-check',
        'certification-management',
        'due-diligence',
        'financial-risk-management',
    ];
    public mappedTextEditors: { [key: string]: { en: string; vi: string } } = {};

    supplierSicpTextEditor: I_SupplierSicpTextEditor[];

    async ngOnInit() {
        const supplierSicpTextEditor = await this.saleSchemeService.getSupplierSicpTextEditor();

        this.supplierSicpTextEditor = supplierSicpTextEditor.data;

        this.supplierSicpTextEditor.forEach((editor) => {
            const labelKey = this.getLabelForSicpType(editor.sicpType);
            if (labelKey) {
                this.mappedTextEditors[labelKey] = {
                    en: editor.textEditerEn || '',
                    vi: editor.textEditerVi || '',
                };
            }
        });
    }

    getLabelForSicpType(sicpType: number): string {
        const labels = {
            [E_SicpType.BANK_ACCOUNT]: 'supplier-profile.tabs.verification.bank-account',
            [E_SicpType.CERTIFICATION_MANAGEMENT]: 'supplier-profile.tabs.verification.certification-management',
            [E_SicpType.DUE_DILIGENCE]: 'supplier-profile.tabs.verification.due-diligence',
            [E_SicpType.FINANCIAL_RISK_MANAGEMENT]: 'supplier-profile.tabs.verification.financial-risk-management',
            [E_SicpType.LEGAL_STATUS]: 'supplier-profile.tabs.verification.legal-status',
            [E_SicpType.SANCTION_CHECK]: 'supplier-profile.tabs.verification.sanction-check',
        };
        return labels[sicpType] || '';
    }

    getFormattedText(key: string): string {
        const currentLang = this.translateService.currentLang;
        return this.mappedTextEditors[key] ? this.mappedTextEditors[key][currentLang] : '';
    }
}
