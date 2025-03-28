import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import {createRoot} from 'react-dom/client';

import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
    <StrictMode>
        <App/>
    </StrictMode>
    
)