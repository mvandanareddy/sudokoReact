// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import Sudoku from './components/sudoko'

createRoot(document.getElementById('root')!).render(
  <div style={{ display: 'flex', justifyContent: 'center',alignItems: 'center',flexDirection: 'column' }}>
    {/* <App /> */}
    <Sudoku/>
  </div>
)
