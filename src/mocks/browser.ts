import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export const startMockWorker = async (): Promise<void> => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('[MSW] Service Worker non supporté par ce navigateur — MSW désactivé.');
    return;
  }

  try {
    await worker.start({
      serviceWorker: { url: '/mockServiceWorker.js' },
      onUnhandledRequest: (req, print) => {
        const url = new URL(req.url);
        if (url.pathname.startsWith('/api/')) {
          print.warning();
        }
      },
      quiet: false,
      waitUntilReady: true,
    });
    console.info('[MSW] Service Worker démarré.');
  } catch (error) {
    console.error('[MSW] Échec du démarrage du Service Worker:', error);
    throw error;
  }
};
