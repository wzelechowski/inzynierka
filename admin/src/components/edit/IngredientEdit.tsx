import { 
    Edit, NumberInput, SimpleForm, TextInput, required} from 'react-admin';

const transform = (data: any) => {
    const { name, weight } = data;

    return {
        name,
        weight
    };
};

export const IngredientEdit = () => (
    <Edit title="Edycja Dodatku" transform={transform}>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="name" label="Nazwa" validate={required()} fullWidth />
            <NumberInput 
                source="weight" 
                label="Waga (kg)" 
                step={0.1} 
            />
        </SimpleForm>
    </Edit>
);