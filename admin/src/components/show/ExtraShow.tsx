import { Show, SimpleShowLayout, TextField, NumberField } from 'react-admin';

export const ExtraShow = () => (
    <Show title="Szczegóły Dodatku">
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" label="Nazwa" sx={{ fontSize: '1.5em', fontWeight: 'bold' }} />
            <NumberField source="weight" label="Waga" />
        </SimpleShowLayout>
    </Show>
);