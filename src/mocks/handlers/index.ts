import { auditorHandlers } from './auditor.handlers';
import { authHandlers } from './auth.handlers';
import { censorHandlers } from './censor.handlers';
import { memberHandlers } from './member.handlers';
import { presidentHandlers } from './president.handlers';
import { presidentFlowsHandlers } from './president-flows.handlers';
import { secretaryHandlers } from './secretary.handlers';
import { tontineHandlers } from './tontine.handlers';
import { treasurerHandlers } from './treasurer.handlers';

export const handlers = [
  ...authHandlers,
  ...memberHandlers,
  ...tontineHandlers,
  ...presidentHandlers,
  ...presidentFlowsHandlers,
  ...secretaryHandlers,
  ...treasurerHandlers,
  ...censorHandlers,
  ...auditorHandlers,
];
