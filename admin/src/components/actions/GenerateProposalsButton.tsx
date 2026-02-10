import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useNotify, useRefresh } from 'react-admin';
import { api } from '../../api/api';

export const GenerateProposalsButton = () => {
    const [open, setOpen] = useState(false);
    const [daysBack, setDaysBack] = useState(30);
    const [maxProposals, setMaxProposals] = useState(5);
    const [loading, setLoading] = useState(false);
    
    const notify = useNotify();
    const refresh = useRefresh();

    const handleClick = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await api.get(`/promotion/promotionProposal/generate`, {
                params: {
                    max_proposals: maxProposals,
                    days_back: daysBack
                }
            });

            notify('Promocje wygenerowane pomyślnie!', { type: 'success' });
            refresh();
            handleClose();
        } catch (error) {
            console.error(error);
            notify('Błąd podczas generowania promocji.', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleClick}
                startIcon={<AutoFixHighIcon />}
                sx={{ marginLeft: '10px' }}
            >
                Wygeneruj (AI)
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Generowanie promocji przez AI</DialogTitle>
                <DialogContent>
                    <p style={{marginBottom: '1rem', color: '#666'}}>
                        Algorytm przeanalizuje zakończone zamówienia i zaproponuje nowe reguły promocyjne.
                    </p>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Ile dni wstecz analizować?"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={daysBack}
                        onChange={(e) => setDaysBack(Number(e.target.value))}
                        helperText="Domyślnie: 30 dni"
                    />
                    <TextField
                        margin="dense"
                        label="Maksymalna liczba propozycji"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={maxProposals}
                        onChange={(e) => {
                            let value = Number(e.target.value);
                            if (value > 5) {
                                value = 5;
                            } else if (value < 1) {
                                value = 1;
                            }

                            setMaxProposals(value)}
                    }
                        helperText="Ile najlepszych reguł zapisać? (max 5)"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>Anuluj</Button>
                    <Button onClick={handleConfirm} variant="contained" color="primary" disabled={loading}>
                        {loading ? 'Generowanie...' : 'Generuj'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};