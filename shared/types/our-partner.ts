export interface I_OurPartner {
    id?: string;
    title?: string;
    image?: string;
    validFrom?: string;
    validTo?: string;
    status?: boolean;
    logo?: string;
    link?: string;
    description?: string;
}

export interface I_OurPartnerForm {
    title?: string;
    description?: string;
    validFrom?: string;
    validTo?: string;
    status?: boolean;
    link?: string;
    logo?: string;
    image?: string;
}
