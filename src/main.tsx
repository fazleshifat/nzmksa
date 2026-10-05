import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { CapacitorPasskey } from '@capgo/capacitor-passkey'

import './index.css'
import App from './App.tsx'

async function bootstrap() {
  try {
    if (Capacitor.isNativePlatform()) {
      await CapacitorPasskey.autoShimWebAuthn()

      console.log(
        'PASSKEY: Native WebAuthn shim initialized'
      )
    } else {
      console.log(
        'PASSKEY: Browser detected - using browser WebAuthn'
      )
    }
  } catch (error) {
    console.error(
      'PASSKEY: WebAuthn shim initialization failed:',
      error
    )
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

bootstrap()