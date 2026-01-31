import { 
    Create, SimpleForm, TextInput, NumberInput, 
    BooleanInput, SelectInput, ReferenceInput, 
    FormDataConsumer, required 
} from 'react-admin';
import { Box, Typography, Alert } from '@mui/material';

export const MenuItemCreate = () => (
    <Create title="Dodaj nowy element menu" redirect="list">
        <SimpleForm>
            <Typography variant="h6" gutterBottom>1. Wybierz co dodajesz</Typography>
            <SelectInput 
                source="type" 
                label="Typ elementu" 
                validate={required()}
                choices={[
                    { id: 'PIZZA', name: 'Pizza' },
                    { id: 'DRINK', name: 'Napój' },
                    { id: 'EXTRA', name: 'Dodatek' }, 
                ]}
                helperText="Wybierz kategorię, aby załadować listę produktów"
            />

            <FormDataConsumer>
                {({ formData }) => {
                    if (!formData.type) return null;

                    let resourceName = '';
                    let label = '';

                    switch (formData.type) {
                        case 'PIZZA':
                            resourceName = 'pizzas';
                            label = 'Wybierz Pizzę z bazy';
                            break;
                        case 'DRINK':
                            resourceName = 'drinks';
                            label = 'Wybierz Napój z bazy';
                            break;
                        case 'EXTRA':
                            resourceName = 'extras';
                            label = 'Wybierz Dodatek z bazy';
                            break;
                        default:
                            return <Alert severity="warning">Wybierz poprawny typ</Alert>;
                    }

                    return (
                        <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                            <ReferenceInput 
                                source="itemId" 
                                reference={resourceName} 
                            >
                                <SelectInput 
                                    label={label} 
                                    optionText="name"
                                    validate={required()} 
                                    fullWidth
                                    helperText={`To pole przypisze ID z tabeli ${resourceName}`}
                                />
                            </ReferenceInput>
                        </Box>
                    );
                }}
            </FormDataConsumer>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>2. Szczegóły w Menu</Typography>
            <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                Wpisz nazwę i cenę, które zobaczy klient w menu (mogą się różnić od nazwy technicznej).
            </Typography>

            <TextInput source="name" label="Nazwa wyświetlana w Menu" validate={required()} fullWidth />
            
            <TextInput source="description" label="Opis (np. składniki)" multiline rows={3} fullWidth />

            <Box display="flex" gap={2}>
                <NumberInput 
                    source="basePrice" 
                    label="Cena w Menu (PLN)" 
                    min={0} 
                    step={0.01} 
                    validate={required()} 
                />

                <BooleanInput 
                    source="isAvailable" 
                    label="Dostępny w sprzedaży?" 
                    defaultValue={true} 
                    sx={{ mt: 1 }}
                />
            </Box>

        </SimpleForm>
    </Create>
);