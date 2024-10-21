export interface I_Error {
    code: string;
    message: string;
    field: string;
}

export interface I_MutationResponse {
    status?: string;
    error?: I_Error;
    errors?: I_Error[];
}
