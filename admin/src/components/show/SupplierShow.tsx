import { 
    Show, SimpleShowLayout, TextField, 
    ChipField, ReferenceField 
} from 'react-admin';

export const SupplierShow = () => (
    <Show title="Szczegóły Dostawcy">
        <SimpleShowLayout>
            <TextField source="id" label="ID Dostawcy" />
            <ReferenceField 
                source="userProfileId" 
                reference="users" 
                label="Powiązane Konto Użytkownika"
                link="show"
            >
            <TextField source="id" />
            </ReferenceField>
            <TextField source="firstName" label="Imię" />
            <TextField source="lastName" label="Nazwisko" />
            <TextField source="phoneNumber" label="Telefon" />
            <ChipField source="status" label="Status" />
        </SimpleShowLayout>
    </Show>
);