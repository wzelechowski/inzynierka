import { 
    Show, SimpleShowLayout, TextField, DateField, 
    FunctionField 
} from 'react-admin';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CategoryIcon from '@mui/icons-material/Category';
import { ProposalPanel } from '../panel/ProposalPanel';
import { ExtendPromotionButton, ToggleActiveButton } from '../actions/PromotionActions'; 

const KpiCard = ({ label, value, color = 'primary.main' }: { label: string, value: string | number | null | undefined, color?: string }) => {
    if (value === null || value === undefined) return null;
    return (
        <Card variant="outlined" sx={{ height: '100%', borderColor: 'rgba(0, 0, 0, 0.08)' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="caption" color="textSecondary" gutterBottom>{label}</Typography>
                <Typography variant="h5" fontWeight="bold" color={color}>{typeof value === 'number' ? value.toFixed(4) : value}</Typography>
            </CardContent>
        </Card>
    );
};

export const PromotionShow = () => (
    <Show title="Szczegóły Promocji" sx={{ '& .RaShow-card': { backgroundColor: 'transparent', boxShadow: 'none' } }}>
        <SimpleShowLayout sx={{ p: 0 }}>
            
            <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between"
                gap={2} 
                mb={3} 
                p={3} 
                component={Card}
                sx={{ backgroundColor: '#fff', borderRadius: 1, boxShadow: 1 }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <LocalOfferIcon sx={{ fontSize: 48, color: '#d32f2f' }} />
                    <Box>
                        <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                            Nazwa promocji
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.1 }}>
                            <TextField source="name" />
                        </Typography>
                    </Box>
                </Box>
                
                <Box display="flex" alignItems="center" gap={2}>
                    <ExtendPromotionButton />
                    <ToggleActiveButton />
                </Box>
            </Box>

            <Grid container spacing={3}>

                <Grid>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box display="flex" gap={4} flexWrap="wrap">
                                
                                <Box minWidth="150px">
                                    <Typography variant="caption" color="textSecondary">Wartość Rabatu</Typography>
                                    <FunctionField label="Rabat" render={(record: any) => {
                                            const style = { display: 'block', fontSize: '2.5rem', fontWeight: 'bold', color: '#d32f2f', lineHeight: 1.2 };
                                            const type = record.effectType; 
                                            if (type === 'FIXED') return <span style={style}>{Number(record.discount).toFixed(2)} zł</span>;
                                            if (type === 'PERCENT') return <span style={style}>{(record.discount * 100).toFixed(0)}%</span>;
                                            return <span style={style}>GRATIS</span>;
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="caption" color="textSecondary">Rodzaj</Typography>
                                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                        <CategoryIcon color="action" />
                                        <FunctionField render={(record: any) => {
                                            const map: Record<string, string> = { 'FIXED': 'Kwotowa', 'PERCENT': 'Procentowa', 'GRATIS': 'Gratis' };
                                            return <Typography variant="h6" fontWeight={500}>{map[record.effectType] || record.effectType}</Typography>;
                                        }} />
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography variant="caption" color="textSecondary">Data rozpoczęcia</Typography>
                                    <DateField source="startDate" showTime sx={{ display: 'block', fontSize: '1.1rem', fontWeight: 500, mt: 0.5 }} />
                                </Box>

                                {/* END */}
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Data zakończenia</Typography>
                                    <DateField source="endDate" showTime sx={{ display: 'block', fontSize: '1.1rem', fontWeight: 500, mt: 0.5 }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    <ProposalPanel />
                </Grid>

                <FunctionField render={(record: any) => {
                    if (!record.proposal || !record.proposal.score) return null;
                    const p = record.proposal;
                    return (
                        <Grid>
                            <Card sx={{ bgcolor: '#f8fafd', border: '1px solid #e3f2fd' }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <AnalyticsIcon color="primary" />
                                        <Typography variant="h6">Analiza AI</Typography>
                                    </Box>
                                    <Box mb={3} textAlign="center" p={2} bgcolor="#e3f2fd" borderRadius={2}>
                                        <Typography variant="body2" color="primary.main">Score (Wynik)</Typography>
                                        <Typography variant="h3" fontWeight="bold" color="primary.main">{Number(p.score).toFixed(2)}</Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid><KpiCard label="Support (Wsparcie)" value={p.support.toFixed(2)} /></Grid>
                                        <Grid><KpiCard label="Confidence (Pewność)" value={p.confidence.toFixed(2)} /></Grid>
                                        <Grid><KpiCard label="Lift (Przyrost)" value={p.lift.toFixed(2)} /></Grid>
                                    </Grid>
                                    {p.reason && (
                                        <Box mt={3}>
                                            <Typography variant="caption" color="textSecondary">Uzasadnienie AI:</Typography>
                                            <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>"{p.reason}"</Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                }} />

            </Grid>
        </SimpleShowLayout>
    </Show>
);