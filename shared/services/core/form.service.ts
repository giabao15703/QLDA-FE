import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { DateFnsModule } from '@angular/material-date-fns-adapter';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import {
    GridLayout,
    Image,
    ModalGalleryService,
    PlainGalleryStrategy,
    PlainLibConfig,
} from '@ks89/angular-modal-gallery';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { cloneDeep, debounce, isEqual, memoize, merge } from 'lodash';
import { Subscription, startWith } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import {
    E_ContainerType,
    E_FieldType,
    E_InputType,
    E_TableColumnType,
    I_FieldConfig,
    T_Any,
    T_FieldCustomValidator,
} from '#shared/types';
import { LocalStorageService } from './local-storage.service';

export interface I_FormInstance {
    form: FormGroup;
    config: I_FieldConfig[];
}

@Injectable()
export class FormService<D = T_Any> {
    constructor(
        private formBuilder: FormBuilder,
        private translateService: TranslateService,
        private localStorageService: LocalStorageService,
        private modalGalleryService: ModalGalleryService,
    ) {
        this.inheritFormMethods();
    }

    private static instances = new Map<string, I_FormInstance>();
    private validationInProgress = new Map<string, boolean>();
    private nameValue: string;
    public form: FormGroup;
    private configValue: I_FieldConfig[];
    private subscriptions: Subscription[] = [];
    [method: string]: T_Any;
    previewValue: T_Any;

    libConfigPlainGalleryGrid: PlainLibConfig = {
        plainGalleryConfig: {
            strategy: PlainGalleryStrategy.GRID,
            layout: new GridLayout({ width: '100px', height: '100px' }, { length: 10, wrap: true }),
        },
    };

    ngOnDestroy() {
        FormService.instances.delete(this.name);
    }

    private saveInstance(name: string, form: FormGroup, config: I_FieldConfig[]): void {
        FormService.instances.set(name, { form, config });
    }

    public getInstance(name: string): I_FormInstance | undefined {
        return FormService.instances.get(name);
    }

    public getInstances(): Map<string, I_FormInstance> {
        return FormService.instances;
    }

    onChange = (callback: (oldValues: T_Any, newValues: T_Any) => void): void => {
        let previousValue = cloneDeep(this.form.value);

        this.form.valueChanges.pipe(startWith(this.form.value)).subscribe((currentValue) => {
            if (!isEqual(previousValue, currentValue)) {
                callback(previousValue, currentValue);
                previousValue = cloneDeep(currentValue);
            }
        });
    };

    private inheritFormMethods = () => {
        const formGroupMethods = Object.getOwnPropertyNames(FormGroup.prototype);
        formGroupMethods.forEach((method) => {
            if (method !== 'constructor') {
                this[method] = (...args: T_Any[]) => (this.form as T_Any)[method](...args);
            }
        });
    };

    private generateCustomValidator = (
        validatorFn: T_FieldCustomValidator,
        message: string,
        config: I_FieldConfig,
    ): ValidatorFn => {
        return (field: AbstractControl) => {
            if (this.form && validatorFn(field.value, this.form, config)) {
                return null;
            }

            return { validate: message };
        };
    };

    private generateValidators = (fieldConfig: I_FieldConfig): ValidatorFn[] => {
        if (!fieldConfig.validate) {
            return [];
        }

        return fieldConfig.validate.map((val) => {
            if (val.rule.name === 'rule') {
                return this.generateCustomValidator(val.rule as T_FieldCustomValidator, val.message, fieldConfig);
            }

            return val.rule as ValidatorFn;
        });
    };

    private generateField = (fieldConfig: I_FieldConfig): AbstractControl | null => {
        const { fieldType, inputType, containerType, value, disabled } = fieldConfig;

        if (fieldType === E_FieldType.TEXT) {
            return null;
        }

        if ([E_FieldType.DYNAMIC].includes(fieldType)) {
            return this.formBuilder.array([]);
        }

        if (fieldType === E_FieldType.CONTAINER) {
            fieldConfig.containerType = containerType || E_ContainerType.DIV;
        }

        if (!fieldType) {
            fieldConfig.fieldType = E_FieldType.INPUT;

            if (!inputType) {
                fieldConfig.inputType = E_InputType.TEXT;
            }
        }

        const validators: ValidatorFn[] = this.generateValidators(fieldConfig);

        const fieldTypeDefaultValue = {
            input: '',
            textarea: '',
            select: '',
            checkbox: false,
            radio: '',
            rating: 0,
            upload: '',
            'text-editor': '',
            datepicker: '',
            table: [],
            button: '',
        };

        const fieldValue = value ?? fieldTypeDefaultValue[fieldType || E_FieldType.INPUT];

        return this.formBuilder.control(
            {
                value: fieldValue,
                disabled,
            },
            validators,
        );
    };

    private generateFieldInstances = (formConfig: I_FieldConfig[]): { [key: string]: AbstractControl } => {
        const fieldInstances = {};

        const generateField = (config: I_FieldConfig) => {
            const field = this.generateField(config);

            if (field) {
                if (config.fieldType === E_FieldType.UPLOAD) {
                    field.valueChanges.subscribe((file) => {
                        if (file instanceof File && config.onChange && typeof config.onChange === 'function') {
                            config.onChange(file, this.form, config);
                        }
                    });
                }

                fieldInstances[config.name] = field;

                if (config.children && config.fieldType !== E_FieldType.DYNAMIC) {
                    config.children.forEach(generateField);
                }
            }
        };

        formConfig.forEach(generateField);

        return fieldInstances;
    };

    private generateForm = (formConfig: I_FieldConfig[]) => {
        const fieldInstances = this.generateFieldInstances(formConfig);

        return this.formBuilder.group(fieldInstances);
    };

    getField = (fieldName: string) => {
        const field = this.form.get(fieldName);

        return field;
    };

    getDynamicFields = (fieldName: string) => {
        const field = this.form.get(fieldName) as FormArray;

        return field;
    };

    createDynamicField = (fieldConfig: I_FieldConfig) => {
        const formArray = this.getField(fieldConfig.name) as FormArray;
        const childFormGroup = this.generateForm(fieldConfig.children);

        if (!fieldConfig.maxLength || formArray.length < fieldConfig.maxLength) {
            formArray.push(childFormGroup);
        }
    };

    deleteDynamicField = (fieldConfig: I_FieldConfig, index: number) => {
        const field = this.getField(fieldConfig.name) as FormArray;
        field.removeAt(index);
    };

    private mapOptions = (config, options) => {
        config.options = config.mapOption ? options.map(config.mapOption) : options;
    };

    private subscribeToChanges(configs: I_FieldConfig[]) {
        configs.forEach((fieldConfig) => {
            if (fieldConfig.listenChangeFrom) {
                const listeningField = this.getField(fieldConfig.listenChangeFrom);

                if (listeningField) {
                    const sub = listeningField.valueChanges.subscribe((value) => {
                        if (fieldConfig.getOptions) {
                            fieldConfig.getOptions(value).then((options) => {
                                this.mapOptions(fieldConfig, options);
                            });
                        }
                    });
                    this.subscriptions.push(sub);
                }
            }

            if (fieldConfig.children) {
                this.subscribeToChanges(fieldConfig.children);
            }
        });
    }

    get name(): string {
        return this.nameValue;
    }

    set name(value: string) {
        this.nameValue = `${value}-${uuidv4()}`;
    }

    get config(): I_FieldConfig[] {
        return this.configValue;
    }

    set config(value: I_FieldConfig[]) {
        this.configValue = value;
        this.form = this.generateForm(value);
        this.saveInstance(this.name, this.form, value);
        this.subscribeToChanges(this.config);
    }

    private refetchOptions = (config: I_FieldConfig) => {
        config.getOptions(config?.value).then((options) => {
            this.mapOptions(config, options);
        });
    };

    private findFieldConfigs = ({
        configs,
        predicate,
        foundConfigs = [],
    }: {
        configs: I_FieldConfig[];
        predicate: (config: I_FieldConfig) => boolean;
        foundConfigs?: I_FieldConfig[];
    }): I_FieldConfig[] => {
        const stack: I_FieldConfig[] = [...configs];

        while (stack.length) {
            const config = stack.pop();

            if (predicate(config)) {
                foundConfigs.push(config);
            }

            if (config.children) {
                stack.push(...config.children);
            }

            if (config.fieldType === E_FieldType.TABLE) {
                config.table.columns
                    .filter((column) => column.type === E_TableColumnType.FORM)
                    .forEach((column) => stack.push(...column.form.config));
            }
        }

        return foundConfigs;
    };

    private triggerGetOptions = (isInit, config: I_FieldConfig) => {
        if ((isInit && !config.options && config.getOptions) || (!isInit && config.translateOptions)) {
            this.refetchOptions(config);
        }
    };

    getAsyncOptions = ({ isInit }: { isInit?: boolean }) => {
        const predicate = (config: I_FieldConfig) =>
            config.getOptions &&
            ((config.fieldType === E_FieldType.INPUT &&
                config.inputType === E_InputType.AUTOCOMPLETE &&
                !config.listenChangeFrom) ||
                (config.fieldType === E_FieldType.SELECT && (!config.listenChangeFrom || config.value)) ||
                (config.fieldType === E_FieldType.RADIO && !config.listenChangeFrom));
        const foundConfigs = this.findFieldConfigs({ configs: this.config, predicate });
        foundConfigs.forEach((config) => this.triggerGetOptions(isInit, config));
    };

    private getFieldErrorMessage = (
        field: AbstractControl,
        fieldConfig: I_FieldConfig,
        validatorName: string,
    ): string => {
        const validateConfig = fieldConfig.validate.find((validator) => {
            if (validator.rule.name === 'rule') {
                return validatorName === 'validate';
            }

            return validatorName === validator.rule.name;
        });

        return this.translateService.instant(validateConfig ? validateConfig.message : field.errors[validatorName]);
    };

    getFieldError = (config: I_FieldConfig): string => {
        const currentField = this.getField(config.name);

        if (currentField?.hasError('required')) {
            return this.getFieldErrorMessage(currentField, config, 'required') ?? 'This field is required';
        }

        if (currentField?.hasError('pattern')) {
            return this.getFieldErrorMessage(currentField, config, '');
        }

        if (currentField?.hasError('validate')) {
            return this.getFieldErrorMessage(currentField, config, 'validate');
        }

        return '';
    };

    private findListeningFieldConfig = (name: string): I_FieldConfig => {
        return (
            this.findFieldConfigs({
                configs: this.config,
                predicate: (config) => config.listenChangeFrom === name,
            })[0] || ({} as I_FieldConfig)
        );
    };

    private isInputOrAutocompleteOrCheckboxOrRadioField = (config: I_FieldConfig, event: Event): boolean => {
        const isInputField =
            [E_FieldType.INPUT].includes(config.fieldType) &&
            [E_InputType.TEXT, E_InputType.PASSWORD, E_InputType.CHIP].includes(config.inputType);

        const isAutoCompleteField =
            [E_FieldType.INPUT].includes(config.fieldType) &&
            [E_InputType.AUTOCOMPLETE].includes(config.inputType) &&
            event instanceof MatAutocompleteSelectedEvent;

        const isCheckboxOrRadioField =
            [E_FieldType.CHECKBOX, E_FieldType.RADIO].includes(config.fieldType) &&
            (event instanceof MatCheckboxChange || event instanceof MatRadioChange);

        return isInputField || isAutoCompleteField || isCheckboxOrRadioField;
    };

    private isSelectField = (config: I_FieldConfig, event: Event): boolean => {
        return [E_FieldType.SELECT].includes(config.fieldType) && event instanceof MatSelectChange;
    };

    private handleSelectFieldChange = async (event: MatSelectChange, config: I_FieldConfig) => {
        const listenFieldConfig = this.findListeningFieldConfig(config.name);

        if (listenFieldConfig.fieldType === E_FieldType.SELECT) {
            const options = await listenFieldConfig.getOptions(event.value);
            this.mapOptions(listenFieldConfig, options);
        }
    };

    onFieldChange = async (event, config: I_FieldConfig) => {
        if (this.isInputOrAutocompleteOrCheckboxOrRadioField(config, event)) {
            config.onChange?.(event, this.form, config);
        } else if (this.isSelectField(config, event)) {
            await this.handleSelectFieldChange(event, config);
        }
    };

    onFieldChangeDebounce = debounce(async (event, config: I_FieldConfig) => {
        const target = event.target as HTMLInputElement;
        const newOptions = await config.getOptions(target.value);
        this.mapOptions(config, newOptions);
    }, 500);

    autoCompleteDisplayWith = (option): string => {
        if (typeof option === 'string') {
            return option;
        }

        return option?.label ?? '';
    };

    togglePassword = (event, config: I_FieldConfig) => {
        event.preventDefault();
        config._showPassword = !config._showPassword;
    };

    getFieldValue = (config: I_FieldConfig) => {
        const fieldValue = this.getField(config.name).value;
        let currentValue = fieldValue;

        if (config.fieldType === E_FieldType.UPLOAD) {
            currentValue = config.uploadType === 'multiple' ? fieldValue[0] : fieldValue;

            if (config.showPreview && !this.previewValue && currentValue instanceof File) {
                if (currentValue.name.includes('http') || currentValue.name.includes('https')) {
                    this.previewValue = currentValue.name;
                }

                this.previewValue = URL.createObjectURL(currentValue);
            }
        }

        return currentValue;
    };

    getFieldValueFileType = memoize((config: I_FieldConfig): 'image' | 'video' => {
        const file = this.getFieldValue(config);

        const isImage = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/gif',
            'image/bmp',
            'image/webp',
            'image/svg+xml',
        ].includes(file.type);

        const isVideo = ['video/mp4', 'video/ogg', 'video/webm'].includes(file.type);

        return isImage ? 'image' : isVideo ? 'video' : null;
    });

    getPreviewImages = memoize((config: I_FieldConfig): Image[] => {
        const currentValue = this.getField(config.name).value;

        return (config.uploadType === 'multiple' ? currentValue : [currentValue]).map(
            (file, fileIndex) => new Image(fileIndex, { img: URL.createObjectURL(file) }),
        );
    });

    showPreviewImage = (id, index, config): void => {
        const images = this.getPreviewImages(config);
        this.modalGalleryService.open({ id, images, currentImage: images[index] });
    };

    isArray = (input): boolean => Array.isArray(input);

    downloadFile = (config: I_FieldConfig) => {
        const currentValue = this.getField(config.name).value;

        if (Array.isArray(currentValue)) {
            currentValue.forEach((file) => {
                FileSaver.saveAs(file, file.name);
            });
        } else {
            FileSaver.saveAs(currentValue, currentValue.name);
        }
    };

    datepickerMin = (config: I_FieldConfig): string | null => {
        if (typeof config?.min === 'string') {
            return config.min;
        }

        if (typeof config?.min === 'function') {
            return config.min(this.form);
        }

        return null;
    };

    datepickerMax = (config: I_FieldConfig): string | null => {
        if (typeof config?.max === 'string') {
            return config.max;
        }

        if (typeof config?.max === 'function') {
            return config.max(this.form);
        }

        return null;
    };

    datepickerYearSelected = (value: Date, datepicker: MatDatepicker<DateFnsModule>, config: I_FieldConfig): void => {
        if (config.yearSelected) {
            config.yearSelected(value, datepicker, this.getField(config.name), this.form, config);
        }
    };

    datepickerMonthSelected = (value: Date, datepicker: MatDatepicker<DateFnsModule>, config: I_FieldConfig): void => {
        if (config.monthSelected) {
            config.monthSelected(value, datepicker, this.getField(config.name), this.form, config);
        }
    };

    mutate = ({
        create = [],
        update = [],
        delete: deleteFields = [],
        enableAll,
        disableAll,
    }: {
        create?: { parent?: string; config: I_FieldConfig }[];
        update?: { name: string; config: Partial<I_FieldConfig>; isMerge?: boolean }[];
        delete?: string[];
        enableAll?: string[];
        disableAll?: string[];
    }) => {
        const currentValues = this.form.getRawValue();

        const processConfigs = (
            configs: I_FieldConfig[],
            action: (cfg: I_FieldConfig, index?: number, parent?: I_FieldConfig[]) => boolean,
        ) => {
            for (let i = 0; i < configs.length; i++) {
                if (action(configs[i], i, configs)) {
                    return true;
                }

                if (configs[i].children && processConfigs(configs[i].children, action)) {
                    return true;
                }
            }

            return false;
        };

        const createField = (parent: string, config: I_FieldConfig) => {
            const createChild = (cfg: I_FieldConfig) => {
                if (cfg.name === parent) {
                    if (cfg.children) {
                        cfg.children.push(config);
                    } else {
                        cfg.children = [config];
                    }

                    return true;
                }

                return false;
            };

            if (parent) {
                processConfigs(this.config, createChild);
            } else {
                this.config.push(config);
            }

            const newField = this.generateField(config);

            if (newField) {
                this.form.addControl(config.name, newField);
            }
        };

        const updateField = (name: string, config: Partial<I_FieldConfig>, isMerge: boolean) => {
            const updateChild = (cfg: I_FieldConfig) => {
                if (cfg.name === name) {
                    Object.assign(cfg, isMerge ? merge(cfg, config) : config);

                    if (this.form.contains(name)) {
                        const control = this.form.get(name);
                        control.setValidators(this.generateValidators(config));
                        control.updateValueAndValidity();

                        if ('value' in config) {
                            currentValues[name] = config.value;
                        }
                    }

                    return true;
                }

                return false;
            };

            processConfigs(this.config, updateChild);
        };

        const deleteField = (fieldName: string) => {
            const deleteChild = (cfg: I_FieldConfig, index: number, parent: I_FieldConfig[]) => {
                if (cfg.name === fieldName) {
                    parent.splice(index, 1);
                    this.form.removeControl(fieldName);

                    return true;
                }

                return false;
            };

            processConfigs(this.config, deleteChild);
        };

        create.forEach(({ parent, config }) => createField(parent, config));
        update.forEach(({ name, config, isMerge = true }) => updateField(name, config, isMerge));
        deleteFields.forEach((fieldName) => deleteField(fieldName));

        const newValues = create.reduce((acc, { config }) => {
            acc[config.name] = config.value ?? null;

            return acc;
        }, currentValues);

        this.form.patchValue(newValues);

        enableAll?.forEach((fieldName) => this.form.get(fieldName)?.enable());
        disableAll?.forEach((fieldName) => this.form.get(fieldName)?.disable());
    };

    tableGetColumnValues = (formName: string, fieldName: string) => {
        const instances = this.getInstances();

        const values = [];

        instances.forEach((instance, instanceName) => {
            if (instanceName?.startsWith(`${formName}-${fieldName}`)) {
                values.push(instance.form.getRawValue()[fieldName]);
                this.tableValidateOtherColumns(formName, fieldName, instances);
            }
        });

        return values;
    };

    tableValidateOtherColumns = (formName, fieldName, instances) => {
        if (this.validationInProgress.get(formName)) {
            return;
        }

        this.validationInProgress.set(formName, true);

        try {
            instances.forEach((instance, instanceName) => {
                if (instanceName?.startsWith(`${formName}-${fieldName}`)) {
                    instance.form.controls[fieldName].markAsTouched();
                    instance.form.controls[fieldName].updateValueAndValidity();
                }
            });
        } finally {
            this.validationInProgress.set(formName, false);
        }
    };

    tableCreateRow = (event, config: I_FieldConfig) => {
        event.preventDefault();
        const currentValue = this.getFieldValue(config);

        this.mutate({
            update: [
                {
                    name: config.name,
                    config: { ...config, value: [...(currentValue || []), {}] },
                    isMerge: true,
                },
            ],
        });
    };

    tableUpdateRows = (
        updateData: { name: string; index: number; key: string; value: T_Any }[],
        createNewIfNotExist?: boolean,
    ) => {
        updateData.forEach(({ name, index, key, value }) => {
            const fieldConfig = this.findFieldConfigs({
                configs: this.config,
                predicate: (config) => config.name === name,
            })[0];
            const currentValue = this.getFieldValue(fieldConfig);

            if (fieldConfig) {
                const updatedData = currentValue.reduce((acc, row, rowIndex) => {
                    if (rowIndex === index) {
                        acc.push({
                            ...row,
                            [key]: value,
                        });
                    } else {
                        acc.push(row);
                    }

                    return acc;
                }, []);

                if (updatedData.length < index + 1 && createNewIfNotExist) {
                    updatedData.push({ [key]: value });
                }

                this.mutate({
                    update: [
                        {
                            name,
                            config: {
                                value: updatedData,
                            },
                            isMerge: true,
                        },
                    ],
                });
            }
        });
    };

    tableDeleteRows = (deleteData: { name: string; index: number }[]) => {
        deleteData.forEach(({ name, index }) => {
            const fieldConfig = this.findFieldConfigs({
                configs: this.config,
                predicate: (config) => config.name === name,
            })[0];
            const currentValue = this.getFieldValue(fieldConfig);

            this.mutate({
                update: [
                    {
                        name,
                        config: {
                            value: currentValue.filter((_, rowIndex) => rowIndex !== index),
                        },
                        isMerge: true,
                    },
                ],
            });
        });
    };

    setFieldError = (fieldName: string, error: string) =>
        this.form.get(fieldName)?.setErrors({ validate: this.translateService.instant(error) });

    private getFormElement = (): Element | null => {
        return document.querySelector(`app-form[name="${this.name}"]`);
    };

    private focusInvalidField = (): void => {
        const formElement = this.getFormElement();

        if (formElement) {
            const firstInvalidField = formElement.querySelector('form.ng-invalid .ng-invalid');

            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth' });
                (firstInvalidField as HTMLElement).focus();
            }
        }
    };

    private validateForm = (form: FormGroup) => {
        Object.keys(form.controls).forEach((childField) => {
            const field = form.get(childField);

            if (field instanceof FormControl) {
                field.markAsTouched({ onlySelf: true });
            } else if (field instanceof FormGroup) {
                this.validateForm(field);
            }
        });
    };

    submit = (onSubmit: (values: D) => void, saveName?: string) => {
        const submitValues = this.form.getRawValue();

        if (saveName) {
            this.localStorageService.set(saveName, submitValues);
        }

        if (this.form.valid) {
            onSubmit(submitValues);
        } else {
            this.validateForm(this.form);
            this.focusInvalidField();
        }
    };
}
