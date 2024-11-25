import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers)

// Expose worker globally for easier debugging
if (import.meta.env.DEV) {
  window.msw = {
    worker,
  }
}