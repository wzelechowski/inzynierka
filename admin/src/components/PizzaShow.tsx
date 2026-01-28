import { Show, SimpleShowLayout, TextField, NumberField, ArrayField, Datagrid, ChipField } from 'react-admin';

export const PizzaShow = () => (
    <Show title="Szczegóły Pizzy">
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" label="Nazwa" sx={{ fontSize: '1.5em', fontWeight: 'bold' }} />
            <TextField source="pizzaSize" label="Rozmiar" />
            
            {/* Jeśli pizza ma listę składników (zależnie od Twojego API) */}
            {/* <ArrayField source="ingredients" label="Składniki">
                <Datagrid bulkActionButtons={false}>
                    <TextField source="name" />
                </Datagrid>
            </ArrayField> */}
        </SimpleShowLayout>
    </Show>
);