import { 
    Show, SimpleShowLayout, TextField, DateField, 
    NumberField, ArrayField, Datagrid, ReferenceField, 
    FunctionField, useRecordContext, useGetList, Loading
} from 'react-admin';
import { Grid, Box, Typography, Divider, Card, CardContent, Chip, Avatar } from '@mui/material';
import { OrderStatusActions } from '../actions/OrderStatusActions';
import { OrderReadOnlySummary } from '../OrderReadOnlySummary';

import RestaurantIcon from '@mui/icons-material/Restaurant';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoomIcon from '@mui/icons-material/Room';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const OrderDeliveryDetails = () => {
    const record = useRecordContext();
    
    if (!record || record.type !== 'DELIVERY') return null;

    const { data, isLoading, error } = useGetList(
        'deliveries', 
        { 
            pagination: { page: 1, perPage: 1 }, 
            sort: { field: 'assignedAt', order: 'DESC' },
            filter: { orderId: record.id } 
        }
    );

    if (isLoading) return <Box py={2}><Loading /></Box>;
    if (error) return <Typography color="error" variant="caption">Błąd pobierania danych dostawy</Typography>;
    
    // Jeśli nie znaleziono dostawy
    if (!data || data.length === 0) {
        return (
            <Box p={2} border="1px dashed #ccc" borderRadius={2} bgcolor="#fafafa">
                <Typography variant="caption" color="textSecondary">
                    Brak danych w module dostaw dla tego zamówienia.
                </Typography>
            </Box>
        );
    }

    const delivery = data[0];

    return (
        <Box 
            sx={{ 
                p: 2, 
                bgcolor: '#e3f2fd', 
                borderRadius: 2, 
                border: '1px dashed #90caf9' 
            }}
        >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <RoomIcon color="primary" />
                <Typography variant="subtitle2" color="primary" fontWeight="bold">
                    Adres dostawy
                </Typography>
            </Box>

            <Box ml={0}>
                <Typography variant="body2">
                    {delivery.deliveryAddress}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                    {delivery.postalCode} {delivery.deliveryCity}
                </Typography>
            </Box>

            <Divider sx={{ my: 1, borderColor: '#bbdefb' }} />

            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <LocalShippingIcon fontSize="small" color="action" />
                <Typography variant="caption" color="textSecondary">Status:</Typography>
                <Chip label={delivery.status} size="small" variant="outlined" color="primary" />
            </Box>
            
            {delivery.supplier && (
                <Typography variant="caption" display="block" mt={0.5}>
                    Kurier: <strong>{delivery.supplier.firstName} {delivery.supplier.lastName}</strong>
                </Typography>
            )}
        </Box>
    );
};

const ProductNameCell = (_props: { label?: string }) => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Box>
            <ReferenceField source="itemId" reference="menuItems" link={false}>
                <TextField source="name" sx={{ fontWeight: 500, display: 'block' }} />
            </ReferenceField>

            {record.discounted && (
                <Chip 
                    icon={<LocalOfferIcon style={{fontSize: 12}} />} 
                    label="Promocja" 
                    size="small" 
                    color="error" 
                    variant="outlined"
                    sx={{ height: 18, fontSize: '0.65rem', mt: 0.5 }} 
                />
            )}
        </Box>
    );
};

const StatusChip = () => {
    const record = useRecordContext();
    if (!record) return null;
    
    let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "default";
    
    switch (record.status) {
        case 'NEW': color = 'default'; break;
        case 'IN_PREPARATION': color = 'warning'; break;
        case 'READY': color = 'info'; break;
        case 'DELIVERY': color = 'primary'; break;
        case 'COMPLETED': color = 'success'; break;
        case 'CANCELLED': color = 'error'; break;
        default: color = 'default';
    }

    const labelMap: Record<string, string> = {
        'NEW': 'Nowe',
        'IN_PREPARATION': 'W przygotowaniu',
        'READY': 'Gotowe',
        'DELIVERY': 'W dostawie',
        'COMPLETED': 'Zakończone',
        'CANCELLED': 'Anulowane'
    };

    return <Chip label={labelMap[record.status] || record.status} color={color} variant="filled" />;
};

const TypeDisplay = () => {
    const record = useRecordContext();
    if (!record) return null;

    let icon = <RestaurantIcon />;
    let label = "Na miejscu";

    if (record.type === 'DELIVERY') {
        icon = <DeliveryDiningIcon />;
        label = "Dostawa";
    } else if (record.type === 'TAKE_AWAY') {
        icon = <ShoppingBagIcon />;
        label = "Na wynos";
    }

    return (
        <Box display="flex" alignItems="center" gap={1} color="text.secondary">
            {icon}
            <Typography variant="body1" fontWeight="bold">{label}</Typography>
        </Box>
    );
};

export const OrderShow = () => (
    <Show 
        sx={{ '& .RaShow-card': { backgroundColor: 'transparent', boxShadow: 'none' } }}
    >
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
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                        <RestaurantIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            Zamówienie #<TextField source="id" />
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            <AccessTimeIcon fontSize="small" color="disabled" />
                            <Typography variant="body2" color="textSecondary">
                                <DateField source="createdAt" showTime />
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                    <OrderStatusActions />
                </Box>
            </Box>

            <Grid container spacing={3}>
                
                <Grid>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #f0f0f0', pb: 1 }}>
                                Szczegóły
                            </Typography>

                            <Box display="flex" flexDirection="column" gap={3} mt={2}>
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Typ zamówienia</Typography>
                                    <TypeDisplay />
                                </Box>

                                <Box>
                                    <Typography variant="caption" color="textSecondary" display="block" mb={0.5}>Status</Typography>
                                    <StatusChip />
                                </Box>

                                <OrderDeliveryDetails />

                                <FunctionField render={(r: any) => r.deliveredAt && (
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Dostarczono</Typography>
                                        <Typography variant="body1">
                                            <DateField source="deliveredAt" showTime />
                                        </Typography>
                                    </Box>
                                )} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #f0f0f0', pb: 1 }}>
                                Zawartość koszyka
                            </Typography>
                            
                            <ArrayField source="orderItems">
                                <Datagrid 
                                    bulkActionButtons={false} 
                                    sx={{ 
                                        '& .RaDatagrid-headerCell': { fontWeight: 'bold', bgcolor: '#fafafa' }
                                    }}
                                >
                                    <ProductNameCell label="Produkt" />
                                    
                                    <NumberField source="quantity" label="Ilość" />

                                    <FunctionField 
                                        label="Cena jedn."
                                        render={(record: any) => {
                                            const isDiscounted = record.discounted;
                                            const base = Number(record.basePrice);
                                            const final = Number(record.finalPrice);

                                            if (isDiscounted) {
                                                return (
                                                    <Box display="flex" flexDirection="column" alignItems="flex-end">
                                                        <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.disabled', lineHeight: 1 }}>
                                                            {base.toFixed(2)} zł
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                                                            {final.toFixed(2)} zł
                                                        </Typography>
                                                    </Box>
                                                );
                                            }
                                            return `${final.toFixed(2)} zł`;
                                        }}
                                        sx={{ textAlign: 'right' }} 
                                    />

                                    <FunctionField 
                                        label="Suma"
                                        render={(record: any) => {
                                            const lineTotal = record.totalPrice ?? (record.finalPrice * record.quantity);
                                            return `${Number(lineTotal).toFixed(2)} zł`;
                                        }} 
                                        sx={{ fontWeight: 'bold', textAlign: 'right' }}
                                    />
                                </Datagrid>
                            </ArrayField>

                            <Divider sx={{ my: 2 }} />
                            
                            <Box display="flex" justifyContent="flex-end">
                                <OrderReadOnlySummary />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </SimpleShowLayout>
    </Show>
);