// src/promotions/PromotionShow.tsx
import { Show, SimpleShowLayout, TextField, DateField, NumberField, FunctionField } from 'react-admin';
import { Box, Typography, Divider, Chip } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { ProposalPanel } from './ProposalPanel'; // <--- Import panelu z kroku A

export const PromotionShow = () => (
    <Show title="Szczegóły Promocji">
        <SimpleShowLayout>
            
            {/* --- NAGŁÓWEK --- */}
            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <LocalOfferIcon sx={{ fontSize: 40, color: '#d32f2f' }} />
                <Box>
                    <Typography variant="caption" color="textSecondary">Nazwa promocji</Typography>
                    <Typography variant="h5" fontWeight="bold">
                        <TextField source="name" />
                    </Typography>
                </Box>
                
                <Box ml="auto">
                    <FunctionField 
                        render={(record: any) => (
                            <Chip 
                                label={record.active ? "AKTYWNA" : "ZAKOŃCZONA"} 
                                color={record.active ? "success" : "default"} 
                            />
                        )}
                    />
                </Box>
            </Box>

            <Divider />

            {/* --- GŁÓWNE DANE --- */}
            <Box display="flex" gap={6} my={3}>
                <Box>
                    <Typography variant="caption" color="textSecondary">Wartość Rabatu</Typography>
                    <NumberField 
                        source="discount" 
                        options={{ style: 'percent' }} 
                        sx={{ display: 'block', fontSize: '2rem', fontWeight: 'bold', color: '#d32f2f' }}
                    />
                </Box>
                <Box>
                    <Typography variant="caption" color="textSecondary">Data rozpoczęcia</Typography>
                    <DateField source="startDate" showTime sx={{ display: 'block', fontSize: '1.1rem' }} />
                </Box>
                <Box>
                    <Typography variant="caption" color="textSecondary">Data zakończenia</Typography>
                    <DateField source="endDate" showTime sx={{ display: 'block', fontSize: '1.1rem' }} />
                </Box>
            </Box>

            {/* --- PANEL ANALITYCZNY (Wyświetli się tylko jeśli jest proposal) --- */}
            <ProposalPanel />

        </SimpleShowLayout>
    </Show>
);