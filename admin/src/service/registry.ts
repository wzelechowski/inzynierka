import { type ResourceService } from './base';
import { MenuItemService } from '../service/menuItemService';
import { PromotionService } from '../service/promotionService'
import { SupplierService } from '../service/supplierService';
import { PizzaService } from '../service/pizzaService';
import { DrinkService } from '../service/drinkService';
import { ExtraService } from '../service/extraService';
import { DeliveryService } from './deliveryService';
import { UserService } from './userService';
import { OrderService } from './orderService';
import { PromotionProposalService } from './promotinProposalService';
import { IngredientService } from './ingredientService';

export const services: Record<string, ResourceService> = {
    pizzas: PizzaService,
    drinks: DrinkService,
    extras: ExtraService,
    menuItems: MenuItemService, 
    ingredients: IngredientService,
    orders: OrderService,
    users: UserService,
    deliveries: DeliveryService,
    promotions: PromotionService,
    promotionProposals: PromotionProposalService,
    suppliers: SupplierService,
};

export const getService = (resource: string): ResourceService => {
    const service = services[resource];
    if (!service) {
        throw new Error(`Brak serwisu dla: ${resource}`);
    }
    return service;
};