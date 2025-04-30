import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const APP_NAME =import.meta.env.VITE_APP_CLIENT_NAME
document.title = APP_NAME || "My App"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
