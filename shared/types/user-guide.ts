import { I_ProfileFeaturesBuyer } from './account';
import { I_ProfileFeaturesSupplier } from './sale-scheme';

export interface I_Module {
    id?: string;
    name?: string;
    status?: boolean;
    role?: string;
}

export interface I_ModuleForm {
    name?: string;
    status?: boolean;
}

export interface I_Course {
    id?: string;
    name?: string;
    video?: string;
    modules: I_Module;
    status?: boolean;
    role?: string;
    coursesprofilefeaturesbuyerSet?: {
        edges?: {
            node?: { profileFeatures: I_ProfileFeaturesBuyer };
        }[];
    };
    coursesprofilefeaturessupplierSet?: {
        edges?: {
            node?: { profileFeatures: I_ProfileFeaturesSupplier };
        }[];
    };
}

export interface I_CourseForm {
    modules?: string;
    name?: string;
    profileLevel?: string[];
    profileLevelType?: string;
    role?: string;
    status?: boolean;
    video?: string;
}
