import { 
    Edit, SimpleForm, TextInput, NumberInput, 
    BooleanInput, SelectInput, ReferenceInput, 
    FormDataConsumer, required 
} from 'react-admin';
import { Box, Typography, Alert } from '@mui/material';

// =====================================================================
// TRANSFORMACJA (Naprawiona: pobiera typ z previousData)
// =====================================================================
// React Admin przekazuje: (data, { previousData })
const transform = (data: any, { previousData }: any) => {
    return {
        // 1. Pola edytowalne bierzemy z 'data' (formularza)
        name: data.name,
        description: data.description,
        basePrice: Number(data.basePrice),
        isAvailable: data.isAvailable,
        itemId: data.itemId,

        // 2. NAPRAWA: Jeśli 'type' jest disabled, nie ma go w 'data'.
        // Bierzemy go więc z 'previousData' (rekordu z bazy).
        type: data.type || previousData.type,
    };
};

export const MenuItemEdit = () => (
    <Edit title="Edycja elementu menu" transform={transform}>
        <SimpleForm>
            <Typography variant="h6" gutterBottom>1. Konfiguracja produktu</Typography>

            {/* Ten SelectInput tylko wyświetla wartość, nie wysyła jej, bo jest disabled */}
            <SelectInput 
                source="type" 
                label="Typ elementu" 
                disabled 
                choices={[
                    { id: 'PIZZA', name: 'Pizza' },
                    { id: 'DRINK', name: 'Napój' },
                    { id: 'INGREDIENT', name: 'Dodatek / Składnik' },
                ]}
            />

            <FormDataConsumer>
                {({ formData }) => {
                    // Tutaj korzystamy z formData.type. 
                    // React Admin zazwyczaj trzyma wartość w stanie formularza nawet jak jest disabled,
                    // więc widok powinien się renderować poprawnie.
                    if (!formData.type) return null;

                    let resourceName = '';
                    let label = '';

                    switch (formData.type) {
                        case 'PIZZA':
                            resourceName = 'pizzas';
                            label = 'Powiązana Pizza';
                            break;
                        case 'DRINK':
                            resourceName = 'drinks';
                            label = 'Powiązany Napój';
                            break;
                        case 'INGREDIENT': 
                        case 'EXTRA':
                            resourceName = 'extras';
                            label = 'Powiązany Dodatek';
                            break;
                        default:
                            return <Alert severity="warning">Nieznany typ produktu</Alert>;
                    }

                    return (
                        <Box sx={{ mb: 2, p: 2, bgcolor: '#FFF3E0', borderRadius: 1, border: '1px solid #FFCC80' }}>
                            <Typography variant="caption" sx={{fontWeight: 'bold', color: '#E65100'}}>
                                EDYCJA POWIĄZANIA
                            </Typography>
                            <ReferenceInput 
                                source="itemId" 
                                reference={resourceName} 
                            >
                                <SelectInput 
                                    label={label} 
                                    optionText="name"
                                    validate={required()} 
                                    fullWidth
                                />
                            </ReferenceInput>
                        </Box>
                    );
                }}
            </FormDataConsumer>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>2. Szczegóły wyświetlane klientowi</Typography>

            <TextInput source="name" label="Nazwa w Menu" validate={required()} fullWidth />
            <TextInput source="description" label="Opis" multiline rows={3} fullWidth />

            <Box display="flex" gap={2}>
                <NumberInput 
                    source="basePrice" 
                    label="Cena (PLN)" 
                    min={0} 
                    step={0.01} 
                    validate={required()} 
                />

                <BooleanInput 
                    source="isAvailable" 
                    label="Dostępny w sprzedaży?" 
                    sx={{ mt: 1 }}
                />
            </Box>

        </SimpleForm>
    </Edit>
);