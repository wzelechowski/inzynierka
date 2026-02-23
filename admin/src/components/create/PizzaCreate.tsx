import { 
    Create, SimpleForm, TextInput, SelectInput, 
    ReferenceArrayInput, SelectArrayInput, required, 
    ArrayInput,
    SimpleFormIterator,
    ReferenceInput,
    NumberInput
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

    <ArrayInput source="ingredientList" label="Składniki">
                <SimpleFormIterator inline>
                    <ReferenceInput source="ingredientId" reference="ingredients" label="Składnik">
                        <SelectInput optionText="name" validate={required()} />
                    </ReferenceInput>
                    
                    <NumberInput 
                        source="quantity" 
                        label="Ilość (np. 1.0)" 
                        defaultValue={1.0} 
                        validate={required()} 
                    />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Create>
);