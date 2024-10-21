import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { DateFnsModule } from '@angular/material-date-fns-adapter';
import { MatDatepicker } from '@angular/material/datepicker';

import { T_Any } from './common';
import { I_FormTableConfig } from './table';

export enum E_ContainerType {
    DIV = 'div',
    FIELDSET = 'fieldset',
}

export enum E_InputType {
    TEXT = 'text',
    PASSWORD = 'password',
    EMAIL = 'email',
    NUMBER = 'number',
    TEL = 'tel',
    URL = 'url',
    AUTOCOMPLETE = 'autocomplete',
    CHIP = 'chip',
}

export enum E_FieldType {
    CONTAINER = 'container',
    TEXT = 'text',
    DYNAMIC = 'dynamic',
    INPUT = 'input',
    TEXTAREA = 'textarea',
    SELECT = 'select',
    CHECKBOX = 'checkbox',
    RADIO = 'radio',
    RATING = 'rating',
    UPLOAD = 'upload',
    TEXT_EDITOR = 'text-editor',
    DATEPICKER = 'datepicker',
    DATERANGEPICKER = 'daterangepicker',
    TABLE = 'table',
    BUTTON = 'button',
}

export interface I_SelectOption {
    label?: string;
    value: string | number | boolean;
    [key: string]: T_Any;
}

export interface I_AutoCompleteOption {
    label: string;
    value: string;
    [key: string]: T_Any;
}

export enum E_FieldAppearance {
    FILL = 'fill',
    OUTLINE = 'outline',
}

export type T_FieldCustomValidator = (value: T_Any, form: FormGroup, config: I_FieldConfig) => boolean;

export interface I_FieldValidate {
    rule: ValidatorFn | T_FieldCustomValidator;
    message: string;
}

export interface I_FieldConfig {
    //common
    index?: number;
    name?: string;
    label?: string;
    labelClass?: string;
    fieldType?: E_FieldType;
    appearance?: E_FieldAppearance;
    children?: I_FieldConfig[];
    containerType?: E_ContainerType;
    wrapperClass?: string;
    class?: string;
    disabled?: boolean;
    loadingName?: string;
    placeholder?: string;
    prefix?: {
        class?: string;
        text?: string;
        icon?: string;
        onClick?: (event?: MouseEvent) => void;
    };
    suffix?: {
        class?: string;
        text?: string;
        icon?: string;
        onClick?: (event?: MouseEvent) => void;
    };
    validate?: I_FieldValidate[];
    value?: T_Any;
    //dynamic
    rowClass?: string;
    createButton?: {
        text?: string;
    };
    //file upload
    uploadType?: 'single' | 'multiple';
    accept?: string;
    showPreview?: boolean;
    showDownload?: boolean;
    //select + autocomplete
    multiple?: boolean;
    options?: I_SelectOption[];
    getOptions?: (value?) => Promise<T_Any[]>;
    mapOption?: (list) => I_SelectOption;
    translateOptions?: boolean;
    listenChangeFrom?: string;
    //input
    inputType?: E_InputType;
    maxLength?: number;
    _showPassword?: boolean;
    onBlur?: (event?: T_Any) => void;
    //textarea
    rows?: number;
    //checkbox + radio
    onChange?: (event: T_Any, form: FormGroup, config: I_FieldConfig) => void;
    //table
    table?: I_FormTableConfig<T_Any>;
    //datepicker
    min?: string | ((form: FormGroup) => string);
    max?: string | ((form: FormGroup) => string);
    startView?: 'month' | 'year' | 'multi-year';
    panelClass?: string;
    monthSelected?: (
        value: Date,
        datepicker: MatDatepicker<DateFnsModule>,
        field: AbstractControl,
        form: FormGroup,
        config: I_FieldConfig,
    ) => void;
    yearSelected?: (
        value: Date,
        datepicker: MatDatepicker<DateFnsModule>,
        field: AbstractControl,
        form: FormGroup,
        config: I_FieldConfig,
    ) => void;
    //button
    icon?: string;
    onClick?: (event?: MouseEvent) => void;
    color?: string;
}
