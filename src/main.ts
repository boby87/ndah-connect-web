import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

const startApp = (): Promise<void> =>
  bootstrapApplication(App, appConfig)
    .then(() => undefined)
    .catch((err) => {
      console.error('[bootstrap] Échec du démarrage Angular:', err);
    });

const main = async (): Promise<void> => {
  if (environment.useMock) {
    try {
      const { startMockWorker } = await import('./mocks/browser');
      await startMockWorker();
    } catch (error) {
      console.error('[bootstrap] MSW non disponible, l\'application démarre quand même:', error);
    }
  }
  await startApp();
};

void main();
