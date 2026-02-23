import { EffectType, ProposalProductRole } from './enums';

export interface PromotionResponse {
    id: string;
    name: string;
    active: boolean;
    startDate: string;
    endDate: string;
    discount: number;
    effectType: EffectType;
    proposal?: PromotionProposalResponse;
}

export interface PromotionProposalResponse {
    effectType: EffectType;
    support: number;
    confidence: number;
    lift: number;
    score: number;
    reason: string;
    discount: number;
    products: PromotionProposalProductResponse[];
}

export interface PromotionProposalProductResponse {
    proposalId: string;
    productId: string;
    role: ProposalProductRole;
}
