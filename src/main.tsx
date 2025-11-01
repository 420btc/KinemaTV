import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { StackProvider } from '@stackframe/stack'
import { stackClientApp } from './lib/stack'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StackProvider app={stackClientApp}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StackProvider>
  </React.StrictMode>,
)
