import { useEffect } from 'react';
import { 
    Create, SimpleForm, TextInput, NumberInput, 
    SelectInput, ReferenceArrayInput, SelectArrayInput, 
    required, 
} from 'react-admin';
import { Box, Typography, Divider } from '@mui/material';
import { useFormContext } from 'react-hook-form';

const transform = (data: any) => {
    return {
        ...data,
        discount: data.effectType === 'FREE_PRODUCT' ? 0 : data.discount
    };
};

const DiscountInputWithLogic = () => {
    const { setValue, watch } = useFormContext();
    const effectType = watch('effectType');
    const isFree = effectType === 'FREE_PRODUCT';

    useEffect(() => {
        if (isFree) {
            setValue('discount', 0);
        }
    }, [isFree, setValue]);

    return (
        <NumberInput 
            source="discount" 
            label={isFree ? "Wartość (Gratis)" : "Wartość (np. 0.15 lub 10)"}
            validate={required()} 
            min={0}
            step={0.01}
            disabled={isFree}
            sx={{ width: '50%' }}
        />
    );
};

export const PromotionProposalCreate = () => (
    <Create title="Dodaj nową propozycję (Symulacja AI)" redirect="list" transform={transform}>
        <SimpleForm>
            <Typography variant="h6" sx={{ mt: 2 }}>1. Reguła Asocjacyjna</Typography>
            <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                Wybierz produkty, które tworzą regułę "Jeśli kupisz X, to dostaniesz Y".
            </Typography>

            <ReferenceArrayInput 
                source="antecedents" 
                reference="menuItems" 
                label="Antecedents (Jeśli klient kupi...)"
            >
                <SelectArrayInput 
                    optionText="name" 
                    validate={required()} 
                    helperText="Wybierz produkty wyzwalające regułę"
                    fullWidth
                />
            </ReferenceArrayInput>

            <ReferenceArrayInput 
                source="consequents" 
                reference="menuItems" 
                label="Consequents (...to proponujemy mu)"
            >
                <SelectArrayInput 
                    optionText="name" 
                    validate={required()} 
                    helperText="Wybierz produkty będące celem promocji"
                    fullWidth
                />
            </ReferenceArrayInput>

            <Divider sx={{ my: 3, width: '100%' }} />

            <Typography variant="h6">2. Szczegóły Oferty</Typography>
            
            <Box display="flex" gap={2} mt={2} width="100%">
                
                <SelectInput 
                    source="effectType" 
                    label="Typ Efektu" 
                    validate={required()}
                    choices={[
                        { id: 'PERCENT', name: 'Rabat Procentowy (%)' },
                        { id: 'FIXED', name: 'Rabat Kwotowy (PLN)' },
                        { id: 'FREE_PRODUCT', name: 'Darmowy produkt' },
                    ]}
                    sx={{ width: '50%' }}
                />

                <DiscountInputWithLogic />
            </Box>

            <TextInput 
                source="reason" 
                label="Uzasadnienie (Reason)" 
                multiline 
                rows={2} 
                fullWidth 
                helperText="Opcjonalnie: Np. 'Wysokie prawdopodobieństwo zakupu'"
            />

        </SimpleForm>
    </Create>
);