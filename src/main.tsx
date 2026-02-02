import { createRoot } from 'react-dom/client'
import { Layout } from './Components/LayoutArea/Layout/Layout'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './Redux/Store'
import { SnackbarProvider } from 'notistack'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Provider store={store}>
            <SnackbarProvider>
                <Layout />
            </SnackbarProvider>
        </Provider>
    </BrowserRouter>
)