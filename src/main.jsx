import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
const clientId = "533096667012-29sb9vo0mhcamnf7000tp9qvs69727np.apps.googleusercontent.com"; // Replace with your actual Google Client ID


createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
  
  </StrictMode>
)
