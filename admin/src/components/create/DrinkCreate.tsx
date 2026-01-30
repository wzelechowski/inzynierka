import { Create, SimpleForm, TextInput, NumberInput, required } from 'react-admin';

export const DrinkCreate = () => (
    <Create title="Dodaj nowy napój" redirect="list">
        <SimpleForm>
            <TextInput source="name" label="Nazwa napoju" validate={required()} fullWidth />
            <NumberInput 
                source="volume" 
                label="Pojemność (l)" 
                step={0.1} 
            />
        </SimpleForm>
    </Create>
);