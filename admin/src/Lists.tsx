import { List, Datagrid, TextField, NumberField, BooleanField, DateField, EmailField, ChipField, FunctionField, Link, TopToolbar, ExportButton, CreateButton } from 'react-admin';
import { Chip, Box, Typography, Stack } from '@mui/material';
import { OrderItemsPanel } from './components/panel/OrderItemsPanel';
import { PromotionProposalPanel } from './components/panel/PromotionProposalPanel';
import { GenerateProposalsButton } from './components/actions/GenerateProposalsButton';

const linkStyle = {
    textDecoration: 'none',
    color: '#1976d2',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    borderBottom: '1px dashed #1976d2',
    cursor: 'pointer'
};

const idStyle = {
    fontFamily: 'monospace',
    color: '#7f8c8d',
    fontSize: '0.85em'
};

const gridStyle = {
    '& .RaDatagrid-headerCell': { 
        fontWeight: 'bold', 
        backgroundColor: '#fafafa',
        color: '#2c3e50'
    },
};

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

const ListActions = () => (
    <TopToolbar>
        <GenerateProposalsButton />
        <CreateButton/>
        <ExportButton />
    </TopToolbar>
);


export const PizzaList = () => (
    <List title="Pizza">
        <Datagrid rowClick="show" sx={gridStyle}>
            <TextField source="id" label="Id" sx={idStyle} />
            <TextField source="name" label="Nazwa" sx={{ fontWeight: '500' }} />
            <TextField source="pizzaSize" label="Rozmiar" />
        </Datagrid>
    </List>
);

export const DrinkList = () => (
    <List title="Napoje">
        <Datagrid rowClick="show" sx={gridStyle}>
            <TextField source="id" label="Id" sx={idStyle} />
            <TextField source="name" label="Nazwa" sx={{ fontWeight: '500' }} />
            <NumberField source="volume" label="Pojemność" />
        </Datagrid>
    </List>
);

export const ExtraList = () => (
    <List title="Dodatki">
        <Datagrid rowClick="show" sx={gridStyle}>
            <TextField source="id" label="Id" sx={idStyle} />
            <TextField source="name" label="Nazwa" sx={{ fontWeight: '500' }} />
            <NumberField source="weight" label="Waga" />
        </Datagrid>
    </List>
);

export const IngredientList = () => (
    <List title="Składniki">
        <Datagrid rowClick="show" sx={gridStyle}>
            <TextField source="id" label="ID" sx={idStyle} />
            <TextField source="name" label="Nazwa" sx={{ fontWeight: '500' }} />
            <NumberField source="weight" label="Waga (kg)" />
        </Datagrid>
    </List>
);

export const MenuItemList = () => (
    <List title="Menu">
        <Datagrid rowClick="show" sx={gridStyle}>
            <TextField source='id' label='Id' sx={idStyle}/>
            
            <FunctionField 
                label="Powiązany obiekt (Link)"
                sortBy="itemId"
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
                            style={linkStyle}
                            onClick={(e) => e.stopPropagation()} 
                        >
                            {record.itemId}
                        </Link>
                    );
                }}
            />
            <TextField source='type' label='Typ'/>
            <TextField source='name' label='Nazwa' sx={{ fontWeight: 'bold' }}/>
            <TextField source='description' label='Opis' sx={{ fontStyle: 'italic', color: '#666' }}/>
            <NumberField source='basePrice' label='Cena' options={{ style: 'currency', currency: 'PLN' }} sx={{ fontWeight: 'bold' }}/>
            <BooleanField source='isAvailable' label='Dostępny'/>
        </Datagrid>
    </List>
);

export const OrderList = () => (
    <List title="Zamówienia" sort={{ field: 'createdAt', order: 'DESC' }}>
        <Datagrid 
            rowClick="show" 
            expand={<OrderItemsPanel />} 
            sx={gridStyle}
        >
            <TextField source="id" label="ID" sx={idStyle} />
            
            <FunctionField 
                label="Status"
                sortBy="status"
                render={(record: any) => (
                    <Chip 
                        label={record.status} 
                        color={getStatusColor(record.status)} 
                        size="small" 
                        variant="filled"
                    />
                )}
            />

            <FunctionField 
                label="Typ"
                sortBy="type"
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
                sx={{ fontWeight: 'bold', fontSize: '1.05em' }}
            />
            
            <DateField source="createdAt" label="Złożono" showTime options={{ hour: '2-digit', minute: '2-digit' }} />
            <DateField source="completedAt" label="Zakończono" showTime options={{ hour: '2-digit', minute: '2-digit' }} emptyText="-" />
        </Datagrid>
    </List>
);

export const DeliveryList = () => (
    <List title="Dostawy" sort={{ field: 'assignedAt', order: 'DESC' }}>
        <Datagrid rowClick="show" sx={gridStyle}>
            <TextField source="id" label="ID" sx={idStyle} />

            <FunctionField
                label="ID Zamówienia"
                sortBy="orderId"
                render={(record: any) => {
                    if (!record || !record.orderId) return "-";
                    return (
                        <Link 
                            to={`/orders/${record.orderId}/show`}
                            style={linkStyle}
                            onClick={(e) => e.stopPropagation()} 
                        >
                            {record.orderId}
                        </Link>
                    );
                }}
            />

            <FunctionField 
                label="Status"
                sortBy="status"
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
                sortBy="deliveryAddress"
                render={(record: any) => (
                    <div style={{ lineHeight: '1.2' }}>
                        <span style={{ fontWeight: '500' }}>{record.deliveryAddress}</span>
                        <br />
                        <span style={{ fontSize: '0.8em', color: '#666' }}>
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
        <Datagrid rowClick="show" sx={gridStyle}>
            <TextField source='id' label='Id' sx={idStyle}/>
            <EmailField source="email" label="Email" sx={{ fontWeight: '500', textDecoration: 'none' }} />
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

            <TextField source="phoneNumber" label="Telefon" emptyText="-" />
        </Datagrid>
    </List>
);

export const PromotionList = () => (
    <List title="Promocje" sort={{ field: 'createdAt', order: 'DESC' }}>
        <Datagrid rowClick="show" sx={gridStyle}>
            <TextField source="id" label="ID" sx={idStyle} />
            <TextField source="name" label="Nazwa Promocji" sx={{ fontWeight: 'bold' }} />
            
            <FunctionField 
                label="Status"
                sortBy="active"
                render={(record: any) => (
                    <Chip 
                        label={record.active ? "AKTYWNA" : "NIEAKTYWNA"} 
                        color={record.active ? "success" : "default"} 
                        size="small" 
                        variant={record.active ? "filled" : "outlined"}
                    />
                )}
            />
            
            <FunctionField 
                label="Typ efektu"
                sortBy="effectType"
                render={(record: any) => (
                    <Chip 
                        label={record.effectType} 
                        size="small" 
                        variant="outlined" 
                        sx={{ borderColor: '#ddd', color: '#555' }}
                    />
                )}
            />

            <FunctionField 
                label="Wartość rabatu"
                sortBy="discount"
                render={(record: any) => {
                    const style = { color: '#d32f2f', fontWeight: 'bold', fontSize: '1.05em' };
                    const effectType = record.proposal?.effectType || record.effectType;

                    if (effectType === 'FIXED') {
                        return <span style={style}>{record.discount.toFixed(2)} zł</span>;
                    }
                    if (effectType === 'PERCENT') {
                        return <span style={style}>{(record.discount * 100).toFixed(0)}%</span>;
                    }
                    return <span style={{...style, color: 'green'}}>GRATIS</span>;
                }}
            />

            <DateField source="startDate" label="Od" />
            <DateField source="endDate" label="Do" />
        </Datagrid>
    </List>
);

export const SupplierList = () => (
    <List title="Dostawcy">
        <Datagrid rowClick="show" sx={gridStyle}>
            <TextField source="id" label="ID Dostawcy" sx={idStyle} />
            
            <FunctionField
                label="ID Użytkownika"
                sortBy="userProfileId"
                render={(record: any) => {
                    if (!record || !record.userProfileId) return "-";
                    return (
                        <Link 
                            to={`/users/${record.userProfileId}/show`}
                            style={linkStyle}
                            onClick={(e) => e.stopPropagation()} 
                        >
                            {record.userProfileId}
                        </Link>
                    );
                }}
            />
            <TextField source="firstName" label="Imię" />
            <TextField source="lastName" label="Nazwisko" />
            <TextField source="phoneNumber" label="Telefon" />
            <ChipField source="status" label="Status" variant="outlined" />
        </Datagrid>
    </List>
);

export const PromotionProposalList = () => (
    <List 
        title="Propozycje Promocji (AI)" 
        sort={{ field: 'createdAt', order: 'DESC' }}
        perPage={25}
        actions={<ListActions />}
    >
        <Datagrid 
            rowClick="expand"
            expand={<PromotionProposalPanel />}
            sx={gridStyle}
        >
            <TextField source="id" label="ID" sx={idStyle} />
            
            <FunctionField 
                label="Uzasadnienie (Apriori)"
                sortBy="reason"
                render={(record: any) => (
                    <Typography variant="body2" sx={{ fontWeight: '500', color: '#34495e' }}>
                        {record.reason}
                    </Typography>
                )}
            />

            <FunctionField 
                label="Typ"
                sortBy="effectType"
                render={(record: any) => (
                    <Chip 
                        label={record.effectType} 
                        size="small" 
                        variant="outlined" 
                        sx={{ borderColor: '#bdc3c7', color: '#7f8c8d' }}
                    />
                )}
            />

            <FunctionField 
                label="Rabat"
                sortBy="discount"
                render={(record: any) => {
                    const style = { color: '#d32f2f', fontWeight: 'bold' };
                    if (record.effectType === 'FIXED') {
                        return <span style={style}>{record.discount.toFixed(2)} zł</span>;
                    }
                    if (record.effectType === 'PERCENT') {
                        return <span style={style}>{(record.discount * 100).toFixed(0)}%</span>;
                    }
                    return <span style={{...style, color: 'green'}}>GRATIS</span>;
                }}
            />

            <NumberField 
                source="support" 
                label="Support" 
                options={{ style: 'percent', minimumFractionDigits: 1 }} 
                sx={{ color: '#7f8c8d', fontSize: '0.9em' }}
            />
            
            <NumberField 
                source="confidence" 
                label="Confidence" 
                options={{ style: 'percent', minimumFractionDigits: 1 }} 
                sx={{ color: '#7f8c8d', fontSize: '0.9em' }}
            />
            
            <NumberField 
                source="lift" 
                label="Lift" 
                options={{ maximumFractionDigits: 2 }} 
                sx={{ color: '#7f8c8d', fontSize: '0.9em' }}
            />
            
            <FunctionField 
                label="AI Score"
                source="score"
                sortBy="score"
                render={(record: any) => (
                    <Box 
                        sx={{ 
                            backgroundColor: getScoreColor(record.score),
                            color: '#fff',
                            borderRadius: '12px',
                            padding: '2px 10px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.85em',
                            display: 'inline-block',
                            minWidth: '50px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        {record.score?.toFixed(2)}
                    </Box>
                )}
            />

            <DateField source="createdAt" label="Stworzono" showTime options={{ hour: '2-digit', minute: '2-digit' }} />
        </Datagrid>
    </List>
);