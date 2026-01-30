import { 
    Edit, NumberInput, SimpleForm, TextInput, required} from 'react-admin';

const transform = (data: any) => {
    const { name, volume } = data;

    return {
        name,
        volume
    };
};

export const DrinkEdit = () => (
    <Edit title="Edycja Napoju" transform={transform}>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="name" label="Nazwa" validate={required()} fullWidth />
            <NumberInput 
                source="volume" 
                label="Pojemność (l)" 
                step={0.1} 
            />
        </SimpleForm>
    </Edit>
);