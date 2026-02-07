import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

declare global {
  interface Window {
    asoneId: string;
  }
}

createRoot(document.getElementById(window.asoneId)!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
