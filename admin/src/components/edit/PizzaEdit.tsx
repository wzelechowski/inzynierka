import { 
    Edit, SelectInput, SimpleForm, TextInput, required} from 'react-admin';

const transform = (data: any) => {
    const { name, pizzaSize } = data;

    return {
        name,
        pizzaSize
    };
};

export const PizzaEdit = () => (
    <Edit title="Edycja Pizzy" transform={transform}>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="name" label="Nazwa" validate={required()} fullWidth />
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

        </SimpleForm>
    </Edit>
);