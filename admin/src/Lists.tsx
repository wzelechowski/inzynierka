import { List, Datagrid, TextField, NumberField, BooleanField, DateField, EmailField, ChipField, FunctionField, ReferenceField, Link } from 'react-admin';
import { Chip, Box, Typography, Stack } from '@mui/material';
import { OrderItemsPanel } from './components/OrderItemsPanel';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { PromotionProposalPanel } from './components/PromotionProposalPanel';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'NEW': return 'info';           
        case 'IN_PROGRESS': return 'warning';
        case 'READY': return 'primary';     
        case 'COMPLETED': return 'success'; 
        case 'CANCELLED': return 'error';   
        default: return 'default';
    }
};

const getTypeColor = (type: string) => {
    return type === 'DELIVERY' ? 'secondary' : 'default';
};

const getDeliveryStatusColor = (status: string) => {
    switch (status) {
        case 'ASSIGNED': return 'warning'; 
        case 'PICKED_UP': return 'secondary';
        case 'DELIVERED': return 'success';
        case 'CANCELLED': return 'error';   
        case 'NEW': return 'info';          
        default: return 'default';
    }
};

const getScoreColor = (score: number) => {
    if (score > 20) return '#1b5e20'; 
    if (score > 10) return '#2e7d32'; 
    if (score > 5)  return '#ed6c02'; 
    return '#d32f2f';                 
};

export const PizzaList = () => (
    <List title="Pizza">
        <Datagrid rowClick="show">
            <TextField source="id" label="Id" />
            <TextField source="name" label="Nazwa" />
            <TextField source="pizzaSize" label="Rozmiar" />
        </Datagrid>
    </List>
);

export const DrinkList = () => (
    <List title="Napoje">
        <Datagrid rowClick="show">
            <TextField source="id" label="Id" />
            <TextField source="name" label="Nazwa" />
            <NumberField source="volume" label="Pojemność" />
        </Datagrid>
    </List>
);

export const ExtraList = () => (
    <List title="Dodatki">
        <Datagrid rowClick="show">
            <TextField source="id" label="Id" />
            <TextField source="name" label="Nazwa" />
            <NumberField source="weight" label="Waga" />
        </Datagrid>
    </List>
);

export const IngredientList = () => (
    <List title="Składniki">
        <Datagrid rowClick="show">
            <TextField source="name" label="Nazwa" />
            <NumberField source="price" label="Cena" options={{ style: 'currency', currency: 'PLN' }} />
            <BooleanField source="isVegan" label="Wegański" />
            <BooleanField source="isSpicy" label="Ostry" />
        </Datagrid>
    </List>
);

export const MenuItemList = () => (
    <List title="Menu item">
        <Datagrid rowClick="show">
            <TextField source='id' label='Id'/>
            
            <FunctionField 
                label="Item ID (Link)"
                render={(record: any) => {
                    if (!record || !record.itemId || !record.type) return "-";

                    let resource = "";
                    switch(record.type) {
                        case 'PIZZA': resource = 'pizzas'; break;
                        case 'DRINK': resource = 'drinks'; break;
                        case 'EXTRA': resource = 'extras'; break; 
                        default: return record.itemId;
                    }

                    return (
                        <Link 
                            to={`/${resource}/${record.itemId}/show`} 
                            style={{ 
                                textDecoration: 'none', 
                                color: '#1976d2',
                                fontWeight: 'bold',
                                fontFamily: 'monospace',
                                borderBottom: '1px dashed #1976d2'
                            }}
                            onClick={(e) => e.stopPropagation()} 
                        >
                            {record.itemId}
                        </Link>
                    );
                }}
            />
            <TextField source='type' label='Typ'/>
            <TextField source='name' label='Nazwa'/>
            <TextField source='description' label='Opis'/>
            <NumberField source='basePrice' label='Cena bazowa' options={{ style: 'currency', currency: 'PLN' }}/>
            <BooleanField source='isAvailable' label='Dostępny'/>
        </Datagrid>
    </List>
);

export const OrderList = () => (
    <List title="Zamówienia" sort={{ field: 'createdAt', order: 'DESC' }}>
        <Datagrid 
            rowClick="expand" 
            expand={<OrderItemsPanel />} 
            sx={{
                '& .RaDatagrid-headerCell': { fontWeight: 'bold' },
            }}
        >
            <TextField source="id" label="ID" />
            <FunctionField 
                label="Status"
                render={(record: any) => (
                    <Chip 
                        label={record.status} 
                        color={getStatusColor(record.status)} 
                        size="small" 
                    />
                )}
            />

            <FunctionField 
                label="Typ"
                render={(record: any) => (
                    <Chip 
                        label={record.type} 
                        color={getTypeColor(record.type)} 
                        variant="outlined"
                        size="small" 
                    />
                )}
            />

            <NumberField 
                source="totalPrice" 
                label="Kwota" 
                options={{ style: 'currency', currency: 'PLN' }} 
                sx={{ fontWeight: 'bold' }}
            />
            
            <DateField source="createdAt" label="Złożono" showTime />
            <DateField source="completedAt" label="Zakończono" showTime />
        </Datagrid>
    </List>
);

export const DeliveryList = () => (
    <List title="Dostawy" sort={{ field: 'assignedAt', order: 'DESC' }}>
        <Datagrid rowClick="show">
            <TextField 
                source="id" 
                label="ID" 
                sx={{ fontFamily: 'monospace', fontSize: '0.8em', color: 'gray' }} 
            />

            <FunctionField
                label="ID Zamówienia"
                render={(record: any) => {
                    if (!record || !record.orderId) return "-";

                    return (
                        <Link 
                            to={`/orders/${record.orderId}/show`}
                            style={{ 
                                textDecoration: 'none', 
                                color: '#1976d2', 
                                fontWeight: 'bold',
                                fontFamily: 'monospace'
                            }}
                            onClick={(e) => e.stopPropagation()} 
                        >
                            {record.orderId}
                        </Link>
                    );
                }}
            />

            <FunctionField 
                label="Status"
                render={(record: any) => (
                    <Chip 
                        label={record.status} 
                        color={getDeliveryStatusColor(record.status)} 
                        size="small" 
                        variant={record.status === 'DELIVERED' ? 'filled' : 'outlined'}
                    />
                )}
            />

            <FunctionField 
                label="Adres dostawy"
                render={(record: any) => (
                    <div style={{ lineHeight: '1.2' }}>
                        <span style={{ fontWeight: 'bold' }}>{record.deliveryAddress}</span>
                        <br />
                        <span style={{ fontSize: '0.85em', color: '#666' }}>
                            {record.postalCode} {record.deliveryCity}
                        </span>
                    </div>
                )}
            />

            <DateField 
                source="assignedAt" 
                label="Przypisano" 
                showTime 
                options={{ hour: '2-digit', minute: '2-digit' }}
                emptyText="-"
            />
            
            <DateField 
                source="deliveredAt" 
                label="Dostarczono" 
                showTime 
                options={{ hour: '2-digit', minute: '2-digit' }}
                sx={{ fontWeight: 'bold', color: 'green' }}
                emptyText="-"
            />
        </Datagrid>
    </List>
);

export const UserList = () => (
    <List title="Klienci">
        <Datagrid rowClick="show">
            <TextField source='id' label='Id'/>
            <EmailField source="email" label="Email" />
            <TextField source="firstName" label="Imię" />
            <TextField source="lastName" label="Nazwisko" />
            <FunctionField 
                label="Role" 
                render={(record: any) => {
                    if (!record || !record.roles || !Array.isArray(record.roles)) return null;
                    return (
                        <Stack direction="row" spacing={1}>
                            {record.roles.map((role: string, index: number) => {
                                const color = role.includes('ADMIN') ? 'error' : 'primary';
                                const label = role.replace('ROLE_', '');

                                return (
                                    <Chip 
                                        key={index} 
                                        label={label} 
                                        color={color} 
                                        size="small" 
                                        variant="outlined" 
                                    />
                                );
                            })}
                        </Stack>
                    );
                }}
            />

            <TextField source="phoneNumber" label="Telefon" />
        </Datagrid>
    </List>
);

export const PromotionList = () => (
    <List title="Promocje">
        <Datagrid rowClick="show">
            <TextField source="id" label="ID" sx={{ fontFamily: 'monospace', color: 'gray' }} />
            <TextField source="name" label="Nazwa Promocji" sx={{ fontWeight: 'bold' }} />
            <FunctionField 
                label="Status"
                render={(record: any) => (
                    <Chip 
                        label={record.active ? "AKTYWNA" : "NIEAKTYWNA"} 
                        color={record.active ? "success" : "default"} 
                        size="small" 
                        variant={record.active ? "filled" : "outlined"}
                    />
                )}
            />

            <NumberField 
                source="discount" 
                label="Rabat" 
                options={{ style: 'percent', maximumFractionDigits: 0 }} 
                sx={{ fontWeight: 'bold', color: '#d32f2f' }}
            />

            <DateField source="startDate" label="Od" />
            <DateField source="endDate" label="Do" />

            <FunctionField 
                label="Typ"
                render={(record: any) => record.proposal ? "🤖 AI" : "Ręczna"}
            />
        </Datagrid>
    </List>
);

export const SupplierList = () => (
    <List title="Dostawcy / Kurierzy">
        <Datagrid rowClick="show">
            <TextField source="id" label="ID" />
            <TextField source="firstName" label="Imię" />
            <TextField source="lastName" label="Nazwisko" />
            <TextField source="phoneNumber" label="Telefon" />
            <ChipField source="status" label="Status" />
        </Datagrid>
    </List>
);

export const PromotionProposalList = () => (
    <List 
        title="Propozycje Promocji (AI)" 
        sort={{ field: 'score', order: 'DESC' }}
        perPage={25}
    >
        <Datagrid 
            rowClick="expand"
            expand={<PromotionProposalPanel />}
            sx={{
                '& .RaDatagrid-headerCell': { fontWeight: 'bold', backgroundColor: '#fafafa' },
            }}
        >
            <TextField 
                source="id" 
                label="ID" 
                sx={{ fontFamily: 'monospace', color: '#999', fontSize: '0.85em', maxWidth: 80 }} 
            />

            <FunctionField 
                label="Uzasadnienie AI"
                render={(record: any) => (
                    <Box display="flex" alignItems="center" gap={1}>
                        <AutoAwesomeIcon sx={{ color: '#fbc02d', fontSize: 18 }} />
                        <Typography variant="body2" fontWeight="500">
                            {record.reason}
                        </Typography>
                    </Box>
                )}
            />

            <FunctionField 
                label="Typ"
                render={(record: any) => (
                    <Chip 
                        label={record.effectType} 
                        size="small" 
                        variant="outlined" 
                        sx={{ borderColor: '#ddd', color: '#555' }}
                    />
                )}
            />

            <NumberField 
                source="discount" 
                label="Rabat" 
                options={{ style: 'percent' }} 
                sx={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.1em' }}
            />

            <NumberField 
                source="confidence" 
                label="Pewność" 
                options={{ style: 'percent' }} 
                sx={{ color: '#666' }}
            />
            
            <NumberField 
                source="lift" 
                label="Lift" 
                options={{ maximumFractionDigits: 2 }} 
                sx={{ color: '#666' }}
            />
            
            <FunctionField 
                label="AI Score"
                source="score"
                render={(record: any) => (
                    <Box 
                        sx={{ 
                            backgroundColor: getScoreColor(record.score),
                            color: '#fff',
                            borderRadius: '16px',
                            padding: '4px 12px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            display: 'inline-block',
                            minWidth: '60px'
                        }}
                    >
                        {record.score?.toFixed(2)}
                    </Box>
                )}
            />
        </Datagrid>
    </List>
);