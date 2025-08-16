import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {HashRouter} from 'react-router-dom'
import App from './App.jsx'
import ContextProvider from './context/context'

createRoot(document.getElementById('root')).render(
    
    <ContextProvider>
        <HashRouter basename="/pearl">
            <App />
        </HashRouter>
    </ContextProvider>
)

