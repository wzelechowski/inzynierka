import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App'; // Importujemy Twoją główną aplikację

// Znajdujemy div-a w index.html
const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error('Nie znaleziono elementu #root w index.html');
}