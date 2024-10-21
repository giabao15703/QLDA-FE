export interface I_Sicp {
    id: string;
    sanctionCheck?: string;
    isConfirmed: number;
    isReviewed: number;
    createdDate?: Date;
    sicpFiles: {
        edges: {
            node?: {
                id;
                fileName;
                sicpType;
            };
        }[];
    };
    supplier?: {
        id: string;
        companyFullName?: string;
        email?: string;
        username?: string;
        sicpRegistration?: {
            id: string;
            name: string;
        };
    };
}

export interface I_SicpTextEditorFiles {
    id?: string;
    fileName?: string;
    fileVersion?: number;
}

export interface I_SicpTextEditor {
    id?: string;
    textEditerEn?: string;
    textEditerVi?: string;
    sicpType?: number;
    sicpTextEditorFiles: {
        edges?: {
            node?: I_SicpTextEditorFiles;
        }[];
    };
}
