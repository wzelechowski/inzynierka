import { useState, useEffect } from 'react';
import { 
    Show, SimpleShowLayout, 
    useRecordContext, LoadingIndicator 
} from 'react-admin';
import { Box, Typography, Divider, Paper, Stack, Chip } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { MenuItemService } from '../../service/menuItemService';

const ProposalShowContent = () => {
    const record = useRecordContext();
    const [productNames, setProductNames] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchProducts = async () => {
            if (!record || !record.products || record.products.length === 0) return;
            setLoading(true);

            const namesMap: Record<string, string> = {};
            
            await Promise.all(record.products.map(async (p: any) => {
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
    }, [record]);

    if (!record) return null;

    return (
        <Box sx={{ maxWidth: 1000 }}>
            {/* 1. NAGŁÓWEK */}
            <Box display="flex" gap={2} alignItems="center" mb={3}>
                <LightbulbIcon sx={{ fontSize: 40, color: '#fbc02d' }} />
                <Box>
                    <Typography variant="caption" color="textSecondary">Propozycja AI</Typography>
                    <Typography variant="h5" fontWeight="bold">
                        {record.reason}
                    </Typography>
                </Box>
                <Chip 
                    label={`Rabat: ${(record.discount * 100).toFixed(0)}%`} 
                    color="error" 
                    sx={{ ml: 'auto', fontSize: '1.2rem', padding: 2 }} 
                />
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, 
                gap: 2, 
                mb: 4 
            }}>
                <StatCard label="Confidence" value={(record.confidence * 100).toFixed(1) + '%'} color="primary.main" />
                <StatCard label="Lift (Unikalność)" value={record.lift.toFixed(2)} color="secondary.main" />
                <StatCard label="Support" value={(record.support * 100).toFixed(1) + '%'} color="text.primary" />
                <StatCard label="AI Score" value={record.score.toFixed(2)} color="text.primary" bold />
            </Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AnalyticsIcon color="action" /> Produkty w regule:
            </Typography>
            {loading ? <LoadingIndicator /> : (
                <Stack spacing={1}>
                    {record.products?.map((prod: any, idx: number) => {
                        const name = productNames[prod.productId] || prod.productId;
                        const isCondition = prod.role === 'ANTECEDENT' || prod.role === 'CONDITION';

                        return (
                            <Paper key={idx} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: isCondition ? '4px solid #0288d1' : '4px solid #2e7d32' }}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">{name}</Typography>
                                    <Typography variant="caption" fontFamily="monospace" color="textSecondary">ID: {prod.productId}</Typography>
                                </Box>
                                
                                <Chip 
                                    label={isCondition ? "JEŚLI KUPISZ (Warunek)" : "TO DOSTANIESZ (Wynik)"} 
                                    color={isCondition ? 'info' : 'success'} 
                                    variant={isCondition ? 'outlined' : 'filled'}
                                    icon={isCondition ? undefined : <TrendingUpIcon />}
                                />
                            </Paper>
                        );
                    })}
                </Stack>
            )}
        </Box>
    );
};

const StatCard = ({ label, value, color, bold }: any) => (
    <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: '#fff', border: '1px solid #ddd', borderRadius: 2 }}>
        <Typography variant="caption" color="textSecondary" textTransform="uppercase">{label}</Typography>
        <Typography variant="h4" color={color} fontWeight={bold ? '900' : '500'} sx={{ mt: 1 }}>
            {value}
        </Typography>
    </Paper>
);

export const PromotionProposalShow = () => (
    <Show title="Szczegóły Propozycji">
        <SimpleShowLayout>
            <ProposalShowContent />
        </SimpleShowLayout>
    </Show>
);