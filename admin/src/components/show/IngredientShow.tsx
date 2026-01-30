import { Show, SimpleShowLayout, TextField, NumberField } from 'react-admin';

export const IngredientShow = () => (
    <Show title="Szczegóły Składników">
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" label="Nazwa" sx={{ fontSize: '1.5em', fontWeight: 'bold' }} />
            <NumberField source="weight" label="Waga" />
        </SimpleShowLayout>
    </Show>
);