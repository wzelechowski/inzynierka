// src/orders/OrderItemsPanel.tsx
import { useState, useEffect } from 'react';
import { useRecordContext, LoadingIndicator } from 'react-admin';
import { 
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, 
    Paper, Chip, Stack 
} from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { MenuItemService } from '../service/menuItemService'; // <--- Twój service

export const OrderItemsPanel = () => {
    const record = useRecordContext();
    
    // Tutaj trzymamy nazwy: { "uuid-1": "Pizza Hawaii", "uuid-2": "Cola" }
    const [productNames, setProductNames] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNames = async () => {
            // Jeśli nie ma rekordów lub items, kończymy
            if (!record || !record.orderItems || record.orderItems.length === 0) {
                setLoading(false);
                return;
            }

            // 1. Wyciągamy ID produktów z zamówienia
            const items = record.orderItems;
            const namesMap: Record<string, string> = {};

            // 2. Pobieramy dane dla każdego produktu RĘCZNIE
            // Używamy Promise.all, żeby pobrać wszystko równolegle (szybko)
            await Promise.all(items.map(async (item: any) => {
                const id = item.itemId;
                
                // Pomijamy błędne ID, żeby nie męczyć API
                if (!id || id === 'undefined') return;

                // Sprawdzamy czy już nie pobraliśmy (cache)
                if (productNames[id]) return; 

                try {
                    const product = await MenuItemService.getOne(id);
                    if (product) {
                        namesMap[id] = product.name;
                    } else {
                        namesMap[id] = "Produkt usunięty";
                    }
                } catch (err) {
                    console.error(`Błąd pobierania produktu ${id}`, err);
                    namesMap[id] = "Błąd pobierania";
                }
            }));

            // Aktualizujemy stan
            setProductNames(prev => ({ ...prev, ...namesMap }));
            setLoading(false);
        };

        fetchNames();
    }, [record]); // Uruchom ponownie, jeśli zmieni się rekord (zamówienie)

    if (!record || !record.orderItems || record.orderItems.length === 0) {
        return <Box p={2}>Brak produktów.</Box>;
    }

    return (
        <Box sx={{ margin: 2, padding: 2, backgroundColor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: '#555' }}>
                <ShoppingBasketIcon fontSize="small" /> Szczegóły koszyka
            </Typography>

            {loading ? <LoadingIndicator /> : (
                <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#eeeeee' }}>
                            <TableRow>
                                <TableCell>Produkt</TableCell>
                                <TableCell align="center">Ilość</TableCell>
                                <TableCell align="right">Cena jedn.</TableCell>
                                <TableCell align="right">Suma</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {record.orderItems.map((item: any, index: number) => {
                                // Pobieramy nazwę ze stanu, albo wyświetlamy "Ładowanie..."
                                const name = productNames[item.itemId] || 'Nieznany produkt';

                                return (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {/* Wyświetlamy pobraną NAZWĘ */}
                                            <Typography variant="body2" fontWeight="bold">
                                                {name}
                                            </Typography>
                                            {/* ID wyświetlamy dyskretnie pod spodem */}
                                            <Typography variant="caption" color="textSecondary" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                                                {item.itemId}
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="center">
                                            <Chip label={`x${item.quantity}`} size="small" variant="outlined" />
                                        </TableCell>

                                        <TableCell align="right">
                                            {item.discounted ? (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                    <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'gray' }}>
                                                        {item.basePrice.toFixed(2)} zł
                                                    </Typography>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Chip label="PROMO" color="success" size="small" sx={{ height: 16, fontSize: '0.6rem' }} />
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'green' }}>
                                                            {item.finalPrice.toFixed(2)} zł
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            ) : (
                                                <Typography variant="body2">
                                                    {item.basePrice.toFixed(2)} zł
                                                </Typography>
                                            )}
                                        </TableCell>

                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                            {item.totalPrice.toFixed(2)} zł
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </Box>
    );
};