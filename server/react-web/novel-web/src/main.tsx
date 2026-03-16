import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css'
import {AppRouter} from './router'

createRoot(document.getElementById('root')!).render(

    <AppRouter></AppRouter>

)
