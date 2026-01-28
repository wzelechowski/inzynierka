// src/promotions/ProposalPanel.tsx
import { useEffect, useState } from 'react';
import { useRecordContext, LoadingIndicator } from 'react-admin';
import { Box, Typography, Paper, Chip, Divider, Stack } from '@mui/material'; // Usunięto Grid
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { MenuItemService } from '../service/menuItemService';

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
                <AnalyticsIcon /> Analiza AI (Market Basket Analysis)
            </Typography>

            {/* 1. KAFELKI STATYSTYK (ZAMIAST GRID -> CSS GRID W BOX) */}
            {/* To rozwiązanie jest pancerne i działa w każdej wersji MUI */}
            <Box 
                sx={{ 
                    display: 'grid', 
                    // Na mobilce (xs) 2 kolumny, na desktopie (md) 4 kolumny
                    gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, 
                    gap: 2, 
                    mb: 3 
                }}
            >
                <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: '#fff', border: '1px solid #ddd' }}>
                    <Typography variant="caption" color="textSecondary">Confidence (Pewność)</Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                        {(proposal.confidence * 100).toFixed(1)}%
                    </Typography>
                </Paper>

                <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: '#fff', border: '1px solid #ddd' }}>
                    <Typography variant="caption" color="textSecondary">Lift (Unikalność)</Typography>
                    <Typography variant="h5" color="secondary" fontWeight="bold">
                        {proposal.lift.toFixed(2)}
                    </Typography>
                </Paper>

                <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: '#fff', border: '1px solid #ddd' }}>
                    <Typography variant="caption" color="textSecondary">Support (Wsparcie)</Typography>
                    <Typography variant="h5" fontWeight="bold">
                        {(proposal.support * 100).toFixed(1)}%
                    </Typography>
                </Paper>

                <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: '#fff', border: '1px solid #ddd' }}>
                    <Typography variant="caption" color="textSecondary">AI Score</Typography>
                    <Typography variant="h5" fontWeight="bold" color="textSecondary">
                        {proposal.score.toFixed(2)}
                    </Typography>
                </Paper>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* 2. PRODUKTY */}
            <Typography variant="subtitle2" gutterBottom>Powiązane produkty:</Typography>
            
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

            {/* 3. POWÓD */}
            {proposal.reason && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#fff', borderRadius: 1 }}>
                    <Typography variant="caption" fontWeight="bold">Uzasadnienie:</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        "{proposal.reason}"
                    </Typography>
                </Box>
            )}
        </Box>
    );
};