import { 
    Create, SimpleForm, TextInput, NumberInput, 
    SelectInput, ArrayInput, SimpleFormIterator, 
    ReferenceInput, AutocompleteInput, required,
    FormDataConsumer
} from 'react-admin';
import { Box, Typography, Divider } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { OrderCartSummary } from '../OrderCartSummary';

const transformCreate = (data: any) => {
    const formattedItems = (data.orderItems || [])
        .filter((i: any) => i.itemId && i.quantity > 0)
        .map((i: any) => ({
            itemId: i.itemId,
            quantity: Number(i.quantity)
        }));

    const payload: any = {
        type: data.type,
        orderItems: formattedItems,
    };

    if (data.type === 'DELIVERY') {
        payload.deliveryAddress = data.deliveryAddress;
        payload.deliveryCity = data.deliveryCity;
        payload.postalCode = data.postalCode;
    }
    
    return payload;
};

export const OrderCreate = () => (
    <Create title="Nowe Zamówienie" redirect="list" transform={transformCreate}>
        <SimpleForm>
            
            <Typography variant="h6" gutterBottom>1. Typ Zamówienia</Typography>
            <SelectInput 
                source="type" 
                label="Rodzaj" 
                defaultValue="ON_SITE"
                validate={required()}
                choices={[
                    { id: 'ON_SITE', name: 'Na miejscu' },
                    { id: 'TAKE_AWAY', name: 'Na wynos' },
                    { id: 'DELIVERY', name: 'Dostawa' },
                ]}
                sx={{ width: '300px' }}
            />

            <FormDataConsumer>
                {({ formData, ...rest }) => formData.type === 'DELIVERY' && (
                    <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, mb: 3, bgcolor: '#fafafa' }}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <LocalShippingIcon color="primary" />
                            <Typography variant="h6" color="primary">Dane Dostawy</Typography>
                        </Box>
                        <TextInput source="deliveryAddress" label="Ulica i numer" fullWidth validate={required()} {...rest} />
                        <Box display="flex" gap={2} width="100%">
                            <TextInput source="deliveryCity" label="Miasto" validate={required()} sx={{ flex: 1 }} {...rest} />
                            <TextInput source="postalCode" label="Kod Pocztowy" validate={required()} sx={{ flex: 1 }} {...rest} />
                        </Box>
                    </Box>
                )}
            </FormDataConsumer>

            <Divider sx={{ my: 3 }} />

            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <ShoppingCartIcon color="action" />
                <Typography variant="h6">2. Koszyk</Typography>
            </Box>

            <ArrayInput source="orderItems" label=" ">
                <SimpleFormIterator inline fullWidth>
                    <ReferenceInput source="itemId" reference="menuItems" label="Produkt">
                        <AutocompleteInput 
                            optionText={(record) => `${record.name} (${record.basePrice} PLN)`} 
                            filterToQuery={q => ({ q })}
                            validate={required()}
                            sx={{ minWidth: 300 }}
                        />
                    </ReferenceInput>
                    <NumberInput 
                        source="quantity" 
                        label="Ilość" 
                        defaultValue={1} 
                        min={1} 
                        validate={required()} 
                        sx={{ maxWidth: 100 }}
                    />
                </SimpleFormIterator>
            </ArrayInput>

            <OrderCartSummary />

        </SimpleForm>
    </Create>
);