import { useGetList, useRecordContext, Loading } from 'react-admin';
import { Box, Typography, Divider, Chip } from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import type { DeliveryResponse } from '../types/delivery';

export const OrderDeliveryDetails = () => {
    const record = useRecordContext();
    
    if (!record || record.type !== 'DELIVERY') return null;

    const { data, isLoading, error } = useGetList<DeliveryResponse>(
        'deliveries',
        { 
            pagination: { page: 1, perPage: 1 }, 
            sort: { field: 'assignedAt', order: 'DESC' },
            filter: { orderId: record.id }
        }
    );

    if (isLoading) return <Loading />;
    if (error) return <Typography color="error">Błąd pobierania danych dostawy</Typography>;
    
    if (!data || data.length === 0) {
        return (
            <Box p={2} border="1px dashed #ccc" borderRadius={2} bgcolor="#fafafa">
                <Typography variant="body2" color="textSecondary">
                    Brak powiązanej dostawy w systemie dla zamówienia {record.id}.
                </Typography>
            </Box>
        );
    }

    const delivery = data[0];

    return (
        <Box 
            sx={{ 
                p: 2, 
                bgcolor: '#e3f2fd', 
                borderRadius: 2, 
                border: '1px dashed #90caf9' 
            }}
        >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <RoomIcon color="primary" />
                <Typography variant="subtitle2" color="primary" fontWeight="bold">
                    Adres dostawy
                </Typography>
            </Box>

            <Box ml={4}>
                <Typography variant="body2">
                    {delivery.deliveryAddress}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                    {delivery.postalCode} {delivery.deliveryCity}
                </Typography>
            </Box>

            <Divider sx={{ my: 1, borderColor: '#bbdefb' }} />

            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <LocalShippingIcon fontSize="small" color="action" />
                <Typography variant="caption" color="textSecondary">Status:</Typography>
                <Chip label={delivery.status} size="small" variant="outlined" color="primary" />
            </Box>
            
            {delivery.supplier && (
                <Typography variant="caption" display="block" sx={{ ml: 4 }}>
                    Kurier: <strong>{delivery.supplier.firstName} {delivery.supplier.lastName}</strong>
                </Typography>
            )}
        </Box>
    );
};