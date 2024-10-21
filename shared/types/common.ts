import { I_NormalizeExtra } from './table';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type T_Any = any;

export type T_NormalizableGraphQLData<Q, D, M = Q> = Q | M | D;

export enum E_LoadingType {
    GLOBAL = 'GLOBAL',
    LOCAL = 'LOCAL',
}

export enum E_Form_Mode {
    READ = 'READ',
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
}

export interface T_ModalConfig {
    modal: {
        width?: string;
        minWidth?: string | number;
        maxWidth?: string | number;
        height?: string;
        minHeight?: string | number;
        maxHeight?: string | number;
        title: string;
        content: T_Any;
        footer: {
            onSubmit: (value: T_Any) => void;
        };
    };
    data?: T_Any;
}

export interface I_GraphQLOptions<Q, D, M = Q> {
    loading?: E_LoadingType;
    normalize?: (data: Q | M) => D;
    toast?: boolean;
    graphql?: T_Any;
    extra?: I_NormalizeExtra;
}

export interface I_NavItem {
    name?: string;
    children?: I_NavItem[];
    href?: string;
    icon?: string;
}

export interface I_Translation {
    id?: string;
    languageCode?: string;
    name?: string;
}
