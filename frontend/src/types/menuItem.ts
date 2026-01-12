import { ItemType } from "./enums";

export interface MenuItemResponse {
    id: String;
    itemId: String;
    type: ItemType;
    name: String;
    description: String;
    basePrice: number;
    isAvailable: Boolean;
}