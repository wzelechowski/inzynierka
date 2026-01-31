import { Create, SimpleForm, TextInput, NumberInput, required } from 'react-admin';
import { Typography } from '@mui/material';

export const IngredientCreate = () => (
    <Create title="Dodaj nowy składnik" redirect="list">
        <SimpleForm>
            <Typography variant="h6" gutterBottom>Dane składnika</Typography>
            <TextInput source="name" label="Nazwa" validate={required()} fullWidth />
            <NumberInput 
                source="weight" 
                label="Waga (kg)" 
                min={0} 
                step={0.01} 
                validate={required()} 
            />
        </SimpleForm>
    </Create>
);