import { 
    Create, SimpleForm, TextInput, PasswordInput, 
    SelectArrayInput, required, email, minLength 
} from 'react-admin';

const roleChoices = [
    { id: 'CLIENT', name: 'Klient' },
    { id: 'SUPPLIER', name: 'Dostawca' },
];

export const UserProfileCreate = () => (
    <Create title="Nowy Użytkownik" redirect="show">
        <SimpleForm>
            <TextInput source="firstName" label="Imię" validate={required()} />
            <TextInput source="lastName" label="Nazwisko" validate={required()} />
            <TextInput source="phoneNumber" label="Telefon" />
            <TextInput 
                source="email" 
                label="Email" 
                type="email" 
                validate={[required(), email()]} 
                fullWidth
            />
            
            <PasswordInput 
                source="password" 
                label="Hasło" 
                validate={[required(), minLength(6)]} 
                fullWidth
            />
            <SelectArrayInput 
                source="roles" 
                label="Role systemowe" 
                choices={roleChoices} 
                defaultValue={['CLIENT']}
                validate={required()}
            />

        </SimpleForm>
    </Create>
);