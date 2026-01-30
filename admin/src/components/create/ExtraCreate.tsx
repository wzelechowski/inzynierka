import { Create, SimpleForm, TextInput, NumberInput, required } from 'react-admin';

export const ExtraCreate = () => (
    <Create title="Dodaj nowy dodatek" redirect="list">
        <SimpleForm>
            <TextInput source="name" label="Nazwa dodatku" validate={required()} fullWidth />
            <NumberInput 
                source="weight" 
                label="waga (kg)" 
                step={0.1} 
            />
        </SimpleForm>
    </Create>
);