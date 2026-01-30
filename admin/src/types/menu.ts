import type { PizzaSize } from './enums'

export interface PizzaResponse {
    id: string;
    name: string;
    pizzaSize: PizzaSize;
}

export interface PizzaRequest {
    name: string;
    pizzaSize: PizzaSize;
}

export interface DrinkResponse {
    id: string;
    name: string;
    volume: number;
}

export interface DrinkRequest {
    name: string;
    volume: number;
}

export interface ExtraResponse {
    id: string;
    name: string;
    weight: number;
}

export interface ExtraRequest {
    name: string;
    weight: number;
}

export interface IngredientResponse {
    id: string;
    name: string;
    weight: number;
}

export interface IngredientRequest {
    name: string;
    weight: number;
}