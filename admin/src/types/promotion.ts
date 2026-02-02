import type { EffectType, ProposalProductRole } from './enums';

export interface PromotionResponse {
    id: string;
    name: string;
    active: boolean;
    startDate: string;
    endDate: string;
    discount: number;
    effectType: EffectType;
    proposal?: PromotionProposalResponse;
    createdAt: string;
    updatedAt: string;
}

export interface PromotionRequest {
    name: string;
    startDate: string;
    endDate: string;
    discount: number;
    effectType: EffectType;
    proposalId: string;
}

export interface PromotionProposalResponse {
    id: string;
    effectType: EffectType;
    support: number;
    confidence: number;
    lift: number;
    score: number;
    reason: string;
    discount: number;
    products: PromotionProposalProductResponse[];
    createdAt: string;
    updatedAt: string;
}

export interface PromotionProposalRequest {
    antecedents: string[];
    consequents: string[];
    effectType: EffectType;
    reason?: string;
    discount: number;
}

export interface PromotionProposalProductResponse {
    proposalId: string;
    productId: string;
    role: ProposalProductRole;
}
