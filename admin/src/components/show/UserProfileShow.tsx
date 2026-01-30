import { Chip } from '@mui/material';
import { 
    Show, SimpleShowLayout, TextField, 
    EmailField, ArrayField, SingleFieldList,
    TopToolbar, EditButton,
    FunctionField
} from 'react-admin';

const UserProfileShowActions = () => (
    <TopToolbar>
        <EditButton />
    </TopToolbar>
);

export const UserProfileShow = () => (
    <Show title="Szczegóły Użytkownika" actions={<UserProfileShowActions />}>
        <SimpleShowLayout>
            <TextField source="id" label="ID Profilu" />
            <TextField source="firstName" label="Imię" />
            <TextField source="lastName" label="Nazwisko" />
            <EmailField source="email" label="Email" />
            <TextField source="phoneNumber" label="Telefon" />
            
            <ArrayField source="roles" label="Role systemowe">
                <SingleFieldList linkType={false}>
                    <FunctionField 
                        render={(record: any) => {
                            const label = typeof record === 'string' ? record : JSON.stringify(record);
                            
                            return (
                                <Chip 
                                    label={label} 
                                    size="small" 
                                    variant="outlined"
                                />
                            );
                        }} 
                    />
                </SingleFieldList>
            </ArrayField>

        </SimpleShowLayout>
    </Show>
);