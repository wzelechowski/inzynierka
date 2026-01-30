import { useState, useEffect } from 'react';
import { useRecordContext, LoadingIndicator } from 'react-admin';
import { Box, Typography, Paper, Chip, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { MenuItemService } from '../../service/menuItemService';

export const PromotionProposalPanel = () => {
    const record = useRecordContext();
    const [productNames, setProductNames] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchProducts = async () => {
            if (!record || !record.products) return;
            setLoading(true);
            const namesMap: Record<string, string> = {};
            await Promise.all(record.products.map(async (p: any) => {
                if (productNames[p.productId]) return;
                try {
                    const item = await MenuItemService.getOne(p.productId);
                    namesMap[p.productId] = item ? item.name : 'Nieznany produkt';
                } catch {
                    namesMap[p.productId] = 'Błąd pobierania';
                }
            }));

            setProductNames(prev => ({ ...prev, ...namesMap }));
            setLoading(false);
        };

        fetchProducts();
    }, [record]);

    if (!record) return null;

    return (
        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEventsIcon color="warning" fontSize="small" /> 
                Szczegóły reguły asocjacyjnej
            </Typography>
            {loading ? <LoadingIndicator /> : (
                <Stack direction="row" spacing={2} flexWrap="wrap">
                    {record.products?.map((prod: any, idx: number) => {
                        const name = productNames[prod.productId] || prod.productId;
                        const isCondition = prod.role === 'ANTECEDENT' || prod.role === 'CONDITION';
                        
                        return (
                            <Paper 
                                key={idx} 
                                variant="outlined" 
                                sx={{ 
                                    p: 1.5, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 2,
                                    borderColor: isCondition ? '#90caf9' : '#a5d6a7',
                                    bgcolor: isCondition ? '#e3f2fd' : '#e8f5e9'
                                }}
                            >
                                <Box>
                                    <Typography variant="body2" fontWeight="bold">{name}</Typography>
                                    <Typography variant="caption" color="textSecondary" fontFamily="monospace">
                                        {prod.role}
                                    </Typography>
                                </Box>

                                <Chip 
                                    label={isCondition ? "JEŚLI KUPISZ" : "TO DOSTANIESZ"} 
                                    size="small" 
                                    color={isCondition ? "primary" : "success"}
                                    icon={isCondition ? <AddShoppingCartIcon /> : <TrendingUpIcon />}
                                />
                            </Paper>
                        );
                    })}
                </Stack>
            )}
        </Box>
    );
};