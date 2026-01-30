import { Show, SimpleShowLayout, TextField } from 'react-admin';

export const PizzaShow = () => (
    <Show title="Szczegóły Pizzy">
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" label="Nazwa" sx={{ fontSize: '1.5em', fontWeight: 'bold' }} />
            <TextField source="pizzaSize" label="Rozmiar" />
        </SimpleShowLayout>
    </Show>
);