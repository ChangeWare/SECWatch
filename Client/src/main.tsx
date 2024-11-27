import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './common/api/queryClient.ts'
import { BrowserRouter } from 'react-router-dom'
import { Routes } from './routes/router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient} >
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
