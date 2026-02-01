import { 
    Edit, SimpleForm, TextInput, NumberInput, 
    SelectInput, ArrayInput, SimpleFormIterator, 
    ReferenceInput, AutocompleteInput, required,
} from 'react-admin';
import { Box, Typography, Divider } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { OrderCartSummary } from '../OrderCartSummary';

const transformOrderRequest = (data: any, { previousData }: any) => {    
    const formattedItems = (data.orderItems || [])
        .filter((i: any) => i.itemId && i.quantity > 0)
        .map((i: any) => ({
            itemId: i.itemId,            
            quantity: Number(i.quantity) 
        }));

    return {
        type: previousData.type,
        orderItems: formattedItems 
    };
};

export const OrderEdit = () => (
    <Edit title="Edycja Zamówienia" transform={transformOrderRequest} mutationMode="pessimistic">
        <SimpleForm>
            <Box display="flex" justifyContent="space-between" width="100%">
                <Typography variant="h6" gutterBottom>1. Szczegóły Zamówienia</Typography>
            </Box>

            <TextInput source="id" disabled size="small" variant="filled" />
            <Box display="flex" gap={2} flexWrap="wrap">
                <SelectInput 
                    source="type" 
                    label="Rodzaj" 
                    choices={[
                        { id: 'ON_SITE', name: 'Na miejscu' },
                        { id: 'TAKE_AWAY', name: 'Na wynos' },
                        { id: 'DELIVERY', name: 'Dostawa' },
                    ]}
                    disabled
                    sx={{ width: '250px' }}
                />
                
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <ShoppingCartIcon color="action" />
                <Typography variant="h6">2. Edycja Koszyka</Typography>
            </Box>

            <ArrayInput source="orderItems" label=" ">
                <SimpleFormIterator inline fullWidth>
                    <ReferenceInput source="itemId" reference="menuItems" label="Produkt">
                        <AutocompleteInput 
                            optionText={(r) => `${r.name} (${r.basePrice} zł)`} 
                            filterToQuery={q => ({ q })}
                            validate={required()}
                            sx={{ minWidth: 300 }}
                        />
                    </ReferenceInput>
                    <NumberInput source="quantity" label="Ilość" min={1} sx={{ maxWidth: 100 }} />
                </SimpleFormIterator>
            </ArrayInput>

            <OrderCartSummary />

        </SimpleForm>
    </Edit>
);