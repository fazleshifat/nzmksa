import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CapacitorPasskey } from '@capgo/capacitor-passkey'

import './index.css'
import App from './App.tsx'

async function bootstrap() {
  try {
    await CapacitorPasskey.autoShimWebAuthn()
    console.log('PASSKEY: WebAuthn shim initialized')
  } catch (error) {
    console.error('PASSKEY: WebAuthn shim initialization failed:', error)
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

bootstrap()