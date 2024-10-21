import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    CreateBuyerClubVoucherGQL,
    CreateBuyerClubVoucherMutation,
    CreateBuyerClubVoucherMutationVariables,
    CreateCategoryGQL,
    CreateCategoryMutation,
    CreateCategoryMutationVariables,
    CreateCityGQL,
    CreateCityMutation,
    CreateCityMutationVariables,
    CreateClusterCodeGQL,
    CreateClusterCodeMutation,
    CreateClusterCodeMutationVariables,
    CreateCountryGQL,
    CreateCountryMutation,
    CreateCountryMutationVariables,
    CreateCurrencyGQL,
    CreateCurrencyMutation,
    CreateCurrencyMutationVariables,
    CreateDeliveryTermGQL,
    CreateDeliveryTermMutation,
    CreateDeliveryTermMutationVariables,
    CreateEmailTemplatesGQL,
    CreateEmailTemplatesMutation,
    CreateEmailTemplatesMutationVariables,
    CreateFamilyCodeGQL,
    CreateFamilyCodeMutation,
    CreateFamilyCodeMutationVariables,
    CreateGenderGQL,
    CreateGenderMutation,
    CreateGenderMutationVariables,
    CreateIndustryClusterGQL,
    CreateIndustryClusterMutation,
    CreateIndustryClusterMutationVariables,
    CreateIndustryGQL,
    CreateIndustryMutation,
    CreateIndustryMutationVariables,
    CreateIndustrySectorsGQL,
    CreateIndustrySectorsMutation,
    CreateIndustrySectorsMutationVariables,
    CreateIndustrySubSectorsGQL,
    CreateIndustrySubSectorsMutation,
    CreateIndustrySubSectorsMutationVariables,
    CreateLanguageGQL,
    CreateLanguageMutation,
    CreateLanguageMutationVariables,
    CreateNumberOfEmployeeGQL,
    CreateNumberOfEmployeeMutation,
    CreateNumberOfEmployeeMutationVariables,
    CreatePaymentTermGQL,
    CreatePaymentTermMutation,
    CreatePaymentTermMutationVariables,
    CreatePositionGQL,
    CreatePositionMutation,
    CreatePositionMutationVariables,
    CreatePromotionGQL,
    CreatePromotionMutation,
    CreatePromotionMutationVariables,
    CreateReasonGQL,
    CreateReasonMutation,
    CreateReasonMutationVariables,
    CreateSetProductAdvertisementGQL,
    CreateSetProductAdvertisementMutation,
    CreateSetProductAdvertisementMutationVariables,
    CreateSubClusterCodeGQL,
    CreateSubClusterCodeMutation,
    CreateSubClusterCodeMutationVariables,
    CreateUnitOfMeasureGQL,
    CreateUnitOfMeasureMutation,
    CreateUnitOfMeasureMutationVariables,
    CreateVoucherGQL,
    CreateVoucherMutation,
    CreateVoucherMutationVariables,
    CreateWarrantyTermGQL,
    CreateWarrantyTermMutation,
    CreateWarrantyTermMutationVariables,
    GetBuyerClubVoucherGQL,
    GetBuyerClubVoucherQuery,
    GetBuyerClubVoucherQueryVariables,
    GetBuyerClubVouchersGQL,
    GetBuyerClubVouchersQuery,
    GetBuyerClubVouchersQueryVariables,
    GetCategoriesGQL,
    GetCategoriesQuery,
    GetCategoriesQueryVariables,
    GetCategoriesWithSubClusterCodeGQL,
    GetCategoriesWithSubClusterCodeQuery,
    GetCategoriesWithSubClusterCodeQueryVariables,
    GetCategoryGQL,
    GetCategoryQuery,
    GetCategoryQueryVariables,
    GetCategoryWithSubClusterCodeGQL,
    GetCategoryWithSubClusterCodeQuery,
    GetCategoryWithSubClusterCodeQueryVariables,
    GetCitiesGQL,
    GetCitiesQuery,
    GetCitiesQueryVariables,
    GetCityGQL,
    GetCityQuery,
    GetCityQueryVariables,
    GetClusterCodeGQL,
    GetClusterCodeQuery,
    GetClusterCodeQueryVariables,
    GetClusterCodeWithFamilyCodeGQL,
    GetClusterCodeWithFamilyCodeQuery,
    GetClusterCodeWithFamilyCodeQueryVariables,
    GetClusterCodeWithSubClusterCodeGQL,
    GetClusterCodeWithSubClusterCodeQuery,
    GetClusterCodeWithSubClusterCodeQueryVariables,
    GetClusterCodesGQL,
    GetClusterCodesQuery,
    GetClusterCodesQueryVariables,
    GetClusterCodesWithFamilyCodeGQL,
    GetClusterCodesWithFamilyCodeQuery,
    GetClusterCodesWithFamilyCodeQueryVariables,
    GetCountriesGQL,
    GetCountriesQuery,
    GetCountriesQueryVariables,
    GetCountryGQL,
    GetCountryQuery,
    GetCountryQueryVariables,
    GetCurrenciesGQL,
    GetCurrenciesQuery,
    GetCurrenciesQueryVariables,
    GetCurrencyGQL,
    GetCurrencyQuery,
    GetCurrencyQueryVariables,
    GetDeliveryTermGQL,
    GetDeliveryTermQuery,
    GetDeliveryTermQueryVariables,
    GetDeliveryTermsGQL,
    GetDeliveryTermsQuery,
    GetDeliveryTermsQueryVariables,
    GetEmailTemplateGQL,
    GetEmailTemplateQuery,
    GetEmailTemplateQueryVariables,
    GetEmailTemplatesGQL,
    GetEmailTemplatesQuery,
    GetEmailTemplatesQueryVariables,
    GetFamilyCodeGQL,
    GetFamilyCodeQuery,
    GetFamilyCodeQueryVariables,
    GetFamilyCodeWithClusterCodeGQL,
    GetFamilyCodeWithClusterCodeQuery,
    GetFamilyCodeWithClusterCodeQueryVariables,
    GetFamilyCodesGQL,
    GetFamilyCodesQuery,
    GetFamilyCodesQueryVariables,
    GetFamilyCodesWithClusterCodeGQL,
    GetFamilyCodesWithClusterCodeQuery,
    GetFamilyCodesWithClusterCodeQueryVariables,
    GetGenderGQL,
    GetGenderQuery,
    GetGenderQueryVariables,
    GetGendersGQL,
    GetGendersQuery,
    GetGendersQueryVariables,
    GetIndustriesGQL,
    GetIndustriesQuery,
    GetIndustriesQueryVariables,
    GetIndustryClusterGQL,
    GetIndustryClusterQuery,
    GetIndustryClusterQueryVariables,
    GetIndustryClusterWithIndustryGQL,
    GetIndustryClusterWithIndustryQuery,
    GetIndustryClusterWithIndustryQueryVariables,
    GetIndustryClusterWithIndustrySectorsGQL,
    GetIndustryClusterWithIndustrySectorsQuery,
    GetIndustryClusterWithIndustrySectorsQueryVariables,
    GetIndustryClustersGQL,
    GetIndustryClustersQuery,
    GetIndustryClustersQueryVariables,
    GetIndustryClustersWithIndustryGQL,
    GetIndustryClustersWithIndustryQuery,
    GetIndustryClustersWithIndustryQueryVariables,
    GetIndustryGQL,
    GetIndustryQuery,
    GetIndustryQueryVariables,
    GetIndustrySectorGQL,
    GetIndustrySectorQuery,
    GetIndustrySectorQueryVariables,
    GetIndustrySectorWithIndustryClusterGQL,
    GetIndustrySectorWithIndustryClusterQuery,
    GetIndustrySectorWithIndustryClusterQueryVariables,
    GetIndustrySectorWithIndustrySubSectorsGQL,
    GetIndustrySectorWithIndustrySubSectorsQuery,
    GetIndustrySectorWithIndustrySubSectorsQueryVariables,
    GetIndustrySectorsGQL,
    GetIndustrySectorsQuery,
    GetIndustrySectorsQueryVariables,
    GetIndustrySectorsWithIndustryClusterGQL,
    GetIndustrySectorsWithIndustryClusterQuery,
    GetIndustrySectorsWithIndustryClusterQueryVariables,
    GetIndustrySubSectorGQL,
    GetIndustrySubSectorQuery,
    GetIndustrySubSectorQueryVariables,
    GetIndustrySubSectorWithIndustrySectorsGQL,
    GetIndustrySubSectorWithIndustrySectorsQuery,
    GetIndustrySubSectorWithIndustrySectorsQueryVariables,
    GetIndustrySubSectorsGQL,
    GetIndustrySubSectorsQuery,
    GetIndustrySubSectorsQueryVariables,
    GetIndustrySubSectorsWithIndustrySectorsGQL,
    GetIndustrySubSectorsWithIndustrySectorsQuery,
    GetIndustrySubSectorsWithIndustrySectorsQueryVariables,
    GetIndustryWithIndustryClusterGQL,
    GetIndustryWithIndustryClusterQuery,
    GetIndustryWithIndustryClusterQueryVariables,
    GetLanguageGQL,
    GetLanguageQuery,
    GetLanguageQueryVariables,
    GetLanguagesGQL,
    GetLanguagesQuery,
    GetLanguagesQueryVariables,
    GetNumberOfEmployeeGQL,
    GetNumberOfEmployeeQuery,
    GetNumberOfEmployeeQueryVariables,
    GetNumberOfEmployeesGQL,
    GetNumberOfEmployeesQuery,
    GetNumberOfEmployeesQueryVariables,
    GetPaymentTermGQL,
    GetPaymentTermQuery,
    GetPaymentTermQueryVariables,
    GetPaymentTermsGQL,
    GetPaymentTermsQuery,
    GetPaymentTermsQueryVariables,
    GetPositionGQL,
    GetPositionQuery,
    GetPositionQueryVariables,
    GetPositionsGQL,
    GetPositionsQuery,
    GetPositionsQueryVariables,
    GetPromotionGQL,
    GetPromotionHistoriesGQL,
    GetPromotionHistoriesQuery,
    GetPromotionHistoriesQueryVariables,
    GetPromotionHistoryGQL,
    GetPromotionHistoryQuery,
    GetPromotionHistoryQueryVariables,
    GetPromotionQuery,
    GetPromotionQueryVariables,
    GetPromotionResultsGQL,
    GetPromotionResultsQuery,
    GetPromotionResultsQueryVariables,
    GetPromotionsGQL,
    GetPromotionsQuery,
    GetPromotionsQueryVariables,
    GetReasonGQL,
    GetReasonQuery,
    GetReasonQueryVariables,
    GetReasonsGQL,
    GetReasonsQuery,
    GetReasonsQueryVariables,
    GetSetProductAdvertisementGQL,
    GetSetProductAdvertisementQuery,
    GetSetProductAdvertisementQueryVariables,
    GetSetProductAdvertisementsGQL,
    GetSetProductAdvertisementsQuery,
    GetSetProductAdvertisementsQueryVariables,
    GetSubClusterCodeGQL,
    GetSubClusterCodeQuery,
    GetSubClusterCodeQueryVariables,
    GetSubClusterCodeWithCategoryGQL,
    GetSubClusterCodeWithCategoryQuery,
    GetSubClusterCodeWithCategoryQueryVariables,
    GetSubClusterCodeWithClusterCodeGQL,
    GetSubClusterCodeWithClusterCodeQuery,
    GetSubClusterCodeWithClusterCodeQueryVariables,
    GetSubClusterCodesGQL,
    GetSubClusterCodesQuery,
    GetSubClusterCodesQueryVariables,
    GetSubClusterCodesWithClusterCodeGQL,
    GetSubClusterCodesWithClusterCodeQuery,
    GetSubClusterCodesWithClusterCodeQueryVariables,
    GetUnitOfMeasureGQL,
    GetUnitOfMeasureQuery,
    GetUnitOfMeasureQueryVariables,
    GetUnitOfMeasuresGQL,
    GetUnitOfMeasuresQuery,
    GetUnitOfMeasuresQueryVariables,
    GetVoucherGQL,
    GetVoucherQuery,
    GetVoucherQueryVariables,
    GetVouchersGQL,
    GetVouchersQuery,
    GetVouchersQueryVariables,
    GetWarrantyTermGQL,
    GetWarrantyTermQuery,
    GetWarrantyTermQueryVariables,
    GetWarrantyTermsGQL,
    GetWarrantyTermsQuery,
    GetWarrantyTermsQueryVariables,
    UpdateBuyerClubVoucherGQL,
    UpdateBuyerClubVoucherMutation,
    UpdateBuyerClubVoucherMutationVariables,
    UpdateBuyerClubVoucherStatusGQL,
    UpdateBuyerClubVoucherStatusMutation,
    UpdateBuyerClubVoucherStatusMutationVariables,
    UpdateCategoryGQL,
    UpdateCategoryMutation,
    UpdateCategoryMutationVariables,
    UpdateCategoryStatusGQL,
    UpdateCategoryStatusMutation,
    UpdateCategoryStatusMutationVariables,
    UpdateCityGQL,
    UpdateCityMutation,
    UpdateCityMutationVariables,
    UpdateCityStatusGQL,
    UpdateCityStatusMutation,
    UpdateCityStatusMutationVariables,
    UpdateClusterCodeGQL,
    UpdateClusterCodeMutation,
    UpdateClusterCodeMutationVariables,
    UpdateClusterCodeStatusGQL,
    UpdateClusterCodeStatusMutation,
    UpdateClusterCodeStatusMutationVariables,
    UpdateCountryGQL,
    UpdateCountryMutation,
    UpdateCountryMutationVariables,
    UpdateCountryStatusGQL,
    UpdateCountryStatusMutation,
    UpdateCountryStatusMutationVariables,
    UpdateCurrencyGQL,
    UpdateCurrencyMutation,
    UpdateCurrencyMutationVariables,
    UpdateCurrencyStatusGQL,
    UpdateCurrencyStatusMutation,
    UpdateCurrencyStatusMutationVariables,
    UpdateDeliveryTermGQL,
    UpdateDeliveryTermMutation,
    UpdateDeliveryTermMutationVariables,
    UpdateDeliveryTermStatusGQL,
    UpdateDeliveryTermStatusMutation,
    UpdateDeliveryTermStatusMutationVariables,
    UpdateEmailTemplatesGQL,
    UpdateEmailTemplatesMutation,
    UpdateEmailTemplatesMutationVariables,
    UpdateEmailTemplatesStatusGQL,
    UpdateEmailTemplatesStatusMutation,
    UpdateEmailTemplatesStatusMutationVariables,
    UpdateFamilyCodeGQL,
    UpdateFamilyCodeMutation,
    UpdateFamilyCodeMutationVariables,
    UpdateFamilyCodeStatusGQL,
    UpdateFamilyCodeStatusMutation,
    UpdateFamilyCodeStatusMutationVariables,
    UpdateGenderGQL,
    UpdateGenderMutation,
    UpdateGenderMutationVariables,
    UpdateGenderStatusGQL,
    UpdateGenderStatusMutation,
    UpdateGenderStatusMutationVariables,
    UpdateIndustryClusterGQL,
    UpdateIndustryClusterMutation,
    UpdateIndustryClusterMutationVariables,
    UpdateIndustryClusterStatusGQL,
    UpdateIndustryClusterStatusMutation,
    UpdateIndustryClusterStatusMutationVariables,
    UpdateIndustryGQL,
    UpdateIndustryMutation,
    UpdateIndustryMutationVariables,
    UpdateIndustrySectorsGQL,
    UpdateIndustrySectorsMutation,
    UpdateIndustrySectorsMutationVariables,
    UpdateIndustrySectorsStatusGQL,
    UpdateIndustrySectorsStatusMutation,
    UpdateIndustrySectorsStatusMutationVariables,
    UpdateIndustryStatusGQL,
    UpdateIndustryStatusMutation,
    UpdateIndustryStatusMutationVariables,
    UpdateIndustrySubSectorsGQL,
    UpdateIndustrySubSectorsMutation,
    UpdateIndustrySubSectorsMutationVariables,
    UpdateIndustrySubSectorsStatusGQL,
    UpdateIndustrySubSectorsStatusMutation,
    UpdateIndustrySubSectorsStatusMutationVariables,
    UpdateLanguageGQL,
    UpdateLanguageMutation,
    UpdateLanguageMutationVariables,
    UpdateLanguageStatusGQL,
    UpdateLanguageStatusMutation,
    UpdateLanguageStatusMutationVariables,
    UpdateNumberOfEmployeeGQL,
    UpdateNumberOfEmployeeMutation,
    UpdateNumberOfEmployeeMutationVariables,
    UpdateNumberOfEmployeeStatusGQL,
    UpdateNumberOfEmployeeStatusMutation,
    UpdateNumberOfEmployeeStatusMutationVariables,
    UpdatePaymentTermGQL,
    UpdatePaymentTermMutation,
    UpdatePaymentTermMutationVariables,
    UpdatePaymentTermStatusGQL,
    UpdatePaymentTermStatusMutation,
    UpdatePaymentTermStatusMutationVariables,
    UpdatePositionGQL,
    UpdatePositionMutation,
    UpdatePositionMutationVariables,
    UpdatePositionStatusGQL,
    UpdatePositionStatusMutation,
    UpdatePositionStatusMutationVariables,
    UpdatePromotionGQL,
    UpdatePromotionMutation,
    UpdatePromotionMutationVariables,
    UpdatePromotionStatusGQL,
    UpdatePromotionStatusMutation,
    UpdatePromotionStatusMutationVariables,
    UpdateReasonGQL,
    UpdateReasonMutation,
    UpdateReasonMutationVariables,
    UpdateReasonStatusGQL,
    UpdateReasonStatusMutation,
    UpdateReasonStatusMutationVariables,
    UpdateSetProductAdvertisementGQL,
    UpdateSetProductAdvertisementMutation,
    UpdateSetProductAdvertisementMutationVariables,
    UpdateSetProductAdvertisementStatusGQL,
    UpdateSetProductAdvertisementStatusMutation,
    UpdateSetProductAdvertisementStatusMutationVariables,
    UpdateSubClusterCodeGQL,
    UpdateSubClusterCodeMutation,
    UpdateSubClusterCodeMutationVariables,
    UpdateSubClusterCodeStatusGQL,
    UpdateSubClusterCodeStatusMutation,
    UpdateSubClusterCodeStatusMutationVariables,
    UpdateUnitOfMeasureGQL,
    UpdateUnitOfMeasureMutation,
    UpdateUnitOfMeasureMutationVariables,
    UpdateUnitOfMeasureStatusGQL,
    UpdateUnitOfMeasureStatusMutation,
    UpdateUnitOfMeasureStatusMutationVariables,
    UpdateVoucherGQL,
    UpdateVoucherMutation,
    UpdateVoucherMutationVariables,
    UpdateVoucherStatusGQL,
    UpdateVoucherStatusMutation,
    UpdateVoucherStatusMutationVariables,
    UpdateWarrantyTermGQL,
    UpdateWarrantyTermMutation,
    UpdateWarrantyTermMutationVariables,
    UpdateWarrantyTermStatusGQL,
    UpdateWarrantyTermStatusMutation,
    UpdateWarrantyTermStatusMutationVariables,
} from '#shared/graphql/types';
import { GraphqlService } from '#shared/services';
import {
    I_BuyerClubVoucher,
    I_Category,
    I_City,
    I_ClusterCode,
    I_Country,
    I_Currency,
    I_DeliveryTerm,
    I_EmailTemplate,
    I_FamilyCode,
    I_Gender,
    I_GraphQLOptions,
    I_Industry,
    I_IndustryCluster,
    I_IndustrySector,
    I_IndustrySubSector,
    I_Language,
    I_MutationResponse,
    I_NormalizeExtra,
    I_NumberOfEmployee,
    I_PaymentTerm,
    I_Position,
    I_Promotion,
    I_PromotionHistory,
    I_Reason,
    I_SetProductAdvertisement,
    I_SubClusterCode,
    I_TableState,
    I_UnitOfMeasure,
    I_Voucher,
    I_WarrantyTerm,
} from '#shared/types';
import { normalizeWithPagination } from '#shared/utils';

@Injectable({
    providedIn: 'root',
})
export class MasterDataService {
    createDeliveryResponsible(arg0: {
        input: {
            transporterCode: import('#shared/types').I_Transporter;
            cityCode: I_City;
            effectiveDate: string;
            status: boolean;
        };
    }): { deliveryResponsibleCreate: any } | PromiseLike<{ deliveryResponsibleCreate: any }> {
        throw new Error('Method not implemented.');
    }
    constructor(
        private graphqlService: GraphqlService,

        private getCountryGQL: GetCountryGQL,
        private getCountriesGQL: GetCountriesGQL,
        private createCountryGQL: CreateCountryGQL,
        private updateCountryGQL: UpdateCountryGQL,
        private updateCountryStatusGQL: UpdateCountryStatusGQL,

        private getCityGQL: GetCityGQL,
        private getCitiesGQL: GetCitiesGQL,
        private createCityGQL: CreateCityGQL,
        private updateCityStatusGQL: UpdateCityStatusGQL,
        private updateCityGQL: UpdateCityGQL,

        private getCurrencyGQL: GetCurrencyGQL,
        private getCurrenciesGQL: GetCurrenciesGQL,
        private createCurrencyGQL: CreateCurrencyGQL,
        private updateCurrencyGQL: UpdateCurrencyGQL,
        private updateCurrencyStatusGQL: UpdateCurrencyStatusGQL,

        private getDeliveryTermGQL: GetDeliveryTermGQL,
        private getDeliveryTermsGQL: GetDeliveryTermsGQL,
        private createDeliveryTermGQL: CreateDeliveryTermGQL,
        private updateDeliveryTermGQL: UpdateDeliveryTermGQL,
        private updateDeliveryTermStatusGQL: UpdateDeliveryTermStatusGQL,

        private getPaymentTermGQL: GetPaymentTermGQL,
        private getPaymentTermsGQL: GetPaymentTermsGQL,
        private createPaymentTermGQL: CreatePaymentTermGQL,
        private updatePaymentTermGQL: UpdatePaymentTermGQL,
        private updatePaymentTermStatusGQL: UpdatePaymentTermStatusGQL,

        private getReasonGQL: GetReasonGQL,
        private getReasonsGQL: GetReasonsGQL,
        private createReasonGQL: CreateReasonGQL,
        private updateReasonGQL: UpdateReasonGQL,
        private updateReasonStatusGQL: UpdateReasonStatusGQL,

        private getGenderGQL: GetGenderGQL,
        private getGendersGQL: GetGendersGQL,
        private createGenderGQL: CreateGenderGQL,
        private updateGenderGQL: UpdateGenderGQL,
        private updateGenderStatusGQL: UpdateGenderStatusGQL,

        private getPositionGQL: GetPositionGQL,
        private getPositionsGQL: GetPositionsGQL,
        private createPositionGQL: CreatePositionGQL,
        private updatePositionGQL: UpdatePositionGQL,
        private updatePositionStatusGQL: UpdatePositionStatusGQL,

        private getLanguageGQL: GetLanguageGQL,
        private getLanguagesGQL: GetLanguagesGQL,
        private createLanguageGQL: CreateLanguageGQL,
        private updateLanguageGQL: UpdateLanguageGQL,
        private updateLanguageStatusGQL: UpdateLanguageStatusGQL,

        private getNumberOfEmployeeGQL: GetNumberOfEmployeeGQL,
        private getNumberOfEmployeesGQL: GetNumberOfEmployeesGQL,
        private createNumberOfEmployeeGQL: CreateNumberOfEmployeeGQL,
        private updateNumberOfEmployeeGQL: UpdateNumberOfEmployeeGQL,
        private updateNumberOfEmployeeStatusGQL: UpdateNumberOfEmployeeStatusGQL,

        private getIndustryGQL: GetIndustryGQL,
        private getIndustryWithIndustryClusterGQL: GetIndustryWithIndustryClusterGQL,
        private getIndustriesGQL: GetIndustriesGQL,
        private createIndustryGQL: CreateIndustryGQL,
        private updateIndustryGQL: UpdateIndustryGQL,
        private updateIndustryStatusGQL: UpdateIndustryStatusGQL,

        private getIndustryClusterGQL: GetIndustryClusterGQL,
        private getIndustryClusterWithIndustryGQL: GetIndustryClusterWithIndustryGQL,
        private getIndustryClusterWithIndustrySectorsGQL: GetIndustryClusterWithIndustrySectorsGQL,
        private getIndustryClustersGQL: GetIndustryClustersGQL,
        private getIndustryClustersWithIndustryGQL: GetIndustryClustersWithIndustryGQL,
        private createIndustryClusterGQL: CreateIndustryClusterGQL,
        private updateIndustryClusterGQL: UpdateIndustryClusterGQL,
        private updateIndustryClusterStatusGQL: UpdateIndustryClusterStatusGQL,

        private getIndustrySectorGQL: GetIndustrySectorGQL,
        private getIndustrySectorWithIndustryClusterGQL: GetIndustrySectorWithIndustryClusterGQL,
        private getIndustrySectorWithIndustrySubSectorsGQL: GetIndustrySectorWithIndustrySubSectorsGQL,
        private getIndustrySectorsGQL: GetIndustrySectorsGQL,
        private getIndustrySectorsWithIndustryClusterGQL: GetIndustrySectorsWithIndustryClusterGQL,
        private createIndustrySectorsGQL: CreateIndustrySectorsGQL,
        private updateIndustrySectorsGQL: UpdateIndustrySectorsGQL,
        private updateIndustrySectorsStatusGQL: UpdateIndustrySectorsStatusGQL,

        private getIndustrySubSectorGQL: GetIndustrySubSectorGQL,
        private getIndustrySubSectorWithIndustrySectorsGQL: GetIndustrySubSectorWithIndustrySectorsGQL,
        private getIndustrySubSectorsGQL: GetIndustrySubSectorsGQL,
        private getIndustrySubSectorsWithIndustrySectorsGQL: GetIndustrySubSectorsWithIndustrySectorsGQL,
        private createIndustrySubSectorsGQL: CreateIndustrySubSectorsGQL,
        private updateIndustrySubSectorsGQL: UpdateIndustrySubSectorsGQL,
        private updateIndustrySubSectorsStatusGQL: UpdateIndustrySubSectorsStatusGQL,

        private getUnitOfMeasureGQL: GetUnitOfMeasureGQL,
        private getUnitOfMeasuresGQL: GetUnitOfMeasuresGQL,
        private createUnitOfMeasureGQL: CreateUnitOfMeasureGQL,
        private updateUnitOfMeasureGQL: UpdateUnitOfMeasureGQL,
        private updateUnitOfMeasureStatusGQL: UpdateUnitOfMeasureStatusGQL,

        private getFamilyCodeGQL: GetFamilyCodeGQL,
        private getFamilyCodeWithClusterCodeGQL: GetFamilyCodeWithClusterCodeGQL,
        private getFamilyCodesGQL: GetFamilyCodesGQL,
        private getFamilyCodesWithClusterCodeGQL: GetFamilyCodesWithClusterCodeGQL,
        private createFamilyCodeGQL: CreateFamilyCodeGQL,
        private updateFamilyCodeGQL: UpdateFamilyCodeGQL,
        private updateFamilyCodeStatusGQL: UpdateFamilyCodeStatusGQL,

        private getClusterCodeGQL: GetClusterCodeGQL,
        private getClusterCodeWithFamilyCodeGQL: GetClusterCodeWithFamilyCodeGQL,
        private getClusterCodeWithSubClusterCodeGQL: GetClusterCodeWithSubClusterCodeGQL,
        private getClusterCodesGQL: GetClusterCodesGQL,
        private getClusterCodesWithFamilyCodeGQL: GetClusterCodesWithFamilyCodeGQL,
        private createClusterCodeGQL: CreateClusterCodeGQL,
        private updateClusterCodeGQL: UpdateClusterCodeGQL,
        private updateClusterCodeStatusGQL: UpdateClusterCodeStatusGQL,

        private getSubClusterCodeGQL: GetSubClusterCodeGQL,
        private getSubClusterCodeWithClusterCodeGQL: GetSubClusterCodeWithClusterCodeGQL,
        private getSubClusterCodeWithCategoryGQL: GetSubClusterCodeWithCategoryGQL,
        private getSubClusterCodesGQL: GetSubClusterCodesGQL,
        private getSubClusterCodesWithClusterCodeGQL: GetSubClusterCodesWithClusterCodeGQL,
        private createSubClusterCodeGQL: CreateSubClusterCodeGQL,
        private updateSubClusterCodeGQL: UpdateSubClusterCodeGQL,
        private updateSubClusterCodeStatusGQL: UpdateSubClusterCodeStatusGQL,

        private getCategoryGQL: GetCategoryGQL,
        private getCategoryWithSubClusterCodeGQL: GetCategoryWithSubClusterCodeGQL,
        private getCategoriesGQL: GetCategoriesGQL,
        private getCategoriesWithSubClusterCodeGQL: GetCategoriesWithSubClusterCodeGQL,
        private createCategoryGQL: CreateCategoryGQL,
        private updateCategoryGQL: UpdateCategoryGQL,
        private updateCategoryStatusGQL: UpdateCategoryStatusGQL,

        private getEmailTemplateGQL: GetEmailTemplateGQL,
        private getEmailTemplatesGQL: GetEmailTemplatesGQL,
        private createEmailTemplatesGQL: CreateEmailTemplatesGQL,
        private updateEmailTemplatesGQL: UpdateEmailTemplatesGQL,
        private updateEmailTemplatesStatusGQL: UpdateEmailTemplatesStatusGQL,

        private getPromotionGQL: GetPromotionGQL,
        private getPromotionsGQL: GetPromotionsGQL,
        private getPromotionResultsGQL: GetPromotionResultsGQL,
        private createPromotionGQL: CreatePromotionGQL,
        private updatePromotionGQL: UpdatePromotionGQL,
        private updatePromotionStatusGQL: UpdatePromotionStatusGQL,

        private getPromotionHistoriesGQL: GetPromotionHistoriesGQL,
        private getPromotionHistoryGQL: GetPromotionHistoryGQL,

        private getVoucherGQL: GetVoucherGQL,
        private getVouchersGQL: GetVouchersGQL,
        private createVoucherGQL: CreateVoucherGQL,
        private updateVoucherGQL: UpdateVoucherGQL,
        private updateVoucherStatusGQL: UpdateVoucherStatusGQL,

        private getWarrantyTermGQL: GetWarrantyTermGQL,
        private getWarrantyTermsGQL: GetWarrantyTermsGQL,
        private createWarrantyTermGQL: CreateWarrantyTermGQL,
        private updateWarrantyTermGQL: UpdateWarrantyTermGQL,
        private updateWarrantyTermStatusGQL: UpdateWarrantyTermStatusGQL,

        private getBuyerClubVoucherGQL: GetBuyerClubVoucherGQL,
        private getBuyerClubVouchersGQL: GetBuyerClubVouchersGQL,
        private createBuyerClubVoucherGQL: CreateBuyerClubVoucherGQL,
        private updateBuyerClubVoucherGQL: UpdateBuyerClubVoucherGQL,
        private updateBuyerClubVoucherStatusGQL: UpdateBuyerClubVoucherStatusGQL,

        private getSetProductAdvertisementGQL: GetSetProductAdvertisementGQL,
        private getSetProductAdvertisementsGQL: GetSetProductAdvertisementsGQL,
        private createSetProductAdvertisementGQL: CreateSetProductAdvertisementGQL,
        private updateSetProductAdvertisementGQL: UpdateSetProductAdvertisementGQL,
        private updateSetProductAdvertisementStatusGQL: UpdateSetProductAdvertisementStatusGQL,
    ) {}

    get error(): Observable<string> {
        return this.graphqlService.error;
    }

    // #region COUNTRY
    private normalizeCountryList = (data: GetCountriesQuery, extra?: I_NormalizeExtra): I_TableState<I_Country> => {
        return normalizeWithPagination<I_Country>(data.countries, extra);
    };

    getCountries = (
        variables?: GetCountriesQueryVariables,
        options?: I_GraphQLOptions<GetCountriesQuery, I_TableState<I_Country>>,
    ) => {
        return this.graphqlService.query<GetCountriesQuery, GetCountriesQueryVariables, I_TableState<I_Country>>(
            this.getCountriesGQL,
            variables,
            {
                normalize: (data) => this.normalizeCountryList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Country>>;
    };

    getCountry = (variables?: GetCountryQueryVariables, options?: I_GraphQLOptions<GetCountryQuery, I_Country>) => {
        return this.graphqlService.query<GetCountryQuery, GetCountryQueryVariables, I_Country>(
            this.getCountryGQL,
            variables,
            {
                normalize: (data) => data.country,
                ...options,
            },
        ) as Promise<I_Country>;
    };

    createCountry = (
        variables?: CreateCountryMutationVariables,
        options?: I_GraphQLOptions<CreateCountryMutation, { countryCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateCountryMutation,
            CreateCountryMutationVariables,
            { countryCreate: I_MutationResponse }
        >(this.createCountryGQL, variables, options);
    };

    updateCountry = (
        variables?: UpdateCountryMutationVariables,
        options?: I_GraphQLOptions<UpdateCountryMutation, { countryUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateCountryMutation,
            UpdateCountryMutationVariables,
            { countryUpdate: I_MutationResponse }
        >(this.updateCountryGQL, variables, options);
    };

    updateCountryStatus = (
        variables?: UpdateCountryStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateCountryStatusMutation, { countryUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateCountryStatusMutation,
            UpdateCountryStatusMutationVariables,
            { countryUpdateStatus: I_MutationResponse }
        >(this.updateCountryStatusGQL, variables, options);
    };
    // #endregion

    // #region CITY
    private normalizeCityList = (data: GetCitiesQuery, extra?: I_NormalizeExtra): I_TableState<I_City> => {
        return normalizeWithPagination<I_City>(data.countryStates, extra);
    };

    getCity = (variables?: GetCityQueryVariables, options?: I_GraphQLOptions<GetCityQuery, I_City>) => {
        return this.graphqlService.query<GetCityQuery, GetCityQueryVariables, I_City>(this.getCityGQL, variables, {
            normalize: (data) => data.countryState,
            ...options,
        }) as Promise<I_City>;
    };

    getCities = (
        variables?: GetCitiesQueryVariables,
        options?: I_GraphQLOptions<GetCitiesQuery, I_TableState<I_City>>,
    ) => {
        return this.graphqlService.query<GetCitiesQuery, GetCitiesQueryVariables, I_TableState<I_City>>(
            this.getCitiesGQL,
            variables,
            {
                normalize: (data) => this.normalizeCityList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_City>>;
    };

    createCity = (
        variables?: CreateCityMutationVariables,
        options?: I_GraphQLOptions<CreateCityMutation, { countryStateCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateCityMutation,
            CreateCityMutationVariables,
            { countryStateCreate: I_MutationResponse }
        >(this.createCityGQL, variables, options);
    };

    updateCity = (
        variables?: UpdateCityMutationVariables,
        options?: I_GraphQLOptions<UpdateCityMutation, { countryStateUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateCityMutation,
            UpdateCityMutationVariables,
            { countryStateUpdate: I_MutationResponse }
        >(this.updateCityGQL, variables, options);
    };

    updateCityStatus = (
        variables?: UpdateCityStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateCityStatusMutation, { countryStateUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateCityStatusMutation,
            UpdateCityStatusMutationVariables,
            { countryStateUpdateStatus: I_MutationResponse }
        >(this.updateCityStatusGQL, variables, options);
    };
    // #endregion

    // #region CURRENCY
    private normalizeCurrencyList = (data: GetCurrenciesQuery, extra?: I_NormalizeExtra): I_TableState<I_Currency> => {
        return normalizeWithPagination<I_Currency>(data.currencies, extra);
    };

    getCurrency = (variables?: GetCurrencyQueryVariables, options?: I_GraphQLOptions<GetCurrencyQuery, I_Currency>) => {
        return this.graphqlService.query<GetCurrencyQuery, GetCurrencyQueryVariables, I_Currency>(
            this.getCurrencyGQL,
            variables,
            {
                normalize: (data) => data.currency,
                ...options,
            },
        ) as Promise<I_Currency>;
    };

    getCurrencies = (
        variables?: GetCurrenciesQueryVariables,
        options?: I_GraphQLOptions<GetCurrenciesQuery, I_TableState<I_Currency>>,
    ) => {
        return this.graphqlService.query<GetCurrenciesQuery, GetCurrenciesQueryVariables, I_TableState<I_Currency>>(
            this.getCurrenciesGQL,
            variables,
            {
                normalize: (data) => this.normalizeCurrencyList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Currency>>;
    };

    createCurrency = (
        variables?: CreateCurrencyMutationVariables,
        options?: I_GraphQLOptions<CreateCurrencyMutation, { currencyCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateCurrencyMutation,
            CreateCurrencyMutationVariables,
            { currencyCreate: I_MutationResponse }
        >(this.createCurrencyGQL, variables, options);
    };

    updateCurrency = (
        variables?: UpdateCurrencyMutationVariables,
        options?: I_GraphQLOptions<UpdateCurrencyMutation, { currencyUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateCurrencyMutation,
            UpdateCurrencyMutationVariables,
            { currencyUpdate: I_MutationResponse }
        >(this.updateCurrencyGQL, variables, options);
    };

    updateCurrencyStatus = (
        variables?: UpdateCurrencyStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateCurrencyStatusMutation, { currencyUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateCurrencyStatusMutation,
            UpdateCurrencyStatusMutationVariables,
            { currencyUpdateStatus: I_MutationResponse }
        >(this.updateCurrencyStatusGQL, variables, options);
    };
    // #endregion

    // #region DELIVERY TERM
    private normalizeDeliveryTermList = (
        data: GetDeliveryTermsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_DeliveryTerm> => {
        return normalizeWithPagination<I_DeliveryTerm>(data.deliveryTerms, extra);
    };

    getDeliveryTerm = (
        variables?: GetDeliveryTermQueryVariables,
        options?: I_GraphQLOptions<GetDeliveryTermQuery, I_DeliveryTerm>,
    ) => {
        return this.graphqlService.query<GetDeliveryTermQuery, GetDeliveryTermQueryVariables, I_DeliveryTerm>(
            this.getDeliveryTermGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.deliveryTerm,
                    status: data.deliveryTerm.status,
                }),
                ...options,
            },
        ) as Promise<I_DeliveryTerm>;
    };

    getDeliveryTerms = (
        variables?: GetDeliveryTermsQueryVariables,
        options?: I_GraphQLOptions<GetDeliveryTermsQuery, I_TableState<I_DeliveryTerm>>,
    ) => {
        return this.graphqlService.query<
            GetDeliveryTermsQuery,
            GetDeliveryTermsQueryVariables,
            I_TableState<I_DeliveryTerm>
        >(this.getDeliveryTermsGQL, variables, {
            normalize: (data) => this.normalizeDeliveryTermList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_DeliveryTerm>>;
    };

    createDeliveryTerm = (
        variables?: CreateDeliveryTermMutationVariables,
        options?: I_GraphQLOptions<CreateDeliveryTermMutation, { deliveryTermCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateDeliveryTermMutation,
            CreateDeliveryTermMutationVariables,
            { deliveryTermCreate: I_MutationResponse }
        >(this.createDeliveryTermGQL, variables, options);
    };

    updateDeliveryTerm = (
        variables?: UpdateDeliveryTermMutationVariables,
        options?: I_GraphQLOptions<UpdateDeliveryTermMutation, { deliveryTermUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateDeliveryTermMutation,
            UpdateDeliveryTermMutationVariables,
            { deliveryTermUpdate: I_MutationResponse }
        >(this.updateDeliveryTermGQL, variables, options);
    };

    updateDeliveryTermStatus = (
        variables?: UpdateDeliveryTermStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateDeliveryTermStatusMutation, { deliveryTermUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateDeliveryTermStatusMutation,
            UpdateDeliveryTermStatusMutationVariables,
            { deliveryTermUpdateStatus: I_MutationResponse }
        >(this.updateDeliveryTermStatusGQL, variables, options);
    };
    // #endregion

    // #region PAYMENT TERM
    private normalizePaymentTermList = (
        data: GetPaymentTermsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_PaymentTerm> => {
        return normalizeWithPagination<I_PaymentTerm>(data.paymentTerms, extra);
    };

    getPaymentTerm = (
        variables?: GetPaymentTermQueryVariables,
        options?: I_GraphQLOptions<GetPaymentTermQuery, I_PaymentTerm>,
    ) => {
        return this.graphqlService.query<GetPaymentTermQuery, GetPaymentTermQueryVariables, I_PaymentTerm>(
            this.getPaymentTermGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.paymentTerm,
                    status: data.paymentTerm.status,
                }),
                ...options,
            },
        ) as Promise<I_PaymentTerm>;
    };

    getPaymentTerms = (
        variables?: GetPaymentTermsQueryVariables,
        options?: I_GraphQLOptions<GetPaymentTermsQuery, I_TableState<I_PaymentTerm>>,
    ) => {
        return this.graphqlService.query<
            GetPaymentTermsQuery,
            GetPaymentTermsQueryVariables,
            I_TableState<I_PaymentTerm>
        >(this.getPaymentTermsGQL, variables, {
            normalize: (data) => this.normalizePaymentTermList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_PaymentTerm>>;
    };

    createPaymentTerm = (
        variables?: CreatePaymentTermMutationVariables,
        options?: I_GraphQLOptions<CreatePaymentTermMutation, { paymentTermCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreatePaymentTermMutation,
            CreatePaymentTermMutationVariables,
            { paymentTermCreate: I_MutationResponse }
        >(this.createPaymentTermGQL, variables, options);
    };

    updatePaymentTerm = (
        variables?: UpdatePaymentTermMutationVariables,
        options?: I_GraphQLOptions<UpdatePaymentTermMutation, { paymentTermUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdatePaymentTermMutation,
            UpdatePaymentTermMutationVariables,
            { paymentTermUpdate: I_MutationResponse }
        >(this.updatePaymentTermGQL, variables, options);
    };

    updatePaymentTermStatus = (
        variables?: UpdatePaymentTermStatusMutationVariables,
        options?: I_GraphQLOptions<UpdatePaymentTermStatusMutation, { paymentTermUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdatePaymentTermStatusMutation,
            UpdatePaymentTermStatusMutationVariables,
            { paymentTermUpdateStatus: I_MutationResponse }
        >(this.updatePaymentTermStatusGQL, variables, options);
    };
    // #endregion

    // #region REASON
    private normalizeReasonList = (data: GetReasonsQuery, extra?: I_NormalizeExtra): I_TableState<I_Reason> => {
        return normalizeWithPagination<I_Reason>(data.reasons, extra);
    };

    getReason = (variables?: GetReasonQueryVariables, options?: I_GraphQLOptions<GetReasonQuery, I_Reason>) => {
        return this.graphqlService.query<GetReasonQuery, GetReasonQueryVariables, I_Reason>(
            this.getReasonGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.reason,
                    status: data.reason.status,
                }),
                ...options,
            },
        ) as Promise<I_Reason>;
    };

    getReasons = (
        variables?: GetReasonsQueryVariables,
        options?: I_GraphQLOptions<GetReasonsQuery, I_TableState<I_Reason>>,
    ) => {
        return this.graphqlService.query<GetReasonsQuery, GetReasonsQueryVariables, I_TableState<I_Reason>>(
            this.getReasonsGQL,
            variables,
            {
                normalize: (data) => this.normalizeReasonList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Reason>>;
    };

    createReason = (
        variables?: CreateReasonMutationVariables,
        options?: I_GraphQLOptions<CreateReasonMutation, { reasonCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateReasonMutation,
            CreateReasonMutationVariables,
            { reasonCreate: I_MutationResponse }
        >(this.createReasonGQL, variables, options);
    };

    updateReason = (
        variables?: UpdateReasonMutationVariables,
        options?: I_GraphQLOptions<UpdateReasonMutation, { reasonUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateReasonMutation,
            UpdateReasonMutationVariables,
            { reasonUpdate: I_MutationResponse }
        >(this.updateReasonGQL, variables, options);
    };

    updateReasonStatus = (
        variables?: UpdateReasonStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateReasonStatusMutation, { reasonUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateReasonStatusMutation,
            UpdateReasonStatusMutationVariables,
            { reasonUpdateStatus: I_MutationResponse }
        >(this.updateReasonStatusGQL, variables, options);
    };
    // #endregion

    // #region GENDER
    private normalizeGenderList = (data: GetGendersQuery, extra?: I_NormalizeExtra): I_TableState<I_Gender> => {
        return normalizeWithPagination<I_Gender>(data.genders, extra);
    };

    getGender = (variables?: GetGenderQueryVariables, options?: I_GraphQLOptions<GetGenderQuery, I_Gender>) => {
        return this.graphqlService.query<GetGenderQuery, GetGenderQueryVariables, I_Gender>(
            this.getGenderGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.gender,
                    status: data.gender.status,
                }),
                ...options,
            },
        ) as Promise<I_Gender>;
    };

    getGenders = (
        variables?: GetGendersQueryVariables,
        options?: I_GraphQLOptions<GetGendersQuery, I_TableState<I_Gender>>,
    ) => {
        return this.graphqlService.query<GetGendersQuery, GetGendersQueryVariables, I_TableState<I_Gender>>(
            this.getGendersGQL,
            variables,
            {
                normalize: (data) => this.normalizeGenderList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Gender>>;
    };

    createGender = (
        variables?: CreateGenderMutationVariables,
        options?: I_GraphQLOptions<CreateGenderMutation, { genderCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateGenderMutation,
            CreateGenderMutationVariables,
            { genderCreate: I_MutationResponse }
        >(this.createGenderGQL, variables, options);
    };

    updateGender = (
        variables?: UpdateGenderMutationVariables,
        options?: I_GraphQLOptions<UpdateGenderMutation, { genderUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateGenderMutation,
            UpdateGenderMutationVariables,
            { genderUpdate: I_MutationResponse }
        >(this.updateGenderGQL, variables, options);
    };

    updateGenderStatus = (
        variables?: UpdateGenderStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateGenderStatusMutation, { genderUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateGenderStatusMutation,
            UpdateGenderStatusMutationVariables,
            { genderUpdateStatus: I_MutationResponse }
        >(this.updateGenderStatusGQL, variables, options);
    };
    // #endregion

    // #region POSITION
    private normalizePositionList = (data: GetPositionsQuery, extra?: I_NormalizeExtra): I_TableState<I_Position> => {
        return normalizeWithPagination<I_Position>(data.positions, extra);
    };

    getPosition = (variables?: GetPositionQueryVariables, options?: I_GraphQLOptions<GetPositionQuery, I_Position>) => {
        return this.graphqlService.query<GetPositionQuery, GetPositionQueryVariables, I_Position>(
            this.getPositionGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.position,
                    status: data.position.status,
                }),
                ...options,
            },
        ) as Promise<I_Position>;
    };

    getPositions = (
        variables?: GetPositionsQueryVariables,
        options?: I_GraphQLOptions<GetPositionsQuery, I_TableState<I_Position>>,
    ) => {
        return this.graphqlService.query<GetPositionsQuery, GetPositionsQueryVariables, I_TableState<I_Position>>(
            this.getPositionsGQL,
            variables,
            {
                normalize: (data) => this.normalizePositionList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Position>>;
    };

    createPosition = (
        variables?: CreatePositionMutationVariables,
        options?: I_GraphQLOptions<CreatePositionMutation, { positionCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreatePositionMutation,
            CreatePositionMutationVariables,
            { positionCreate: I_MutationResponse }
        >(this.createPositionGQL, variables, options);
    };

    updatePosition = (
        variables?: UpdatePositionMutationVariables,
        options?: I_GraphQLOptions<UpdatePositionMutation, { positionUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdatePositionMutation,
            UpdatePositionMutationVariables,
            { positionUpdate: I_MutationResponse }
        >(this.updatePositionGQL, variables, options);
    };

    updatePositionStatus = (
        variables?: UpdatePositionStatusMutationVariables,
        options?: I_GraphQLOptions<UpdatePositionStatusMutation, { positionUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdatePositionStatusMutation,
            UpdatePositionStatusMutationVariables,
            { positionUpdateStatus: I_MutationResponse }
        >(this.updatePositionStatusGQL, variables, options);
    };

    private normalizeLanguageList = (data: GetLanguagesQuery, extra?: I_NormalizeExtra): I_TableState<I_Language> => {
        return normalizeWithPagination<I_Language>(data.languages, extra);
    };
    // #endregion

    // #region LANGUAGE
    getLanguage = (variables?: GetLanguageQueryVariables, options?: I_GraphQLOptions<GetLanguageQuery, I_Language>) => {
        return this.graphqlService.query<GetLanguageQuery, GetLanguageQueryVariables, I_Language>(
            this.getLanguageGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.language,
                    status: data.language.status,
                }),
                ...options,
            },
        ) as Promise<I_Language>;
    };

    getLanguages = (
        variables?: GetLanguagesQueryVariables,
        options?: I_GraphQLOptions<GetLanguagesQuery, I_TableState<I_Language>>,
    ) => {
        return this.graphqlService.query<GetLanguagesQuery, GetLanguagesQueryVariables, I_TableState<I_Language>>(
            this.getLanguagesGQL,
            variables,
            {
                normalize: (data) => this.normalizeLanguageList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Language>>;
    };

    createLanguage = (
        variables?: CreateLanguageMutationVariables,
        options?: I_GraphQLOptions<CreateLanguageMutation, { languageCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateLanguageMutation,
            CreateLanguageMutationVariables,
            { languageCreate: I_MutationResponse }
        >(this.createLanguageGQL, variables, options);
    };

    updateLanguage = (
        variables?: UpdateLanguageMutationVariables,
        options?: I_GraphQLOptions<UpdateLanguageMutation, { languageUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateLanguageMutation,
            UpdateLanguageMutationVariables,
            { languageUpdate: I_MutationResponse }
        >(this.updateLanguageGQL, variables, options);
    };

    updateLanguageStatus = (
        variables?: UpdateLanguageStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateLanguageStatusMutation, { languageUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateLanguageStatusMutation,
            UpdateLanguageStatusMutationVariables,
            { languageUpdateStatus: I_MutationResponse }
        >(this.updateLanguageStatusGQL, variables, options);
    };
    // #endregion

    // #region NUMBER OF EMPLOYEE
    private normalizeNumberOfEmployeeList = (
        data: GetNumberOfEmployeesQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_NumberOfEmployee> => {
        return normalizeWithPagination<I_NumberOfEmployee>(data.numberOfEmployees, extra);
    };

    getNumberOfEmployee = (
        variables?: GetNumberOfEmployeeQueryVariables,
        options?: I_GraphQLOptions<GetNumberOfEmployeeQuery, I_NumberOfEmployee>,
    ) => {
        return this.graphqlService.query<
            GetNumberOfEmployeeQuery,
            GetNumberOfEmployeeQueryVariables,
            I_NumberOfEmployee
        >(this.getNumberOfEmployeeGQL, variables, {
            normalize: (data) => ({
                ...data.numberOfEmployee,
                status: data.numberOfEmployee.status,
            }),
            ...options,
        }) as Promise<I_NumberOfEmployee>;
    };

    getNumberOfEmployees = (
        variables?: GetNumberOfEmployeesQueryVariables,
        options?: I_GraphQLOptions<GetNumberOfEmployeesQuery, I_TableState<I_NumberOfEmployee>>,
    ) => {
        return this.graphqlService.query<
            GetNumberOfEmployeesQuery,
            GetNumberOfEmployeesQueryVariables,
            I_TableState<I_NumberOfEmployee>
        >(this.getNumberOfEmployeesGQL, variables, {
            normalize: (data) => this.normalizeNumberOfEmployeeList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_NumberOfEmployee>>;
    };

    createNumberOfEmployee = (
        variables?: CreateNumberOfEmployeeMutationVariables,
        options?: I_GraphQLOptions<CreateNumberOfEmployeeMutation, { numberOfEmployeeCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateNumberOfEmployeeMutation,
            CreateNumberOfEmployeeMutationVariables,
            { numberOfEmployeeCreate: I_MutationResponse }
        >(this.createNumberOfEmployeeGQL, variables, options);
    };

    updateNumberOfEmployee = (
        variables?: UpdateNumberOfEmployeeMutationVariables,
        options?: I_GraphQLOptions<UpdateNumberOfEmployeeMutation, { numberOfEmployeeUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateNumberOfEmployeeMutation,
            UpdateNumberOfEmployeeMutationVariables,
            { numberOfEmployeeUpdate: I_MutationResponse }
        >(this.updateNumberOfEmployeeGQL, variables, options);
    };

    updateNumberOfEmployeeStatus = (
        variables?: UpdateNumberOfEmployeeStatusMutationVariables,
        options?: I_GraphQLOptions<
            UpdateNumberOfEmployeeStatusMutation,
            { numberOfEmployeeUpdateStatus: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateNumberOfEmployeeStatusMutation,
            UpdateNumberOfEmployeeStatusMutationVariables,
            { numberOfEmployeeUpdateStatus: I_MutationResponse }
        >(this.updateNumberOfEmployeeStatusGQL, variables, options);
    };
    // #endregion

    // #region INDUSTRY
    private normalizeIndustries = (data: GetIndustriesQuery, extra?: I_NormalizeExtra): I_TableState<I_Industry> => {
        return normalizeWithPagination<I_Industry>(data.industries, extra);
    };

    getIndustry = (variables?: GetIndustryQueryVariables, options?: I_GraphQLOptions<GetIndustryQuery, I_Industry>) => {
        return this.graphqlService.query<GetIndustryQuery, GetIndustryQueryVariables, I_Industry>(
            this.getIndustryGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.industry,
                    status: data.industry.status,
                }),
                ...options,
            },
        ) as Promise<I_Industry>;
    };

    getIndustryWithIndustryCluster = (
        variables?: GetIndustryWithIndustryClusterQueryVariables,
        options?: I_GraphQLOptions<GetIndustryWithIndustryClusterQuery, I_Industry>,
    ) => {
        return this.graphqlService.query<
            GetIndustryWithIndustryClusterQuery,
            GetIndustryWithIndustryClusterQueryVariables,
            I_Industry
        >(this.getIndustryWithIndustryClusterGQL, variables, {
            normalize: (data) => ({
                ...data.industry,
                status: data.industry.status,
            }),
            ...options,
        }) as Promise<I_Industry>;
    };

    getIndustries = (
        variables?: GetIndustriesQueryVariables,
        options?: I_GraphQLOptions<GetIndustriesQuery, I_TableState<I_Industry>>,
    ) => {
        return this.graphqlService.query<GetIndustriesQuery, GetIndustriesQueryVariables, I_TableState<I_Industry>>(
            this.getIndustriesGQL,
            variables,
            {
                normalize: (data) => this.normalizeIndustries(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Industry>>;
    };

    createIndustry = (
        variables?: CreateIndustryMutationVariables,
        options?: I_GraphQLOptions<CreateIndustryMutation, { industryCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateIndustryMutation,
            CreateIndustryMutationVariables,
            { industryCreate: I_MutationResponse }
        >(this.createIndustryGQL, variables, options);
    };

    updateIndustry = (
        variables?: UpdateIndustryMutationVariables,
        options?: I_GraphQLOptions<UpdateIndustryMutation, { industryUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateIndustryMutation,
            UpdateIndustryMutationVariables,
            { industryUpdate: I_MutationResponse }
        >(this.updateIndustryGQL, variables, options);
    };

    updateIndustryStatus = (
        variables?: UpdateIndustryStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateIndustryStatusMutation, { industryUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateIndustryStatusMutation,
            UpdateIndustryStatusMutationVariables,
            { industryUpdateStatus: I_MutationResponse }
        >(this.updateIndustryStatusGQL, variables, options);
    };
    // #endregion

    // #region INDUSTRY CLUSTER
    private normalizeIndustryClusterList = (
        data: GetIndustryClustersQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_IndustryCluster> => {
        return normalizeWithPagination<I_IndustryCluster>(data.industryClusters, extra);
    };

    getIndustryCluster = (
        variables?: GetIndustryClusterQueryVariables,
        options?: I_GraphQLOptions<GetIndustryClusterQuery, I_IndustryCluster>,
    ) => {
        return this.graphqlService.query<GetIndustryClusterQuery, GetIndustryClusterQueryVariables, I_IndustryCluster>(
            this.getIndustryClusterGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.industryCluster,
                    status: data.industryCluster.status,
                }),
                ...options,
            },
        ) as Promise<I_IndustryCluster>;
    };

    getIndustryClusterWithIndustry = (
        variables?: GetIndustryClusterWithIndustryQueryVariables,
        options?: I_GraphQLOptions<GetIndustryClusterWithIndustryQuery, I_IndustryCluster>,
    ) => {
        return this.graphqlService.query<
            GetIndustryClusterWithIndustryQuery,
            GetIndustryClusterWithIndustryQueryVariables,
            I_IndustryCluster
        >(this.getIndustryClusterWithIndustryGQL, variables, {
            normalize: (data) => ({
                ...data.industryCluster,
                status: data.industryCluster.status,
            }),
            ...options,
        }) as Promise<I_IndustryCluster>;
    };

    getIndustryClusterWithIndustrySectors = (
        variables?: GetIndustryClusterWithIndustrySectorsQueryVariables,
        options?: I_GraphQLOptions<GetIndustryClusterWithIndustrySectorsQuery, I_IndustryCluster>,
    ) => {
        return this.graphqlService.query<
            GetIndustryClusterWithIndustrySectorsQuery,
            GetIndustryClusterWithIndustrySectorsQueryVariables,
            I_IndustryCluster
        >(this.getIndustryClusterWithIndustrySectorsGQL, variables, {
            normalize: (data) => ({
                ...data.industryCluster,
                status: data.industryCluster.status,
            }),
            ...options,
        }) as Promise<I_IndustryCluster>;
    };

    getIndustryClusters = (
        variables?: GetIndustryClustersQueryVariables,
        options?: I_GraphQLOptions<GetIndustryClustersQuery, I_TableState<I_IndustryCluster>>,
    ) => {
        return this.graphqlService.query<
            GetIndustryClustersQuery,
            GetIndustryClustersQueryVariables,
            I_TableState<I_IndustryCluster>
        >(this.getIndustryClustersGQL, variables, {
            normalize: (data) => this.normalizeIndustryClusterList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_IndustryCluster>>;
    };

    getIndustryClustersWithIndustry = (
        variables?: GetIndustryClustersWithIndustryQueryVariables,
        options?: I_GraphQLOptions<GetIndustryClustersWithIndustryQuery, I_TableState<I_IndustryCluster>>,
    ) => {
        return this.graphqlService.query<
            GetIndustryClustersWithIndustryQuery,
            GetIndustryClustersWithIndustryQueryVariables,
            I_TableState<I_IndustryCluster>
        >(this.getIndustryClustersWithIndustryGQL, variables, {
            normalize: (data) => this.normalizeIndustryClusterList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_IndustryCluster>>;
    };

    createIndustryCluster = (
        variables?: CreateIndustryClusterMutationVariables,
        options?: I_GraphQLOptions<CreateIndustryClusterMutation, { industryClusterCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateIndustryClusterMutation,
            CreateIndustryClusterMutationVariables,
            { industryClusterCreate: I_MutationResponse }
        >(this.createIndustryClusterGQL, variables, options);
    };

    updateIndustryCluster = (
        variables?: UpdateIndustryClusterMutationVariables,
        options?: I_GraphQLOptions<UpdateIndustryClusterMutation, { industryClusterUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateIndustryClusterMutation,
            UpdateIndustryClusterMutationVariables,
            { industryClusterUpdate: I_MutationResponse }
        >(this.updateIndustryClusterGQL, variables, options);
    };

    updateIndustryClusterStatus = (
        variables?: UpdateIndustryClusterStatusMutationVariables,
        options?: I_GraphQLOptions<
            UpdateIndustryClusterStatusMutation,
            { industryClusterUpdateStatus: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateIndustryClusterStatusMutation,
            UpdateIndustryClusterStatusMutationVariables,
            { industryClusterUpdateStatus: I_MutationResponse }
        >(this.updateIndustryClusterStatusGQL, variables, options);
    };
    // #endregion

    // #region INDUSTRY SECTOR
    private normalizeIndustrySectorList = (
        data: GetIndustrySectorsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_IndustrySector> => {
        return normalizeWithPagination<I_IndustrySector>(data.industrySectors, extra);
    };

    getIndustrySector = (
        variables?: GetIndustrySectorQueryVariables,
        options?: I_GraphQLOptions<GetIndustrySectorQuery, I_IndustrySector>,
    ) => {
        return this.graphqlService.query<GetIndustrySectorQuery, GetIndustrySectorQueryVariables, I_IndustrySector>(
            this.getIndustrySectorGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.industrySector,
                    status: data.industrySector.status,
                }),
                ...options,
            },
        ) as Promise<I_IndustrySector>;
    };

    getIndustrySectorWithIndustryCluster = (
        variables?: GetIndustrySectorWithIndustryClusterQueryVariables,
        options?: I_GraphQLOptions<GetIndustrySectorWithIndustryClusterQuery, I_IndustrySector>,
    ) => {
        return this.graphqlService.query<
            GetIndustrySectorWithIndustryClusterQuery,
            GetIndustrySectorWithIndustryClusterQueryVariables,
            I_IndustrySector
        >(this.getIndustrySectorWithIndustryClusterGQL, variables, {
            normalize: (data) => ({
                ...data.industrySector,
                status: data.industrySector.status,
            }),
            ...options,
        }) as Promise<I_IndustrySector>;
    };

    getIndustrySectorWithIndustrySubSectors = (
        variables?: GetIndustrySectorWithIndustrySubSectorsQueryVariables,
        options?: I_GraphQLOptions<GetIndustrySectorWithIndustrySubSectorsQuery, I_IndustrySector>,
    ) => {
        return this.graphqlService.query<
            GetIndustrySectorWithIndustrySubSectorsQuery,
            GetIndustrySectorWithIndustrySubSectorsQueryVariables,
            I_IndustrySector
        >(this.getIndustrySectorWithIndustrySubSectorsGQL, variables, {
            normalize: (data) => ({
                ...data.industrySector,
                status: data.industrySector.status,
            }),
            ...options,
        }) as Promise<I_IndustrySector>;
    };

    getIndustrySectors = (
        variables?: GetIndustrySectorsQueryVariables,
        options?: I_GraphQLOptions<GetIndustrySectorsQuery, I_TableState<I_IndustrySector>>,
    ) => {
        return this.graphqlService.query<
            GetIndustrySectorsQuery,
            GetIndustrySectorsQueryVariables,
            I_TableState<I_IndustrySector>
        >(this.getIndustrySectorsGQL, variables, {
            normalize: (data) => this.normalizeIndustrySectorList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_IndustrySector>>;
    };

    getIndustrySectorsWithIndustryCluster = (
        variables?: GetIndustrySectorsWithIndustryClusterQueryVariables,
        options?: I_GraphQLOptions<GetIndustrySectorsWithIndustryClusterQuery, I_TableState<I_IndustrySector>>,
    ) => {
        return this.graphqlService.query<
            GetIndustrySectorsWithIndustryClusterQuery,
            GetIndustrySectorsWithIndustryClusterQueryVariables,
            I_TableState<I_IndustrySector>
        >(this.getIndustrySectorsWithIndustryClusterGQL, variables, {
            normalize: (data) => this.normalizeIndustrySectorList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_IndustrySector>>;
    };

    createIndustrySectors = (
        variables?: CreateIndustrySectorsMutationVariables,
        options?: I_GraphQLOptions<CreateIndustrySectorsMutation, { industrySectorsCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateIndustrySectorsMutation,
            CreateIndustrySectorsMutationVariables,
            { industrySectorsCreate: I_MutationResponse }
        >(this.createIndustrySectorsGQL, variables, options);
    };

    updateIndustrySector = (
        variables?: UpdateIndustrySectorsMutationVariables,
        options?: I_GraphQLOptions<UpdateIndustrySectorsMutation, { industrySectorsUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateIndustrySectorsMutation,
            UpdateIndustrySectorsMutationVariables,
            { industrySectorsUpdate: I_MutationResponse }
        >(this.updateIndustrySectorsGQL, variables, options);
    };

    updateIndustrySectorStatus = (
        variables?: UpdateIndustrySectorsStatusMutationVariables,
        options?: I_GraphQLOptions<
            UpdateIndustrySectorsStatusMutation,
            { industrySectorsUpdateStatus: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateIndustrySectorsStatusMutation,
            UpdateIndustrySectorsStatusMutationVariables,
            { industrySectorsUpdateStatus: I_MutationResponse }
        >(this.updateIndustrySectorsStatusGQL, variables, options);
    };
    // #endregion

    // #region INDUSTRY SUBSECTOR
    private normalizeIndustrySubSectorList = (
        data: GetIndustrySubSectorsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_IndustrySubSector> => {
        return normalizeWithPagination<I_IndustrySubSector>(data.industrySubSectors, extra);
    };

    getIndustrySubSector = (
        variables?: GetIndustrySubSectorQueryVariables,
        options?: I_GraphQLOptions<GetIndustrySubSectorQuery, I_IndustrySubSector>,
    ) => {
        return this.graphqlService.query<
            GetIndustrySubSectorQuery,
            GetIndustrySubSectorQueryVariables,
            I_IndustrySubSector
        >(this.getIndustrySubSectorGQL, variables, {
            normalize: (data) => ({
                ...data.industrySubSector,
                status: data.industrySubSector.status,
            }),
            ...options,
        }) as Promise<I_IndustrySubSector>;
    };

    getIndustrySubSectorWithIndustrySectors = (
        variables?: GetIndustrySubSectorWithIndustrySectorsQueryVariables,
        options?: I_GraphQLOptions<GetIndustrySubSectorWithIndustrySectorsQuery, I_IndustrySubSector>,
    ) => {
        return this.graphqlService.query<
            GetIndustrySubSectorWithIndustrySectorsQuery,
            GetIndustrySubSectorWithIndustrySectorsQueryVariables,
            I_IndustrySubSector
        >(this.getIndustrySubSectorWithIndustrySectorsGQL, variables, {
            normalize: (data) => ({
                ...data.industrySubSector,
                status: data.industrySubSector.status,
            }),
            ...options,
        }) as Promise<I_IndustrySubSector>;
    };

    getIndustrySubSectors = (
        variables?: GetIndustrySubSectorsQueryVariables,
        options?: I_GraphQLOptions<GetIndustrySubSectorsQuery, I_TableState<I_IndustrySubSector>>,
    ) => {
        return this.graphqlService.query<
            GetIndustrySubSectorsQuery,
            GetIndustrySubSectorsQueryVariables,
            I_TableState<I_IndustrySubSector>
        >(this.getIndustrySubSectorsGQL, variables, {
            normalize: (data) => this.normalizeIndustrySubSectorList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_IndustrySubSector>>;
    };

    getIndustrySubSectorsWithIndustrySectors = (
        variables?: GetIndustrySubSectorsWithIndustrySectorsQueryVariables,
        options?: I_GraphQLOptions<GetIndustrySubSectorsWithIndustrySectorsQuery, I_TableState<I_IndustrySubSector>>,
    ) => {
        return this.graphqlService.query<
            GetIndustrySubSectorsWithIndustrySectorsQuery,
            GetIndustrySubSectorsWithIndustrySectorsQueryVariables,
            I_TableState<I_IndustrySubSector>
        >(this.getIndustrySubSectorsWithIndustrySectorsGQL, variables, {
            normalize: (data) => this.normalizeIndustrySubSectorList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_IndustrySubSector>>;
    };

    createIndustrySubSectors = (
        variables?: CreateIndustrySubSectorsMutationVariables,
        options?: I_GraphQLOptions<CreateIndustrySubSectorsMutation, { industrySubSectorsCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateIndustrySubSectorsMutation,
            CreateIndustrySubSectorsMutationVariables,
            { industrySubSectorsCreate: I_MutationResponse }
        >(this.createIndustrySubSectorsGQL, variables, options);
    };

    updateIndustrySubSectors = (
        variables?: UpdateIndustrySubSectorsMutationVariables,
        options?: I_GraphQLOptions<UpdateIndustrySubSectorsMutation, { industrySubSectorsUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateIndustrySubSectorsMutation,
            UpdateIndustrySubSectorsMutationVariables,
            { industrySubSectorsUpdate: I_MutationResponse }
        >(this.updateIndustrySubSectorsGQL, variables, options);
    };

    updateIndustrySubSectorsStatus = (
        variables?: UpdateIndustrySubSectorsStatusMutationVariables,
        options?: I_GraphQLOptions<
            UpdateIndustrySubSectorsStatusMutation,
            { industrySubSectorsUpdateStatus: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateIndustrySubSectorsStatusMutation,
            UpdateIndustrySubSectorsStatusMutationVariables,
            { industrySubSectorsUpdateStatus: I_MutationResponse }
        >(this.updateIndustrySubSectorsStatusGQL, variables, options);
    };
    // #endregion

    // #region UNIT OF MEASURE
    private normalizeUnitOfMeasureList = (
        data: GetUnitOfMeasuresQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_UnitOfMeasure> => {
        return normalizeWithPagination<I_UnitOfMeasure>(data.unitOfMeasures, extra);
    };

    getUnitOfMeasure = (
        variables?: GetUnitOfMeasureQueryVariables,
        options?: I_GraphQLOptions<GetUnitOfMeasureQuery, I_UnitOfMeasure>,
    ) => {
        return this.graphqlService.query<GetUnitOfMeasureQuery, GetUnitOfMeasureQueryVariables, I_UnitOfMeasure>(
            this.getUnitOfMeasureGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.unitOfMeasure,
                    status: data.unitOfMeasure.status,
                }),
                ...options,
            },
        ) as Promise<I_UnitOfMeasure>;
    };

    getUnitOfMeasures = (
        variables?: GetUnitOfMeasuresQueryVariables,
        options?: I_GraphQLOptions<GetUnitOfMeasuresQuery, I_TableState<I_UnitOfMeasure>>,
    ) => {
        return this.graphqlService.query<
            GetUnitOfMeasuresQuery,
            GetUnitOfMeasuresQueryVariables,
            I_TableState<I_UnitOfMeasure>
        >(this.getUnitOfMeasuresGQL, variables, {
            normalize: (data) => this.normalizeUnitOfMeasureList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_UnitOfMeasure>>;
    };

    createUnitOfMeasure = (
        variables?: CreateUnitOfMeasureMutationVariables,
        options?: I_GraphQLOptions<CreateUnitOfMeasureMutation, { unitOfMeasureCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateUnitOfMeasureMutation,
            CreateUnitOfMeasureMutationVariables,
            { unitOfMeasureCreate: I_MutationResponse }
        >(this.createUnitOfMeasureGQL, variables, options);
    };

    updateUnitOfMeasure = (
        variables?: UpdateUnitOfMeasureMutationVariables,
        options?: I_GraphQLOptions<UpdateUnitOfMeasureMutation, { unitOfMeasureUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateUnitOfMeasureMutation,
            UpdateUnitOfMeasureMutationVariables,
            { unitOfMeasureUpdate: I_MutationResponse }
        >(this.updateUnitOfMeasureGQL, variables, options);
    };

    updateUnitOfMeasuresStatus = (
        variables?: UpdateUnitOfMeasureStatusMutationVariables,
        options?: I_GraphQLOptions<
            UpdateUnitOfMeasureStatusMutation,
            { unitOfMeasureUpdateStatus: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateUnitOfMeasureStatusMutation,
            UpdateUnitOfMeasureStatusMutationVariables,
            { unitOfMeasureUpdateStatus: I_MutationResponse }
        >(this.updateUnitOfMeasureStatusGQL, variables, options);
    };
    // #endregion

    // #region FAMILY CODE
    private normalizeFamilyCodes = (
        data: GetFamilyCodesQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_FamilyCode> => {
        return normalizeWithPagination<I_FamilyCode>(data.familyCodes, extra);
    };

    getFamilyCode = (
        variables?: GetFamilyCodeQueryVariables,
        options?: I_GraphQLOptions<GetFamilyCodeQuery, I_FamilyCode>,
    ) => {
        return this.graphqlService.query<GetFamilyCodeQuery, GetFamilyCodeQueryVariables, I_FamilyCode>(
            this.getFamilyCodeGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.familyCode,
                    status: data.familyCode.status,
                }),
                ...options,
            },
        ) as Promise<I_FamilyCode>;
    };

    getFamilyCodeWithClusterCode = (
        variables?: GetFamilyCodeWithClusterCodeQueryVariables,
        options?: I_GraphQLOptions<GetFamilyCodeWithClusterCodeQuery, I_FamilyCode>,
    ) => {
        return this.graphqlService.query<
            GetFamilyCodeWithClusterCodeQuery,
            GetFamilyCodeWithClusterCodeQueryVariables,
            I_FamilyCode
        >(this.getFamilyCodeWithClusterCodeGQL, variables, {
            normalize: (data) => ({
                ...data.familyCode,
                status: data.familyCode.status,
            }),
            ...options,
        }) as Promise<I_FamilyCode>;
    };

    getFamilyCodes = (
        variables?: GetFamilyCodesQueryVariables,
        options?: I_GraphQLOptions<GetFamilyCodesQuery, I_TableState<I_FamilyCode>>,
    ) => {
        return this.graphqlService.query<GetFamilyCodesQuery, GetFamilyCodesQueryVariables, I_TableState<I_FamilyCode>>(
            this.getFamilyCodesGQL,
            variables,
            {
                normalize: (data) => this.normalizeFamilyCodes(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_FamilyCode>>;
    };

    getFamilyCodesWithClusterCode = (
        variables?: GetFamilyCodesWithClusterCodeQueryVariables,
        options?: I_GraphQLOptions<GetFamilyCodesWithClusterCodeQuery, I_TableState<I_FamilyCode>>,
    ) => {
        return this.graphqlService.query<
            GetFamilyCodesWithClusterCodeQuery,
            GetFamilyCodesWithClusterCodeQueryVariables,
            I_TableState<I_FamilyCode>
        >(this.getFamilyCodesWithClusterCodeGQL, variables, {
            normalize: (data) => this.normalizeFamilyCodes(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_FamilyCode>>;
    };

    createFamilyCode = (
        variables?: CreateFamilyCodeMutationVariables,
        options?: I_GraphQLOptions<CreateFamilyCodeMutation, { familyCodeCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateFamilyCodeMutation,
            CreateFamilyCodeMutationVariables,
            { familyCodeCreate: I_MutationResponse }
        >(this.createFamilyCodeGQL, variables, options);
    };

    updateFamilyCode = (
        variables?: UpdateFamilyCodeMutationVariables,
        options?: I_GraphQLOptions<UpdateFamilyCodeMutation, { familyCodeUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateFamilyCodeMutation,
            UpdateFamilyCodeMutationVariables,
            { familyCodeUpdate: I_MutationResponse }
        >(this.updateFamilyCodeGQL, variables, options);
    };

    updateFamilyCodeStatus = (
        variables?: UpdateFamilyCodeStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateFamilyCodeStatusMutation, { familyCodeUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateFamilyCodeStatusMutation,
            UpdateFamilyCodeStatusMutationVariables,
            { familyCodeUpdateStatus: I_MutationResponse }
        >(this.updateFamilyCodeStatusGQL, variables, options);
    };
    // #endregion

    // #region CLUSTER CODE
    private normalizeClusterCodeList = (
        data: GetClusterCodesQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_ClusterCode> => {
        return normalizeWithPagination<I_ClusterCode>(data.clusterCodes, extra);
    };

    getClusterCode = (
        variables?: GetClusterCodeQueryVariables,
        options?: I_GraphQLOptions<GetClusterCodeQuery, I_ClusterCode>,
    ) => {
        return this.graphqlService.query<GetClusterCodeQuery, GetClusterCodeQueryVariables, I_ClusterCode>(
            this.getClusterCodeGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.clusterCode,
                    status: data.clusterCode.status,
                }),
                ...options,
            },
        ) as Promise<I_ClusterCode>;
    };

    getClusterCodeWithFamilyCode = (
        variables?: GetClusterCodeWithFamilyCodeQueryVariables,
        options?: I_GraphQLOptions<GetClusterCodeWithFamilyCodeQuery, I_ClusterCode>,
    ) => {
        return this.graphqlService.query<
            GetClusterCodeWithFamilyCodeQuery,
            GetClusterCodeWithFamilyCodeQueryVariables,
            I_ClusterCode
        >(this.getClusterCodeWithFamilyCodeGQL, variables, {
            normalize: (data) => ({
                ...data.clusterCode,
                status: data.clusterCode.status,
            }),
            ...options,
        }) as Promise<I_ClusterCode>;
    };

    getClusterCodeWithSubClusterCode = (
        variables?: GetClusterCodeWithSubClusterCodeQueryVariables,
        options?: I_GraphQLOptions<GetClusterCodeWithSubClusterCodeQuery, I_ClusterCode>,
    ) => {
        return this.graphqlService.query<
            GetClusterCodeWithSubClusterCodeQuery,
            GetClusterCodeWithSubClusterCodeQueryVariables,
            I_ClusterCode
        >(this.getClusterCodeWithSubClusterCodeGQL, variables, {
            normalize: (data) => ({
                ...data.clusterCode,
                status: data.clusterCode.status,
            }),
            ...options,
        }) as Promise<I_ClusterCode>;
    };

    getClusterCodes = (
        variables?: GetClusterCodesQueryVariables,
        options?: I_GraphQLOptions<GetClusterCodesQuery, I_TableState<I_ClusterCode>>,
    ) => {
        return this.graphqlService.query<
            GetClusterCodesQuery,
            GetClusterCodesQueryVariables,
            I_TableState<I_ClusterCode>
        >(this.getClusterCodesGQL, variables, {
            normalize: (data) => this.normalizeClusterCodeList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_ClusterCode>>;
    };

    getClusterCodesWithFamilyCode = (
        variables?: GetClusterCodesWithFamilyCodeQueryVariables,
        options?: I_GraphQLOptions<GetClusterCodesWithFamilyCodeQuery, I_TableState<I_ClusterCode>>,
    ) => {
        return this.graphqlService.query<
            GetClusterCodesWithFamilyCodeQuery,
            GetClusterCodesWithFamilyCodeQueryVariables,
            I_TableState<I_ClusterCode>
        >(this.getClusterCodesWithFamilyCodeGQL, variables, {
            normalize: (data) => this.normalizeClusterCodeList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_ClusterCode>>;
    };

    createClusterCode = (
        variables?: CreateClusterCodeMutationVariables,
        options?: I_GraphQLOptions<CreateClusterCodeMutation, { clusterCodeCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateClusterCodeMutation,
            CreateClusterCodeMutationVariables,
            { clusterCodeCreate: I_MutationResponse }
        >(this.createClusterCodeGQL, variables, options);
    };

    updateClusterCode = (
        variables?: UpdateClusterCodeMutationVariables,
        options?: I_GraphQLOptions<UpdateClusterCodeMutation, { clusterCodeUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateClusterCodeMutation,
            UpdateClusterCodeMutationVariables,
            { clusterCodeUpdate: I_MutationResponse }
        >(this.updateClusterCodeGQL, variables, options);
    };

    updateClusterCodeStatus = (
        variables?: UpdateClusterCodeStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateClusterCodeStatusMutation, { clusterCodeUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateClusterCodeStatusMutation,
            UpdateClusterCodeStatusMutationVariables,
            { clusterCodeUpdateStatus: I_MutationResponse }
        >(this.updateClusterCodeStatusGQL, variables, options);
    };
    // #endregion

    // #region SUB CLUSTER CODE
    private normalizeSubClusterCodeList = (
        data: GetSubClusterCodesQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_SubClusterCode> => {
        return normalizeWithPagination<I_SubClusterCode>(data.subClusterCodes, extra);
    };

    getSubClusterCode = (
        variables?: GetSubClusterCodeQueryVariables,
        options?: I_GraphQLOptions<GetSubClusterCodeQuery, I_SubClusterCode>,
    ) => {
        return this.graphqlService.query<GetSubClusterCodeQuery, GetSubClusterCodeQueryVariables, I_SubClusterCode>(
            this.getSubClusterCodeGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.subClusterCode,
                    status: data.subClusterCode.status,
                }),
                ...options,
            },
        ) as Promise<I_SubClusterCode>;
    };

    getSubClusterCodeWithClusterCode = (
        variables?: GetSubClusterCodeWithClusterCodeQueryVariables,
        options?: I_GraphQLOptions<GetSubClusterCodeWithClusterCodeQuery, I_SubClusterCode>,
    ) => {
        return this.graphqlService.query<
            GetSubClusterCodeWithClusterCodeQuery,
            GetSubClusterCodeWithClusterCodeQueryVariables,
            I_SubClusterCode
        >(this.getSubClusterCodeWithClusterCodeGQL, variables, {
            normalize: (data) => ({
                ...data.subClusterCode,
                status: data.subClusterCode.status,
            }),
            ...options,
        }) as Promise<I_SubClusterCode>;
    };

    getSubClusterCodeWithCategory = (
        variables?: GetSubClusterCodeWithCategoryQueryVariables,
        options?: I_GraphQLOptions<GetSubClusterCodeWithCategoryQuery, I_SubClusterCode>,
    ) => {
        return this.graphqlService.query<
            GetSubClusterCodeWithCategoryQuery,
            GetSubClusterCodeWithCategoryQueryVariables,
            I_SubClusterCode
        >(this.getSubClusterCodeWithCategoryGQL, variables, {
            normalize: (data) => ({
                ...data.subClusterCode,
                status: data.subClusterCode.status,
            }),
            ...options,
        }) as Promise<I_SubClusterCode>;
    };

    getSubClusterCodes = (
        variables?: GetSubClusterCodesQueryVariables,
        options?: I_GraphQLOptions<GetSubClusterCodesQuery, I_TableState<I_SubClusterCode>>,
    ) => {
        return this.graphqlService.query<
            GetSubClusterCodesQuery,
            GetSubClusterCodesQueryVariables,
            I_TableState<I_SubClusterCode>
        >(this.getSubClusterCodesGQL, variables, {
            normalize: (data) => this.normalizeSubClusterCodeList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_SubClusterCode>>;
    };

    getSubClusterCodesWithClusterCode = (
        variables?: GetSubClusterCodesWithClusterCodeQueryVariables,
        options?: I_GraphQLOptions<GetSubClusterCodesWithClusterCodeQuery, I_TableState<I_SubClusterCode>>,
    ) => {
        return this.graphqlService.query<
            GetSubClusterCodesWithClusterCodeQuery,
            GetSubClusterCodesWithClusterCodeQueryVariables,
            I_TableState<I_SubClusterCode>
        >(this.getSubClusterCodesWithClusterCodeGQL, variables, {
            normalize: (data) => this.normalizeSubClusterCodeList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_SubClusterCode>>;
    };

    createSubClusterCode = (
        variables?: CreateSubClusterCodeMutationVariables,
        options?: I_GraphQLOptions<CreateSubClusterCodeMutation, { subClusterCodeCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateSubClusterCodeMutation,
            CreateSubClusterCodeMutationVariables,
            { subClusterCodeCreate: I_MutationResponse }
        >(this.createSubClusterCodeGQL, variables, options);
    };

    updateSubClusterCode = (
        variables?: UpdateSubClusterCodeMutationVariables,
        options?: I_GraphQLOptions<UpdateSubClusterCodeMutation, { subClusterCodeUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateSubClusterCodeMutation,
            UpdateSubClusterCodeMutationVariables,
            { subClusterCodeUpdate: I_MutationResponse }
        >(this.updateSubClusterCodeGQL, variables, options);
    };

    updateSubClusterCodeStatus = (
        variables?: UpdateSubClusterCodeStatusMutationVariables,
        options?: I_GraphQLOptions<
            UpdateSubClusterCodeStatusMutation,
            { subClusterCodeUpdateStatus: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateSubClusterCodeStatusMutation,
            UpdateSubClusterCodeStatusMutationVariables,
            { subClusterCodeUpdateStatus: I_MutationResponse }
        >(this.updateSubClusterCodeStatusGQL, variables, options);
    };
    // #endregion

    // #region CATEGORY
    private normalizeCategoryList = (data: GetCategoriesQuery, extra?: I_NormalizeExtra): I_TableState<I_Category> => {
        return normalizeWithPagination<I_Category>(data.categories, extra);
    };

    getCategory = (variables?: GetCategoryQueryVariables, options?: I_GraphQLOptions<GetCategoryQuery, I_Category>) => {
        return this.graphqlService.query<GetCategoryQuery, GetCategoryQueryVariables, I_Category>(
            this.getCategoryGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.category,
                    status: data.category.status,
                }),
                ...options,
            },
        ) as Promise<I_Category>;
    };

    getCategoryWithSubClusterCode = (
        variables?: GetCategoryWithSubClusterCodeQueryVariables,
        options?: I_GraphQLOptions<GetCategoryWithSubClusterCodeQuery, I_Category>,
    ) => {
        return this.graphqlService.query<
            GetCategoryWithSubClusterCodeQuery,
            GetCategoryWithSubClusterCodeQueryVariables,
            I_Category
        >(this.getCategoryWithSubClusterCodeGQL, variables, {
            normalize: (data) => ({
                ...data.category,
                status: data.category.status,
            }),
            ...options,
        }) as Promise<I_Category>;
    };

    getCategories = (
        variables?: GetCategoriesQueryVariables,
        options?: I_GraphQLOptions<GetCategoriesQuery, I_TableState<I_Category>>,
    ) => {
        return this.graphqlService.query<GetCategoriesQuery, GetCategoriesQueryVariables, I_TableState<I_Category>>(
            this.getCategoriesGQL,
            variables,
            {
                normalize: (data) => this.normalizeCategoryList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Category>>;
    };

    getCategoriesWithSubClusterCode = (
        variables?: GetCategoriesWithSubClusterCodeQueryVariables,
        options?: I_GraphQLOptions<GetCategoriesWithSubClusterCodeQuery, I_TableState<I_Category>>,
    ) => {
        return this.graphqlService.query<
            GetCategoriesWithSubClusterCodeQuery,
            GetCategoriesWithSubClusterCodeQueryVariables,
            I_TableState<I_Category>
        >(this.getCategoriesWithSubClusterCodeGQL, variables, {
            normalize: (data) => this.normalizeCategoryList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_Category>>;
    };

    createCategory = (
        variables?: CreateCategoryMutationVariables,
        options?: I_GraphQLOptions<CreateCategoryMutation, { categoryCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateCategoryMutation,
            CreateCategoryMutationVariables,
            { categoryCreate: I_MutationResponse }
        >(this.createCategoryGQL, variables, options);
    };

    updateCategory = (
        variables?: UpdateCategoryMutationVariables,
        options?: I_GraphQLOptions<UpdateCategoryMutation, { categoryUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateCategoryMutation,
            UpdateCategoryMutationVariables,
            { categoryUpdate: I_MutationResponse }
        >(this.updateCategoryGQL, variables, options);
    };

    updateCategoryStatus = (
        variables?: UpdateCategoryStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateCategoryStatusMutation, { categoryUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateCategoryStatusMutation,
            UpdateCategoryStatusMutationVariables,
            { categoryUpdateStatus: I_MutationResponse }
        >(this.updateCategoryStatusGQL, variables, options);
    };
    // #endregion

    // #region EMAIL TEMPLATE
    private normalizeEmailTemplateList = (
        data: GetEmailTemplatesQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_EmailTemplate> => {
        return normalizeWithPagination<I_EmailTemplate>(data.emailTemplates, extra);
    };

    getEmailTemplate = (
        variables?: GetEmailTemplateQueryVariables,
        options?: I_GraphQLOptions<GetEmailTemplateQuery, I_EmailTemplate>,
    ) => {
        return this.graphqlService.query<GetEmailTemplateQuery, GetEmailTemplateQueryVariables, I_EmailTemplate>(
            this.getEmailTemplateGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.emailTemplate,
                    itemCode: data.emailTemplate.itemCode,
                    status: data.emailTemplate.status,
                    variables: data.emailTemplate.variables,
                    created: new Date(data.emailTemplate.created),
                    updated: new Date(data.emailTemplate.updated),
                }),
                ...options,
            },
        ) as Promise<I_EmailTemplate>;
    };

    getEmailTemplates = (
        variables?: GetEmailTemplatesQueryVariables,
        options?: I_GraphQLOptions<GetEmailTemplatesQuery, I_TableState<I_EmailTemplate>>,
    ) => {
        return this.graphqlService.query<
            GetEmailTemplatesQuery,
            GetEmailTemplatesQueryVariables,
            I_TableState<I_EmailTemplate>
        >(this.getEmailTemplatesGQL, variables, {
            normalize: (data) => this.normalizeEmailTemplateList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_EmailTemplate>>;
    };

    createEmailTemplate = (
        variables?: CreateEmailTemplatesMutationVariables,
        options?: I_GraphQLOptions<CreateEmailTemplatesMutation, { emailTemplatesCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateEmailTemplatesMutation,
            CreateEmailTemplatesMutationVariables,
            { emailTemplatesCreate: I_MutationResponse }
        >(this.createEmailTemplatesGQL, variables, options);
    };

    updateEmailTemplate = (
        variables?: UpdateEmailTemplatesMutationVariables,
        options?: I_GraphQLOptions<UpdateEmailTemplatesMutation, { emailTemplatesUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateEmailTemplatesMutation,
            UpdateEmailTemplatesMutationVariables,
            { emailTemplatesUpdate: I_MutationResponse }
        >(this.updateEmailTemplatesGQL, variables, options);
    };

    updateEmailTemplateStatus = (
        variables?: UpdateEmailTemplatesStatusMutationVariables,
        options?: I_GraphQLOptions<
            UpdateEmailTemplatesStatusMutation,
            { emailTemplatesUpdateStatus: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateEmailTemplatesStatusMutation,
            UpdateEmailTemplatesStatusMutationVariables,
            { emailTemplatesUpdateStatus: I_MutationResponse }
        >(this.updateEmailTemplatesStatusGQL, variables, options);
    };
    // #endregion

    // #region PROMOTION
    private normalizePromotionList = (
        data: GetPromotionsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_Promotion> => {
        return normalizeWithPagination<I_Promotion>(data.promotions, extra);
    };

    getPromotion = (
        variables?: GetPromotionQueryVariables,
        options?: I_GraphQLOptions<GetPromotionQuery, I_Promotion>,
    ) => {
        return this.graphqlService.query<GetPromotionQuery, GetPromotionQueryVariables, I_Promotion>(
            this.getPromotionGQL,
            variables,
            {
                normalize: (data) => ({
                    ...data.promotion,
                    status: data.promotion.status,
                }),
                ...options,
            },
        ) as Promise<I_Promotion>;
    };

    getPromotions = (
        variables?: GetPromotionsQueryVariables,
        options?: I_GraphQLOptions<GetPromotionsQuery, I_TableState<I_Promotion>>,
    ) => {
        return this.graphqlService.query<GetPromotionsQuery, GetPromotionsQueryVariables, I_TableState<I_Promotion>>(
            this.getPromotionsGQL,
            variables,
            {
                normalize: (data) => this.normalizePromotionList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Promotion>>;
    };

    createPromotion = (
        variables?: CreatePromotionMutationVariables,
        options?: I_GraphQLOptions<CreatePromotionMutation, { promotionCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreatePromotionMutation,
            CreatePromotionMutationVariables,
            { promotionCreate: I_MutationResponse }
        >(this.createPromotionGQL, variables, options);
    };

    updatePromotion = (
        variables?: UpdatePromotionMutationVariables,
        options?: I_GraphQLOptions<UpdatePromotionMutation, { promotionUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdatePromotionMutation,
            UpdatePromotionMutationVariables,
            { promotionUpdate: I_MutationResponse }
        >(this.updatePromotionGQL, variables, options);
    };

    updatePromotionStatus = (
        variables?: UpdatePromotionStatusMutationVariables,
        options?: I_GraphQLOptions<UpdatePromotionStatusMutation, { promotionUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdatePromotionStatusMutation,
            UpdatePromotionStatusMutationVariables,
            { promotionUpdateStatus: I_MutationResponse }
        >(this.updatePromotionStatusGQL, variables, options);
    };

    getPromotionResults = (
        variables?: GetPromotionResultsQueryVariables,
        options?: I_GraphQLOptions<GetPromotionResultsQuery, I_TableState<{ promotion: I_Promotion }>>,
    ) => {
        return this.graphqlService.query<
            GetPromotionResultsQuery,
            GetPromotionResultsQueryVariables,
            I_TableState<{ promotion: I_Promotion }>
        >(this.getPromotionResultsGQL, variables, {
            normalize: (data) => normalizeWithPagination(data.promotionResults, options?.extra),
            ...options,
        }) as Promise<I_TableState<{ promotion: I_Promotion }>>;
    };
    // #endregion

    private normalizePromotionHistory = (
        data: GetPromotionHistoriesQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_PromotionHistory> => {
        return normalizeWithPagination<I_PromotionHistory>(data.promotionHistories, extra);
    };

    getPromotionHistories = (
        variables?: GetPromotionHistoriesQueryVariables,
        options?: I_GraphQLOptions<GetPromotionHistoriesQuery, I_TableState<I_PromotionHistory>>,
    ) => {
        return this.graphqlService.query<
            GetPromotionHistoriesQuery,
            GetPromotionHistoriesQueryVariables,
            I_TableState<I_PromotionHistory>
        >(this.getPromotionHistoriesGQL, variables, {
            normalize: (data) => this.normalizePromotionHistory(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_PromotionHistory>>;
    };

    getPromotionHistory = (
        variables?: GetPromotionHistoryQueryVariables,
        options?: I_GraphQLOptions<GetPromotionHistoryQuery, I_PromotionHistory>,
    ) => {
        return this.graphqlService.query<
            GetPromotionHistoryQuery,
            GetPromotionHistoryQueryVariables,
            I_PromotionHistory
        >(this.getPromotionHistoryGQL, variables, {
            normalize: (data) => ({
                ...data.promotionHistory,
            }),
            ...options,
        }) as Promise<I_PromotionHistory>;
    };
    // #region VOUCHER
    private normalizeVoucherList = (data: GetVouchersQuery, extra?: I_NormalizeExtra): I_TableState<I_Voucher> => {
        return normalizeWithPagination<I_Voucher>(data.vouchers, extra);
    };

    getVoucher = (variables?: GetVoucherQueryVariables, options?: I_GraphQLOptions<GetVoucherQuery, I_Voucher>) => {
        return this.graphqlService.query<GetVoucherQuery, GetVoucherQueryVariables, I_Voucher>(
            this.getVoucherGQL,
            variables,
            {
                normalize: (data) => data.voucher,
                ...options,
            },
        ) as Promise<I_Voucher>;
    };

    getVouchers = (
        variables?: GetVouchersQueryVariables,
        options?: I_GraphQLOptions<GetVouchersQuery, I_TableState<I_Voucher>>,
    ) => {
        return this.graphqlService.query<GetVouchersQuery, GetVouchersQueryVariables, I_TableState<I_Voucher>>(
            this.getVouchersGQL,
            variables,
            {
                normalize: (data) => this.normalizeVoucherList(data, options?.extra),
                ...options,
            },
        ) as Promise<I_TableState<I_Voucher>>;
    };

    createVoucher = (
        variables?: CreateVoucherMutationVariables,
        options?: I_GraphQLOptions<CreateVoucherMutation, { voucherCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateVoucherMutation,
            CreateVoucherMutationVariables,
            { voucherCreate: I_MutationResponse }
        >(this.createVoucherGQL, variables, options);
    };

    updateVoucher = (
        variables?: UpdateVoucherMutationVariables,
        options?: I_GraphQLOptions<UpdateVoucherMutation, { voucherUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateVoucherMutation,
            UpdateVoucherMutationVariables,
            { voucherUpdate: I_MutationResponse }
        >(this.updateVoucherGQL, variables, options);
    };

    updateVoucherStatus = (
        variables?: UpdateVoucherStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateVoucherStatusMutation, { voucherUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateVoucherStatusMutation,
            UpdateVoucherStatusMutationVariables,
            { voucherUpdateStatus: I_MutationResponse }
        >(this.updateVoucherStatusGQL, variables, options);
    };
    // #region WarrantyTerm
    private normalizeWarrantyTermList = (
        data: GetWarrantyTermsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_WarrantyTerm> => {
        return normalizeWithPagination<I_WarrantyTerm>(data.warrantyTerms, extra);
    };

    getWarrantyTerm = (
        variables?: GetWarrantyTermQueryVariables,
        options?: I_GraphQLOptions<GetWarrantyTermQuery, I_WarrantyTerm>,
    ) => {
        return this.graphqlService.query<GetWarrantyTermQuery, GetWarrantyTermQueryVariables, I_WarrantyTerm>(
            this.getWarrantyTermGQL,
            variables,
            {
                normalize: (data) => data.warrantyTerm,
                ...options,
            },
        ) as Promise<I_WarrantyTerm>;
    };

    getWarrantyTerms = (
        variables?: GetWarrantyTermsQueryVariables,
        options?: I_GraphQLOptions<GetWarrantyTermsQuery, I_TableState<I_WarrantyTerm>>,
    ) => {
        return this.graphqlService.query<
            GetWarrantyTermsQuery,
            GetWarrantyTermsQueryVariables,
            I_TableState<I_WarrantyTerm>
        >(this.getWarrantyTermsGQL, variables, {
            normalize: (data) => this.normalizeWarrantyTermList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_WarrantyTerm>>;
    };

    createWarrantyTerm = (
        variables?: CreateWarrantyTermMutationVariables,
        options?: I_GraphQLOptions<CreateWarrantyTermMutation, { warrantyTermCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateWarrantyTermMutation,
            CreateWarrantyTermMutationVariables,
            { warrantyTermCreate: I_MutationResponse }
        >(this.createWarrantyTermGQL, variables, options);
    };

    updateWarrantyTerm = (
        variables?: UpdateWarrantyTermMutationVariables,
        options?: I_GraphQLOptions<UpdateWarrantyTermMutation, { warrantyTermUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateWarrantyTermMutation,
            UpdateWarrantyTermMutationVariables,
            { warrantyTermUpdate: I_MutationResponse }
        >(this.updateWarrantyTermGQL, variables, options);
    };

    updateWarrantyTermStatus = (
        variables?: UpdateWarrantyTermStatusMutationVariables,
        options?: I_GraphQLOptions<UpdateWarrantyTermStatusMutation, { warrantyTermUpdateStatus: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateWarrantyTermStatusMutation,
            UpdateWarrantyTermStatusMutationVariables,
            { warrantyTermUpdateStatus: I_MutationResponse }
        >(this.updateWarrantyTermStatusGQL, variables, options);
    };

    // #region BuyerClubVoucher
    private normalizeBuyerClubVoucherList = (
        data: GetBuyerClubVouchersQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_BuyerClubVoucher> => {
        return normalizeWithPagination<I_BuyerClubVoucher>(data.buyerClubVouchers, extra);
    };

    getBuyerClubVoucher = (
        variables?: GetBuyerClubVoucherQueryVariables,
        options?: I_GraphQLOptions<GetBuyerClubVoucherQuery, I_BuyerClubVoucher>,
    ) => {
        return this.graphqlService.query<
            GetBuyerClubVoucherQuery,
            GetBuyerClubVoucherQueryVariables,
            I_BuyerClubVoucher
        >(this.getBuyerClubVoucherGQL, variables, {
            normalize: (data) => data.buyerClubVoucher,
            ...options,
        }) as Promise<I_BuyerClubVoucher>;
    };

    getBuyerClubVouchers = (
        variables?: GetBuyerClubVouchersQueryVariables,
        options?: I_GraphQLOptions<GetBuyerClubVouchersQuery, I_TableState<I_BuyerClubVoucher>>,
    ) => {
        return this.graphqlService.query<
            GetBuyerClubVouchersQuery,
            GetBuyerClubVouchersQueryVariables,
            I_TableState<I_BuyerClubVoucher>
        >(this.getBuyerClubVouchersGQL, variables, {
            normalize: (data) => this.normalizeBuyerClubVoucherList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_BuyerClubVoucher>>;
    };

    createBuyerClubVoucher = (
        variables?: CreateBuyerClubVoucherMutationVariables,
        options?: I_GraphQLOptions<CreateBuyerClubVoucherMutation, { buyerClubVoucherCreate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            CreateBuyerClubVoucherMutation,
            CreateBuyerClubVoucherMutationVariables,
            { buyerClubVoucherCreate: I_MutationResponse }
        >(this.createBuyerClubVoucherGQL, variables, options);
    };

    updateBuyerClubVoucher = (
        variables?: UpdateBuyerClubVoucherMutationVariables,
        options?: I_GraphQLOptions<UpdateBuyerClubVoucherMutation, { buyerClubVoucherUpdate: I_MutationResponse }>,
    ) => {
        return this.graphqlService.mutate<
            UpdateBuyerClubVoucherMutation,
            UpdateBuyerClubVoucherMutationVariables,
            { buyerClubVoucherUpdate: I_MutationResponse }
        >(this.updateBuyerClubVoucherGQL, variables, options);
    };

    updateBuyerClubVoucherStatus = (
        variables?: UpdateBuyerClubVoucherStatusMutationVariables,
        options?: I_GraphQLOptions<
            UpdateBuyerClubVoucherStatusMutation,
            { buyerClubVoucherUpdateStatus: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateBuyerClubVoucherStatusMutation,
            UpdateBuyerClubVoucherStatusMutationVariables,
            { buyerClubVoucherUpdateStatus: I_MutationResponse }
        >(this.updateBuyerClubVoucherStatusGQL, variables, options);
    };
    // #region SetProductAdvertisement
    private normalizeSetProductAdvertisementList = (
        data: GetSetProductAdvertisementsQuery,
        extra?: I_NormalizeExtra,
    ): I_TableState<I_SetProductAdvertisement> => {
        return normalizeWithPagination<I_SetProductAdvertisement>(data.setProductAdvertisements, extra);
    };

    getSetProductAdvertisement = (
        variables?: GetSetProductAdvertisementQueryVariables,
        options?: I_GraphQLOptions<GetSetProductAdvertisementQuery, I_SetProductAdvertisement>,
    ) => {
        return this.graphqlService.query<
            GetSetProductAdvertisementQuery,
            GetSetProductAdvertisementQueryVariables,
            I_SetProductAdvertisement
        >(this.getSetProductAdvertisementGQL, variables, {
            normalize: (data) => data.setProductAdvertisement,
            ...options,
        }) as Promise<I_SetProductAdvertisement>;
    };

    getSetProductAdvertisements = (
        variables?: GetSetProductAdvertisementsQueryVariables,
        options?: I_GraphQLOptions<GetSetProductAdvertisementsQuery, I_TableState<I_SetProductAdvertisement>>,
    ) => {
        return this.graphqlService.query<
            GetSetProductAdvertisementsQuery,
            GetSetProductAdvertisementsQueryVariables,
            I_TableState<I_SetProductAdvertisement>
        >(this.getSetProductAdvertisementsGQL, variables, {
            normalize: (data) => this.normalizeSetProductAdvertisementList(data, options?.extra),
            ...options,
        }) as Promise<I_TableState<I_SetProductAdvertisement>>;
    };

    createSetProductAdvertisement = (
        variables?: CreateSetProductAdvertisementMutationVariables,
        options?: I_GraphQLOptions<
            CreateSetProductAdvertisementMutation,
            { setProductAdvertisementCreate: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            CreateSetProductAdvertisementMutation,
            CreateSetProductAdvertisementMutationVariables,
            { setProductAdvertisementCreate: I_MutationResponse }
        >(this.createSetProductAdvertisementGQL, variables, options);
    };

    updateSetProductAdvertisement = (
        variables?: UpdateSetProductAdvertisementMutationVariables,
        options?: I_GraphQLOptions<
            UpdateSetProductAdvertisementMutation,
            { setProductAdvertisementUpdate: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateSetProductAdvertisementMutation,
            UpdateSetProductAdvertisementMutationVariables,
            { setProductAdvertisementUpdate: I_MutationResponse }
        >(this.updateSetProductAdvertisementGQL, variables, options);
    };

    updateSetProductAdvertisementStatus = (
        variables?: UpdateSetProductAdvertisementStatusMutationVariables,
        options?: I_GraphQLOptions<
            UpdateSetProductAdvertisementStatusMutation,
            { setProductAdvertisementUpdateStatus: I_MutationResponse }
        >,
    ) => {
        return this.graphqlService.mutate<
            UpdateSetProductAdvertisementStatusMutation,
            UpdateSetProductAdvertisementStatusMutationVariables,
            { setProductAdvertisementUpdateStatus: I_MutationResponse }
        >(this.updateSetProductAdvertisementStatusGQL, variables, options);
    };
}
