import type { PizzaSize } from './enums'

export interface PizzaResponse {
    id: string;
    name: string;
    pizzaSize: PizzaSize;
}

export interface DrinkResponse {
    id: string;
    name: string;
    volume: number;
}

export interface ExtraResponse {
    id: string;
    name: string;
    weight: number;
}