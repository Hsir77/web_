import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {  jsx  as  _jsx  } from "react/jsx-runtime" ;   

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div>666</div>
  </StrictMode>,
)
console.log( _jsx ( "h2" ,  { } ) )