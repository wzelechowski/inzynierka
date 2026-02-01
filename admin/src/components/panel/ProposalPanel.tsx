import { useEffect, useState } from 'react';
import { useRecordContext, LoadingIndicator } from 'react-admin';
import { Box, Typography, Paper, Chip, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { MenuItemService } from '../../service/menuItemService';

export const ProposalPanel = () => {
    const record = useRecordContext();
    const [productNames, setProductNames] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    if (!record || !record.proposal) return null;

    const proposal = record.proposal;

    useEffect(() => {
        const fetchProducts = async () => {
            if (!proposal.products || proposal.products.length === 0) return;
            setLoading(true);

            const namesMap: Record<string, string> = {};
            
            await Promise.all(proposal.products.map(async (p: any) => {
                if (productNames[p.productId]) return; 
                try {
                    const item = await MenuItemService.getOne(p.productId);
                    namesMap[p.productId] = item ? item.name : 'Nieznany produkt';
                } catch (e) {
                    namesMap[p.productId] = 'Błąd pobierania';
                }
            }));

            setProductNames(prev => ({ ...prev, ...namesMap }));
            setLoading(false);
        };
        fetchProducts();
    }, [proposal]);

    return (
        <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#f8fbff' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#0288d1' }}>
                Powiązane produkty
            </Typography>
            <Typography variant="subtitle2"/>
            {loading ? <LoadingIndicator /> : (
                <Stack spacing={1}>
                    {proposal.products.map((prod: any, idx: number) => {
                        const name = productNames[prod.productId] || prod.productId;
                        const isTrigger = prod.role === 'ANTECEDENT' || prod.role === 'CONDITION';
                        
                        return (
                            <Paper key={idx} variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">{name}</Typography>
                                    <Typography variant="caption" fontFamily="monospace" color="textSecondary">{prod.productId}</Typography>
                                </Box>
                                <Chip 
                                    label={prod.role} 
                                    color={isTrigger ? 'info' : 'success'} 
                                    icon={isTrigger ? undefined : <TrendingUpIcon />} 
                                    variant="outlined"
                                    size="small"
                                />
                            </Paper>
                        );
                    })}
                </Stack>
            )}
        </Box>
    );
};