import * as React from 'react';
import { useState } from 'react';
import { useNotify, useRefresh, useRecordContext, Button } from 'react-admin';
import { Menu, MenuItem, Box, Typography } from '@mui/material';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { api } from '../../api/api';

const ORDER_STATUSES = [
    { id: 'NEW', name: 'Nowe', color: '#e0e0e0' },
    { id: 'IN_PREPARATION', name: 'W przygotowaniu', color: '#ffcc80' },
    { id: 'READY', name: 'Gotowe', color: '#fff59d' },
    { id: 'DELIVERY', name: 'W dostawie', color: '#90caf9' },
    { id: 'COMPLETED', name: 'Zakończone', color: '#a5d6a7' },
    { id: 'CANCELLED', name: 'Anulowane', color: '#ef9a9a' },
];

export const OrderStatusActions = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();
    
    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    if (!record) return null;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleStatusChange = async (newStatus: string) => {
        handleClose();
        setIsLoading(true);

        const isCompleted = newStatus === 'COMPLETED';
        
        const payload = {
            status: newStatus,
            deliveredAt: isCompleted ? new Date().toISOString() : null
        };

        try {
            await api.patch(`/order/orders/${record.id}`, payload);
            notify(`Status zmieniony na: ${newStatus}`, { type: 'success' });
            refresh(); 
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Wystąpił błąd';
            notify(`Błąd zmiany statusu: ${message}`, { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const currentStatusObj = ORDER_STATUSES.find(s => s.id === record.status);
    return (
        <Box mb={2}>
            <Typography variant="caption" display="block" gutterBottom>
                Zarządzanie statusem
            </Typography>
            
            <Button
                variant="contained"
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                disabled={isLoading}
                sx={{ 
                    backgroundColor: currentStatusObj?.color || 'primary.main',
                    color: '#000',
                    '&:hover': { filter: 'brightness(0.9)', backgroundColor: currentStatusObj?.color }
                }}
            >
                <ChangeCircleIcon sx={{ mr: 1 }} />
                {currentStatusObj?.name || record.status}
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {ORDER_STATUSES.map((status) => (
                    <MenuItem 
                        key={status.id} 
                        onClick={() => handleStatusChange(status.id)}
                        selected={record.status === status.id}
                        sx={{ 
                            borderLeft: record.status === status.id ? `4px solid ${status.color}` : 'none',
                            fontWeight: record.status === status.id ? 'bold' : 'normal'
                        }}
                    >
                        {status.name}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};