import React, { useState } from 'react';
import { 
    useRecordContext, useNotify, useRefresh, 
    Button, ReferenceInput, AutocompleteInput, Form 
} from 'react-admin';
import { 
    Box, Menu, MenuItem, Dialog, DialogTitle, 
    DialogContent, DialogActions 
} from '@mui/material';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { api } from '../../api/api';

const DELIVERY_STATUS_META: Record<string, { name: string, color: string }> = {
    'PENDING':    { name: 'Oczekuje',    color: '#e0e0e0' },
    'ASSIGNED':   { name: 'Przypisane',  color: '#ffcc80' },
    'PICKED_UP':  { name: 'W drodze',    color: '#90caf9' },
    'DELIVERED':  { name: 'Dostarczone', color: '#a5d6a7' },
    'CANCELLED':  { name: 'Anulowane',   color: '#ef9a9a' },
};

export const DeliveryStatusActions = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();
    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const open = Boolean(anchorEl);

    if (!record) return null;

    const getAvailableTransitions = (currentStatus: string) => {
        switch (currentStatus) {
            case 'PENDING':
                return ['ASSIGNED'];
            case 'ASSIGNED':
                return ['PICKED_UP', 'PENDING', 'CANCELLED'];
            case 'PICKED_UP':
                return ['DELIVERED'];
            case 'DELIVERED':
            case 'CANCELLED':
                return []; 
            default:
                return [];
        }
    };

    const availableStatuses = getAvailableTransitions(record.status);
    
    if (availableStatuses.length === 0) return null;

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleStatusChange = async (newStatus: string) => {
        handleClose();
        setIsLoading(true);

        try {
            await api.put(`/delivery/${record.id}/status`, { status: newStatus });
            notify(`Status zmieniony na: ${DELIVERY_STATUS_META[newStatus].name}`, { type: 'success' });
            refresh();
        } catch (error: any) {
            notify(`Błąd: ${error.response?.data?.message || error.message}`, { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const currentMeta = DELIVERY_STATUS_META[record.status] || { name: record.status, color: '#e0e0e0' };

    return (
        <Box>
            <Button
                variant="contained"
                onClick={handleOpen}
                endIcon={<KeyboardArrowDownIcon />}
                disabled={isLoading}
                label={currentMeta.name}
                sx={{ 
                    bgcolor: currentMeta.color,
                    color: '#000',
                    '&:hover': { bgcolor: currentMeta.color, filter: 'brightness(0.9)' }
                 }}
            >
                <ChangeCircleIcon sx={{ mr: 1 }} />
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {availableStatuses.map((statusKey) => (
                    <MenuItem 
                        key={statusKey} 
                        onClick={() => handleStatusChange(statusKey)}
                        sx={{ borderLeft: `4px solid ${DELIVERY_STATUS_META[statusKey].color}` }}
                    >
                        {DELIVERY_STATUS_META[statusKey].name}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export const DeliveryAssignSupplierButton = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();
    const [open, setOpen] = useState(false);

    if (!record) return null;

    if (record.supplier) return null;

    const handleSubmit = async (data: any) => {
        try {
            await api.put(`/delivery/${record.id}/supplier`, { 
                supplierId: data.supplierId 
            });
            notify('Kurier został przypisany', { type: 'success' });
            refresh();
            setOpen(false);
        } catch (error: any) {
            notify(`Błąd: ${error.response?.data?.message || error.message}`, { type: 'error' });
        }
    };

    return (
        <>
            <Button 
                label="Przypisz Kuriera" 
                onClick={() => setOpen(true)}
                variant="outlined"
                color="primary"
                size="small"
            >
                <PersonAddIcon sx={{ mr: 1 }} />
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Wybierz Kuriera</DialogTitle>
                <Form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Box mt={1}>
                            <ReferenceInput source="supplierId" reference="suppliers">
                                <AutocompleteInput 
                                    label="Kurier"
                                    optionText={(r) => `${r.firstName} ${r.lastName}`}
                                    filterToQuery={q => ({ q })}
                                    fullWidth
                                    validate={(val) => val ? undefined : 'Wymagane'}
                                />
                            </ReferenceInput>
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