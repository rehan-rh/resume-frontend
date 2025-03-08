import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import toast, { Toaster } from 'react-hot-toast';

const clientId = "533096667012-29sb9vo0mhcamnf7000tp9qvs69727np.apps.googleusercontent.com"; 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    
  <GoogleOAuthProvider clientId={clientId}>
  
  <Toaster position="top-center" reverseOrder={false} />

    <App />
  
  </GoogleOAuthProvider>
  
  </StrictMode>
)
