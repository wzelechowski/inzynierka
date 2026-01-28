// src/orders/OrderShow.tsx
import { Show, SimpleShowLayout, TextField, DateField, NumberField, FunctionField } from 'react-admin';
import { Chip, Box, Typography, Divider } from '@mui/material';
import { OrderItemsPanel } from './OrderItemsPanel'; // Twój panel z produktami

// Helper kolorów (skopiowany lub zaimportowany z Lists.tsx)
const getStatusColor = (status: string) => {
    switch (status) {
        case 'NEW': return 'info';
        case 'IN_PROGRESS': return 'warning';
        case 'READY': return 'primary';
        case 'COMPLETED': return 'success';
        case 'CANCELLED': return 'error';
        default: return 'default';
    }
};

export const OrderShow = () => (
    <Show title="Szczegóły Zamówienia">
        <SimpleShowLayout>
            {/* --- NAGŁÓWEK --- */}
            <Box display="flex" gap={2} alignItems="center">
                <Typography variant="h6">Zamówienie #</Typography>
                <TextField source="id" sx={{ fontSize: '1.2rem', fontFamily: 'monospace' }} />
                
                <FunctionField 
                    render={(record: any) => (
                        <Chip 
                            label={record.status} 
                            color={getStatusColor(record.status)} 
                            size="medium" 
                        />
                    )}
                />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* --- DANE FINANSOWE I DATY --- */}
            <Box display="flex" gap={4}>
                <Box>
                    <Typography variant="caption" color="textSecondary">Kwota całkowita</Typography>
                    <NumberField 
                        source="totalPrice" 
                        options={{ style: 'currency', currency: 'PLN' }} 
                        sx={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'block' }}
                    />
                </Box>
                <Box>
                    <Typography variant="caption" color="textSecondary">Data złożenia</Typography>
                    <DateField source="createdAt" showTime sx={{ display: 'block', fontSize: '1.1rem' }} />
                </Box>
                <Box>
                    <Typography variant="caption" color="textSecondary">Typ</Typography>
                    <TextField source="type" sx={{ display: 'block', fontSize: '1.1rem' }} />
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* --- LISTA PRODUKTÓW (Twój gotowy panel) --- */}
            {/* React-Admin automatycznie przekaże tutaj record context */}
            <OrderItemsPanel />

        </SimpleShowLayout>
    </Show>
);