import type { ItemType } from "./enums";

export interface MenuItemResponse {
    id: string;
    itemId: string;
    type: ItemType;
    name: string;
    description: string;
    basePrice: number;
    isAvailable: boolean;
}

export interface MenuItemRequest {
    itemId: string;
    type: ItemType;
    name: string;
    description: string;
    basePrice: number;
    isAvailable: boolean;
}