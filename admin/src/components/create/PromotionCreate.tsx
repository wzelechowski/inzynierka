import { useEffect, useState } from 'react';
import { 
    Create, SimpleForm, TextInput, NumberInput, 
    DateTimeInput, SelectInput, required, 
    ReferenceInput, AutocompleteInput, 
    useRecordContext, useChoicesContext, useDataProvider
} from 'react-admin';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const ProductNamesFetcher = () => {
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const [names, setNames] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!record || !record.products || !Array.isArray(record.products) || record.products.length === 0) {
            setNames(record?.products ? '(Brak produktów)' : '');
            setLoading(false);
            return;
        }

        const fetchNames = async () => {
            try {
                const ids = record.products
                    .map((p: any) => p?.productId)
                    .filter((id: any) => id);
                
                const uniqueIds = Array.from(new Set(ids)) as string[];

                if (uniqueIds.length === 0) {
                    setNames('(Brak ID)');
                    setLoading(false);
                    return;
                }

                const { data } = await dataProvider.getMany('menuItems', { ids: uniqueIds });

                if (data && data.length > 0) {
                    const namesList = data.map(item => item.name);
                    setNames(namesList.join(', '));
                } else {
                    setNames('(Nie znaleziono nazw)');
                }
            } catch (error) {
                setNames('Błąd API');
            } finally {
                setLoading(false);
            }
        };

        fetchNames();
    }, [record, dataProvider]);

    if (loading) return <CircularProgress size={10} thickness={5} />;
    return <span style={{ fontWeight: 600, color: '#555' }}>{names}</span>;
};

const ProposalOption = () => {
    const record = useRecordContext();
    if (!record) return null;

    let label = '';
    let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "default";

    const effect = record.effectType || 'UNKNOWN';

    switch (effect) {
        case 'DISCOUNT_PERCENT':
        case 'PERCENT':
            const val = record.discount ? (record.discount * 100).toFixed(0) : '0';
            label = `-${val}%`;
            color = 'error'; 
            break;
        case 'DISCOUNT_FIXED':
        case 'FIXED':
            label = `-${record.discount || 0} PLN`;
            color = 'warning'; 
            break;
        case 'FREE_ITEM':
        case 'FREE_PRODUCT':
        case 'GRATIS':
            label = 'GRATIS';
            color = 'success'; 
            break;
        default:
            label = 'RĘCZNA';
            color = 'default';
    }

    return (
        <Box display="flex" alignItems="center" gap={1} width="100%" py={0.5} sx={{ borderBottom: '1px solid #f0f0f0' }}>
            <Chip label={label} color={color} size="small" icon={<LocalOfferIcon />} sx={{ minWidth: 90, fontWeight: 'bold' }} />
            <Box display="flex" flexDirection="column" sx={{ overflow: 'hidden', width: '100%' }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: '500' }}>
                    {record.reason || record.name || 'Promocja ręczna'}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ whiteSpace: 'normal', lineHeight: 1.2, mt: 0.5 }}>
                    {record.products && record.products.length > 0 && <ProductNamesFetcher />}
                    {record.score != null && <span style={{ marginLeft: 8, color: '#1976d2' }}>| Score: {Number(record.score).toFixed(1)}</span>}
                </Typography>
            </Box>
        </Box>
    );
};

const DiscountInputWithLogic = () => {
    const { setValue, watch, clearErrors } = useFormContext();
    const discountType = watch('discountType');
    const isFree = discountType === 'FREE_PRODUCT';

    useEffect(() => {
        if (isFree) {
            setValue('discount', 0, { shouldValidate: true, shouldDirty: true });
            clearErrors('discount');
        }
    }, [isFree, setValue, clearErrors]);

    return (
        <NumberInput 
            source="discount" 
            label={isFree ? "Wartość (Gratis)" : "Wartość rabatu"} 
            min={0} 
            step={0.01}
            validate={(value, allValues) => {
                if (allValues.discountType === 'FREE_PRODUCT') return undefined;
                return value != null && value !== '' ? undefined : 'Wymagane';
            }}
            disabled={isFree} 
            helperText={isFree ? "Produkt darmowy (0.00)" : "Wpisz wartość (np. 15)"}
            sx={{ flex: 1 }}
        />
    );
};

const ProposalSelector = (props: any) => {
    const { setValue, watch, clearErrors } = useFormContext();
    const { allChoices } = useChoicesContext(); 
    const proposalId = watch('proposalId');

    useEffect(() => {
        if (!proposalId || !allChoices) return;
        const proposal = allChoices.find((p: any) => p.id === proposalId);

        if (proposal) {
            const type = proposal.effectType || '';
            
            if (['FREE_ITEM', 'FREE_PRODUCT', 'GRATIS'].includes(type)) {
                setValue('discountType', 'FREE_PRODUCT', { shouldValidate: true });
                setValue('discount', 0, { shouldValidate: true });
                clearErrors('discount');
            }
            else if (['DISCOUNT_PERCENT', 'PERCENT'].includes(type)) {
                setValue('discountType', 'PERCENT', { shouldValidate: true });
                const d = proposal.discount || 0;
                const val = d < 1 ? (d * 100).toFixed(0) : d;
                setValue('discount', Number(val), { shouldValidate: true });
            }
            else if (['DISCOUNT_FIXED', 'FIXED'].includes(type)) {
                setValue('discountType', 'FIXED', { shouldValidate: true });
                setValue('discount', Number(proposal.discount || 0), { shouldValidate: true });
            }
        }
    }, [proposalId, allChoices, setValue, clearErrors]);

    return (
        <AutocompleteInput 
            {...props}
            label="Wybierz propozycję (AI lub Ręczną)"
            optionText={<ProposalOption />} 
            inputText={(record: any) => {
                if (!record) return '';
                return record.reason || record.name || 'Promocja';
            }}
            filterToQuery={(searchText: string) => ({ q: searchText })}
            fullWidth 
        />
    );
};

const transform = (data: any) => {
    const isFree = data.discountType === 'FREE_PRODUCT';

    return {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        discount: isFree ? 0 : Number(data.discount),
        effectType: data.effectType,
        proposalId: data.proposalId || null 
    };
};

export const PromotionCreate = () => (
    <Create title="Nowa Promocja" redirect="list" transform={transform}>
        <SimpleForm>
            <Typography variant="h6" gutterBottom>1. Podstawowe informacje</Typography>
            <TextInput source="name" label="Nazwa Promocji" validate={required()} fullWidth />

            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                <DateTimeInput source="startDate" label="Data rozpoczęcia" validate={required()} sx={{ flex: 1 }} />
                <DateTimeInput source="endDate" label="Data zakończenia" validate={required()} sx={{ flex: 1 }} />
            </div>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>2. Konfiguracja Rabatu</Typography>
            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                <SelectInput 
                    source="effectType" 
                    label="Typ Rabatu" 
                    defaultValue="PERCENT"
                    validate={required()}
                    choices={[
                        { id: 'PERCENT', name: 'Procent (%)' },
                        { id: 'FIXED', name: 'Kwota (PLN)' },
                        { id: 'FREE_PRODUCT', name: 'Darmowy produkt' },
                    ]}
                    sx={{ flex: 1 }}
                />
                <DiscountInputWithLogic />
            </div>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>3. Powiązania</Typography>
            
            <ReferenceInput source="proposalId" reference="promotionProposals">
                <ProposalSelector />
            </ReferenceInput>

        </SimpleForm>
    </Create>
);