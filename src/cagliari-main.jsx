import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CagliariApp from './CagliariApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CagliariApp />
  </StrictMode>,
)
