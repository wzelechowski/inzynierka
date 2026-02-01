import React, { useState } from 'react';
import { 
    useRecordContext, useNotify, useRefresh, 
    Button, Form, DateTimeInput, required 
} from 'react-admin';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Box, Typography, Switch, FormControlLabel 
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { api } from '../../api/api';

export const ExtendPromotionButton = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();
    const [open, setOpen] = useState(false);

    if (!record) return null;

    const handleSave = async (data: any) => {
        try {
            await api.patch(`/promotion/${record.id}`, { 
                endDate: data.endDate 
            });
            notify('Data zakończenia promocji została zaktualizowana', { type: 'success' });
            refresh();
            setOpen(false);
        } catch (error: any) {
            notify(`Błąd: ${error.response?.data?.message || error.message}`, { type: 'error' });
        }
    };

    return (
        <>
            <Button 
                label="Zmień datę" 
                onClick={() => setOpen(true)}
                color="primary"
                variant="outlined"
            >
                <EventIcon sx={{ mr: 1 }} />
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Przedłuż promocję</DialogTitle>
                <Form onSubmit={handleSave} defaultValues={{ endDate: record.endDate }}>
                    <DialogContent>
                        <Box mt={1}>
                            <Typography variant="body2" gutterBottom>
                                Wybierz nową datę zakończenia:
                            </Typography>
                            <DateTimeInput 
                                source="endDate" 
                                label="Koniec promocji" 
                                fullWidth 
                                validate={required()}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button label="Anuluj" onClick={() => setOpen(false)} color="warning" />
                        <Button label="Zapisz" type="submit" variant="contained" color="primary" />
                    </DialogActions>
                </Form>
            </Dialog>
        </>
    );
};

export const ToggleActiveButton = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();
    const [isLoading, setIsLoading] = useState(false);

    if (!record) return null;

    const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;
        setIsLoading(true);
        try {
            console.log(newValue)
            await api.patch(`/promotion/${record.id}`, { 
                active: newValue 
            });
            notify(newValue ? 'Promocja aktywowana' : 'Promocja wyłączona', { type: 'success' });
            refresh();
        } catch (error: any) {
            notify(`Błąd: ${error.message}`, { type: 'error' });
            refresh(); 
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormControlLabel
            control={
                <Switch 
                    checked={record.active} 
                    onChange={handleToggle} 
                    color="success" 
                    disabled={isLoading}
                />
            }
            label={record.active ? "AKTYWNA" : "NIEAKTYWNA"}
            sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 1, 
                pr: 2, 
                pl: 1, 
                bgcolor: record.active ? '#e8f5e9' : '#fafafa',
                '& .MuiTypography-root': { 
                    fontWeight: 'bold', 
                    fontSize: '0.875rem',
                    color: record.active ? '#2e7d32' : '#757575'
                }
            }}
        />
    );
};