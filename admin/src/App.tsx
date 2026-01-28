// src/App.tsx
import { Admin, Resource } from 'react-admin';
import { authProvider } from './authProvider';
import { dataProvider } from './dataProvider';
import LoginPage from './LoginPage';
import { 
    PizzaList, DrinkList, IngredientList, 
    OrderList, DeliveryList, SupplierList, 
    UserList, PromotionList, 
    MenuItemList, ExtraList,
    PromotionProposalList
} from './Lists';
import { OrderShow } from './components/OrdersShow';
import { PizzaShow } from './components/PizzaShow';
import { DrinkShow } from './components/DrinkShow';
import { ExtraShow } from './components/ExtraShow';
import { PromotionShow } from './components/PromotionShow';
import { PromotionProposalShow } from './components/PromotionProposalShow';

export const App = () => (
    <Admin 
        authProvider={authProvider} 
        dataProvider={dataProvider}
        loginPage={LoginPage}
    >
        <Resource name="pizzas" list={PizzaList} options={{ label: 'Pizza' }} show={PizzaShow} />
        <Resource name="drinks" list={DrinkList} options={{ label: 'Napoje' }} show={DrinkShow} />
        <Resource name="extras" list={ExtraList} options={{ label: 'Dodatki' }} show={ExtraShow} />
        <Resource name="ingredients" list={IngredientList} options={{ label: 'Składniki' }} />
        <Resource name="menuItems" list={MenuItemList} options={{ label: 'Menu Items'}} />

        {/* SEKCJA ZAMÓWIENIA */}
        <Resource name="orders" list={OrderList} options={{ label: 'Zamówienia' }} show={OrderShow} />
        
        {/* SEKCJA DOSTAWA */}
        <Resource name="deliveries" list={DeliveryList} options={{ label: 'Dostawy' }} />
        <Resource name="suppliers" list={SupplierList} options={{ label: 'Kierowcy' }} />

        {/* SEKCJA UŻYTKOWNICY */}
        <Resource name="users" list={UserList} options={{ label: 'Klienci' }} />

        {/* SEKCJA PROMOCJE */}
        <Resource name="promotions" list={PromotionList} options={{ label: 'Promocje' }} show={PromotionShow} />
        <Resource name="promotionProposals" list={PromotionProposalList} options={{ label: 'Propozycje pormocji' }} show={PromotionProposalShow} />
    </Admin>
);