import { Admin, Resource, defaultTheme } from 'react-admin';
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
import { OrderShow } from './components/show/OrderShow';
import { PizzaShow } from './components/show/PizzaShow';
import { DrinkShow } from './components/show/DrinkShow';
import { ExtraShow } from './components/show/ExtraShow';
import { PromotionShow } from './components/show/PromotionShow';
import { PromotionProposalShow } from './components/panel/PromotionProposalShow';
import { PizzaCreate } from './components/create/PizzaCreate';
import { PromotionCreate } from './components/create/PromotionCreate';
import { DrinkCreate } from './components/create/DrinkCreate';
import { IngredientCreate } from './components/create/IngredientCreate';
import { ExtraCreate } from './components/create/ExtraCreate';
import { MenuItemCreate } from './components/create/MenuItemCreate';
import { PromotionProposalCreate } from './components/create/PromotionProposalCreate';
import { OrderCreate } from './components/create/OrderCreate';
import { UserProfileShow } from './components/show/UserProfileShow';
import { UserProfileCreate } from './components/create/UserProfileCreate';
import { UserProfileEdit } from './components/edit/UserProfileEdit';
import { PizzaEdit } from './components/edit/PizzaEdit';
import { DrinkEdit } from './components/edit/DrinkEdit';
import { ExtraEdit } from './components/edit/ExtraEdit';
import { IngredientShow } from './components/show/IngredientShow';
import { IngredientEdit } from './components/edit/IngredientEdit';
import { MenuItemShow } from './components/show/MenuItemShow';
import { MenuItemEdit } from './components/edit/MenuItemEdit';
import { OrderEdit } from './components/edit/OrderEdit';
import { DeliveryShow } from './components/show/DeliveryShow';
import { DeliveryEdit } from './components/edit/DeliveryEdit';
import { SupplierShow } from './components/show/SupplierShow';

export const App = () => (
    <Admin 
        authProvider={authProvider} 
        dataProvider={dataProvider}
        loginPage={LoginPage}
        theme={defaultTheme}
        darkTheme={null}
    >
        <Resource name="pizzas" list={PizzaList} options={{ label: 'Pizza' }} show={PizzaShow} create={PizzaCreate} edit={PizzaEdit}/>
        <Resource name="drinks" list={DrinkList} options={{ label: 'Napoje' }} show={DrinkShow} create={DrinkCreate} edit={DrinkEdit}/>
        <Resource name="extras" list={ExtraList} options={{ label: 'Dodatki' }} show={ExtraShow} create={ExtraCreate} edit={ExtraEdit}/>
        <Resource name="ingredients" list={IngredientList} options={{ label: 'Składniki' }} show={IngredientShow} create={IngredientCreate} edit={IngredientEdit}/>
        <Resource name="menuItems" list={MenuItemList} options={{ label: 'Menu Items'}} show={MenuItemShow} create={MenuItemCreate} edit={MenuItemEdit} />
        <Resource name="orders" list={OrderList} options={{ label: 'Zamówienia' }} show={OrderShow} create={OrderCreate} edit={OrderEdit} />
        <Resource name="deliveries" list={DeliveryList} options={{ label: 'Dostawy' }} show={DeliveryShow} edit={DeliveryEdit}/>
        <Resource name="suppliers" list={SupplierList} options={{ label: 'Kierowcy' }} show={SupplierShow}/>
        <Resource name="users" list={UserList} options={{ label: 'Klienci' }} show={UserProfileShow} create={UserProfileCreate} edit={UserProfileEdit}/>
        <Resource name="promotions" list={PromotionList} options={{ label: 'Promocje' }} show={PromotionShow} create={PromotionCreate} />
        <Resource name="promotionProposals" list={PromotionProposalList} options={{ label: 'Propozycje pormocji' }} show={PromotionProposalShow} create={PromotionProposalCreate} />
    </Admin>
);