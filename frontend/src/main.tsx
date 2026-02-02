import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/accessibility.css'
import App from './App.tsx'
import { ToastProvider } from './components/Toast.tsx'
import { initAccessibility } from './utils/accessibility'

// Инициализация доступности
initAccessibility();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
)
