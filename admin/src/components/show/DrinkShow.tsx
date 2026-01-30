import { Show, SimpleShowLayout, TextField, NumberField } from 'react-admin';

export const DrinkShow = () => (
    <Show title="Szczegóły Napoju">
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" label="Nazwa" sx={{ fontSize: '1.5em', fontWeight: 'bold' }} />
            <NumberField source="volume" label="Pojemność" />
            <NumberField source="price" label="Cena bazowa" options={{ style: 'currency', currency: 'PLN' }} />
        </SimpleShowLayout>
    </Show>
);