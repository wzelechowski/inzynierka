import { 
    Edit, SimpleForm, TextInput, 
    required, minLength, maxLength, regex,
    useRecordContext, TopToolbar, ListButton, ShowButton
} from 'react-admin';
import { Box, Typography, Card, CardContent } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const transformDeliveryRequest = (data: any, { previousData }: any) => {
    return {
        orderId: previousData.orderId,          
        deliveryAddress: data.deliveryAddress,
        deliveryCity: data.deliveryCity,
        postalCode: data.postalCode
    };
};

const DeliveryEditTitle = () => {
    const record = useRecordContext();
    return <span>Edycja Adresu Dostawy {record ? `#${record.id}` : ''}</span>;
};

const DeliveryEditActions = () => (
    <TopToolbar>
        <ShowButton />
        <ListButton />
    </TopToolbar>
);

export const DeliveryEdit = () => {
    const postalCodePattern = /^\d{2}-\d{3}$/;

    return (
        <Edit 
            title={<DeliveryEditTitle />} 
            mutationMode="pessimistic"
            transform={transformDeliveryRequest}
            actions={<DeliveryEditActions />}
            sx={{ '& .RaEdit-card': { boxShadow: 'none' } }}
        >
            <SimpleForm sx={{ p: 0 }}>
                <Card sx={{ mb: 2, width: '100%' }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <LocalShippingIcon color="primary" />
                            <Typography variant="h6">Dane Adresowe</Typography>
                        </Box>

                        <TextInput 
                            source="orderId" 
                            disabled 
                            variant="filled" 
                            fullWidth 
                            label="ID Zamówienia (Read Only)"
                            helperText="Nie można przenieść dostawy do innego zamówienia"
                        />

                        <TextInput 
                            source="deliveryAddress" 
                            label="Ulica i numer"
                            fullWidth 
                            validate={[
                                required(), 
                                minLength(2), 
                                maxLength(255)
                            ]}
                        />

                        <Box display="flex" gap={2} mt={1}>
                            <TextInput 
                                source="postalCode" 
                                label="Kod pocztowy"
                                validate={[
                                    required(), 
                                    regex(postalCodePattern, 'Musi być format XX-XXX')
                                ]}
                                sx={{ flex: 1 }}
                            />

                            <TextInput 
                                source="deliveryCity" 
                                label="Miasto"
                                validate={[
                                    required(), 
                                    minLength(2), 
                                    maxLength(255)
                                ]}
                                sx={{ flex: 2 }}
                            />
                        </Box>

                    </CardContent>
                </Card>
            </SimpleForm>
        </Edit>
    );
};