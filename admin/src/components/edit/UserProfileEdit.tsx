import { 
    Edit, SimpleForm, TextInput, 
    SelectArrayInput, required 
} from 'react-admin';

const roleChoices = [
    { id: 'ADMIN', name: 'Administrator' },
    { id: 'CLIENT', name: 'Klient' },
    { id: 'SUPPLIER', name: 'Dostawca' },
];

const transform = (data: any) => {
    return {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber
    };
};

export const UserProfileEdit = () => (
    <Edit title="Edycja Profilu Użytkownika" transform={transform}>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="email" disabled />
            <TextInput source="firstName" label="Imię" validate={required()} />
            <TextInput source="lastName" label="Nazwisko" validate={required()} />
            <TextInput source="phoneNumber" label="Telefon" />
            <SelectArrayInput 
                source="roles" 
                label="Role systemowe (Brak możliwości edycji)" 
                choices={roleChoices} 
                disabled 
            />
        </SimpleForm>
    </Edit>
);