import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserContext from './context/UserContext.jsx'
import UserContext2 from './context/UserContext2.jsx'

createRoot(document.getElementById('root')).render(
    <UserContext>
        <UserContext2>
            <App />
        </UserContext2>
    </UserContext>
)
