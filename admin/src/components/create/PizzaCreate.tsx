import { 
    Create, SimpleForm, TextInput, SelectInput, 
    ReferenceArrayInput, SelectArrayInput, required 
} from 'react-admin';

export const PizzaCreate = () => (
    <Create title="Stwórz nową pizzę" redirect="list">
        <SimpleForm>
            <TextInput source="name" label="Nazwa Pizzy" validate={required()} fullWidth />
            
            <SelectInput 
                source="pizzaSize" 
                label="Rozmiar" 
                validate={required()}
                choices={[
                    { id: 'S', name: 'Mała (30cm)' },
                    { id: 'M', name: 'Średnia (40cm)' },
                    { id: 'L', name: 'Duża (50cm)' },
                    { id: 'XL', name: 'XXL (60cm)' },
                ]} 
            />

            <ReferenceArrayInput source="ingredientIds" reference="ingredients" label="Składniki">
                <SelectArrayInput optionText="name" />
            </ReferenceArrayInput>
        </SimpleForm>
    </Create>
);