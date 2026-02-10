import { 
    Show, SimpleShowLayout, TextField, DateField, 
    ReferenceField, FunctionField, useRecordContext,
    Link as RaLink
} from 'react-admin';
import { Grid, Box, Typography, Card, CardContent, Chip, Avatar, Divider } from '@mui/material';
import { 
    Timeline, TimelineItem, TimelineSeparator, 
    TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent 
} from '@mui/lab';

// Ikony
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { DeliveryStatusActions, DeliveryAssignSupplierButton } from '../actions/DeliveryActions';

const DeliveryStatusChip = () => {
    const record = useRecordContext();
    if (!record) return null;

    let color: any = "default";
    let label = record.status;

    switch (record.status) {
        case 'PENDING':   color = 'default'; label = "Oczekuje"; break;
        case 'ASSIGNED':  color = 'warning'; label = "Przypisane"; break;
        case 'PICKED_UP': color = 'primary'; label = "W drodze"; break;
        case 'DELIVERED': color = 'success'; label = "Dostarczone"; break;
        case 'CANCELLED': color = 'error';   label = "Anulowane"; break;
    }

    return <Chip label={label} color={color} variant="filled" size="small" />;
};

export const DeliveryShow = () => (
    <Show sx={{ '& .RaShow-card': { backgroundColor: 'transparent', boxShadow: 'none' } }}>
        <SimpleShowLayout sx={{ p: 0 }}>
            
            <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center" 
                mb={3} 
                p={2}
                component={Card}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                        <LocalShippingIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            Dostawa #<TextField source="id" />
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            <Typography variant="body2" color="textSecondary">Zamówienie:</Typography>
                            <ReferenceField source="orderId" reference="orders" link="show">
                                <FunctionField render={(r: any) => (
                                    <Chip 
                                        icon={<ReceiptLongIcon />} 
                                        label={r ? `#${r.id}` : '...'} 
                                        size="small" 
                                        clickable
                                        color="default"
                                    />
                                )} />
                            </ReferenceField>
                        </Box>
                    </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                    <DeliveryStatusActions />
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #f0f0f0', pb: 1 }}>
                                Dane Logistyczne
                            </Typography>

                            <Box display="flex" flexDirection="column" gap={3} mt={2}>
                                <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2, border: '1px dashed #90caf9' }}>
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <RoomIcon color="primary" />
                                        <Typography variant="subtitle2" color="primary" fontWeight="bold">
                                            Miejsce docelowe
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2"><TextField source="deliveryAddress" /></Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        <TextField source="postalCode" /> <TextField source="deliveryCity" />
                                    </Typography>
                                </Box>

                                <Box>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="caption" color="textSecondary">
                                            Przypisany Kurier
                                        </Typography>
                                        <DeliveryAssignSupplierButton />
                                    </Box>
                                    
                                    <FunctionField render={(record: any) => {
                                        if (!record.supplier) {
                                            return (
                                                <Box display="flex" alignItems="center" gap={1} p={2} bgcolor="#f5f5f5" borderRadius={1} border="1px dashed #ccc">
                                                    <PersonIcon color="disabled" />
                                                    <Typography color="textSecondary" variant="body2">
                                                        Oczekuje na przypisanie
                                                    </Typography>
                                                </Box>
                                            );
                                        }
                                        return (
                                            <Box display="flex" alignItems="center" gap={2} p={2} border="1px solid #eee" borderRadius={2}>
                                                <Avatar src={record.supplier.avatarUrl} alt="S">
                                                    {record.supplier.firstName?.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {record.supplier.firstName} {record.supplier.lastName}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Status: {record.supplier.status}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        );
                                    }} />
                                </Box>

                                <Box>
                                    <Typography variant="caption" color="textSecondary" display="block" mb={0.5}>Obecny Status</Typography>
                                    <DeliveryStatusChip />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #f0f0f0', pb: 1 }}>
                                Przebieg dostawy
                            </Typography>
                            
                            <Timeline position="right" sx={{ p: 0, mt: 2 }}>
                                
                                <TimelineItem>
                                    <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.3 }}>
                                        <Typography variant="caption">Start</Typography>
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineDot color="grey"><PendingActionsIcon /></TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <Typography fontWeight="bold">Oczekuje na realizację</Typography>
                                    </TimelineContent>
                                </TimelineItem>

                                <TimelineItem>
                                    <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.3 }}>
                                        <DateField source="assignedAt" showTime options={{ hour: '2-digit', minute: '2-digit' }} />
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <FunctionField render={(r: any) => (
                                            <TimelineDot color={r.assignedAt ? "warning" : "grey"}><PersonIcon /></TimelineDot>
                                        )} /><TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <Typography fontWeight={500}>Przypisano kuriera</Typography>
                                    </TimelineContent>
                                </TimelineItem>

                                <TimelineItem>
                                    <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.3 }}>
                                        <DateField source="pickedUpAt" showTime options={{ hour: '2-digit', minute: '2-digit' }} />
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <FunctionField render={(r: any) => (
                                            <TimelineDot color={r.pickedUpAt ? "primary" : "grey"}><LocalShippingIcon /></TimelineDot>
                                        )} /><TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <Typography fontWeight={500}>W drodze</Typography>
                                        <Typography variant="caption" color="textSecondary">Pobrano z lokalu</Typography>
                                    </TimelineContent>
                                </TimelineItem>

                                <TimelineItem>
                                    <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.3 }}>
                                        <DateField source="deliveredAt" showTime options={{ hour: '2-digit', minute: '2-digit' }} />
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <FunctionField render={(r: any) => (
                                            <TimelineDot color={r.deliveredAt ? "success" : "grey"}><CheckCircleIcon /></TimelineDot>
                                        )} />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <Typography fontWeight="bold">Dostarczono</Typography>
                                    </TimelineContent>
                                </TimelineItem>

                            </Timeline>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </SimpleShowLayout>
    </Show>
);