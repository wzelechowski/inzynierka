import { useRecordContext } from 'react-admin';
import { Box, Typography, Paper } from '@mui/material';

export const OrderReadOnlySummary = () => {
    const record = useRecordContext();
    
    if (!record || !record.orderItems) return null;

    const items = record.orderItems;

    const total = items.reduce((sum: number, item: any) => {
        const lineTotal = item.totalPrice ?? (item.finalPrice * item.quantity);
        return sum + Number(lineTotal);
    }, 0);

    return (
        <Box sx={{ width: '300px', ml: 'auto', mt: 2 }}>
            <Paper elevation={3} sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #eee' }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography color="textSecondary">Suma całkowita:</Typography>
                    <Typography fontWeight="bold" variant="h5" color="primary.main">
                        {total.toFixed(2)} PLN
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};