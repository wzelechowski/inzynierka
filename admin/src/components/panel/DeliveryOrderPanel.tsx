import { useRecordContext, useGetOne, LoadingIndicator, RecordContextProvider } from 'react-admin';
import { Box, Typography, Alert } from '@mui/material';
import { OrderItemsPanel } from './OrderItemsPanel';

export const DeliveryOrderPanel = () => {
    const deliveryRecord = useRecordContext();
    if (!deliveryRecord || !deliveryRecord.orderId) {
        return <Alert severity="warning">Brak ID zamówienia w tej dostawie.</Alert>;
    }

    const { data: orderData, isLoading, error } = useGetOne(
        'orders', 
        { id: deliveryRecord.orderId }
    );

    if (isLoading) return <Box p={2}><LoadingIndicator /></Box>;
    if (error) return <Alert severity="error">Nie udało się pobrać szczegółów zamówienia.</Alert>;
    if (!orderData) return <Alert severity="warning">Zamówienie nie istnieje.</Alert>;

    return (
        <Box sx={{ p: 1, backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
            <Typography variant="h6" sx={{ mb: 1, ml: 2 }}>
                Szczegóły zamówienia ({deliveryRecord.orderId})
            </Typography>
            <RecordContextProvider value={orderData}>
                <OrderItemsPanel />
            </RecordContextProvider>
        </Box>
    );
};