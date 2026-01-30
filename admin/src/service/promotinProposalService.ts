import { api as axiosInstance } from '../api/api';
import type { PromotionProposalRequest, PromotionProposalResponse } from '../types/promotion';

export const PromotionProposalService = {
    
    getAll: async (): Promise<PromotionProposalResponse[]> => {
        const response = await axiosInstance.get<PromotionProposalResponse[]>('/promotion/promotionProposal/'); 
        return response.data;
    },

    getOne: async (id: string): Promise<PromotionProposalResponse | null> => {
        const response = await axiosInstance.get<PromotionProposalResponse>(`/promotion/promotionProposal/${id}`);
        return response.data;
    },
    
    update: async (id: string, data: PromotionProposalRequest) => {
        const response = await axiosInstance.put(`/promotion/promotionProposal/${id}`, data);
        return response.data;
    },
    
    create: async (data: PromotionProposalRequest) => {
        const response = await axiosInstance.post(`/promotion/promotionProposal`, data);
        return response.data;
    },

    delete: async(id: string): Promise<void> => {
        const response = await axiosInstance.delete(`/promotion/promotionProposal/${id}`);
        return response.data;
    }
};