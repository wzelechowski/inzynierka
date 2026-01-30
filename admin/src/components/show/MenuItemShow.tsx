import { 
    Show, SimpleShowLayout, TextField, NumberField, 
    FunctionField, ReferenceField, 
    useRecordContext, 
    SelectField
} from 'react-admin';
import { Box, Typography, Chip } from '@mui/material';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import KitchenIcon from '@mui/icons-material/Kitchen';

const ItemReferenceField = () => {
    const record = useRecordContext();
    if (!record) return null;

    let resourceName = '';
    let icon = null;

    switch (record.type) {
        case 'PIZZA':
            resourceName = 'pizzas';
            icon = <LocalPizzaIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />;
            break;
        case 'DRINK':
            resourceName = 'drinks';
            icon = <LocalBarIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />;
            break;
        case 'EXTRA': 
            resourceName = 'extras';
            icon = <KitchenIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />;
            break;
        default:
            return <span>Nieznany typ</span>;
    }

    return (
        <Box display="flex" alignItems="center">
            {icon}
            <ReferenceField source="itemId" reference={resourceName} link="show">
                <TextField source="name" sx={{ fontWeight: 'bold', textDecoration: 'underline' }} />
            </ReferenceField>
            <Typography variant="caption" sx={{ ml: 1, color: 'gray' }}>
                (ID: {record.itemId})
            </Typography>
        </Box>
    );
};

export const MenuItemShow = () => (
    <Show title="Szczegóły elementu menu">
        <SimpleShowLayout>
            <Box display="flex" justifyContent="space-between" width="100%">
                <Box>
                    <Typography variant="caption" display="block">ID Elementu</Typography>
                    <TextField source="id" />
                </Box>
                <Box>
                    <SelectField 
                        source="isAvailable" 
                        label="Dostępność"
                        choices={[
                            { id: true, name: 'Dostępny' },
                            { id: false, name: 'Niedostępny' },
                        ]}
                    />                
                </Box>
            </Box>

            <hr style={{ width: '100%', border: '0', borderTop: '1px solid #eee', margin: '10px 0' }} />

            <Typography variant="h6" color="primary">Powiązanie techniczne</Typography>
            
            <FunctionField 
                label="Typ" 
                render={(record: any) => (
                    <Chip label={record.type} size="small" color="default" />
                )} 
            />
            
            <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1, mt: 1, mb: 2 }}>
                <Typography variant="caption" color="primary">Powiązany produkt z magazynu:</Typography>
                <ItemReferenceField />
            </Box>

            <Typography variant="h6" color="primary">Widoczne w Menu</Typography>
            <TextField source="name" label="Nazwa w karcie" sx={{ fontSize: '1.2em', fontWeight: 'bold' }} />
            <TextField source="description" label="Opis" />
            <NumberField 
                source="basePrice" 
                label="Cena (PLN)" 
                options={{ style: 'currency', currency: 'PLN' }} 
                sx={{ fontSize: '1.5em', color: 'green', mt: 1, display: 'block' }}
            />

        </SimpleShowLayout>
    </Show>
);