import { createRoot } from 'react-dom/client'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './common/api/queryClient.ts'
import { BrowserRouter } from 'react-router-dom'
import { Routes } from './routes/router.tsx'
import {ToastContainer} from "react-toastify";

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient} >
        <ToastContainer />
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </QueryClientProvider>
)
