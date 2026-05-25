export enum PaymentMethod {
  CASH = 'CASH',
  MOBILE_MONEY = 'MOBILE_MONEY',
  ORANGE_MONEY = 'ORANGE_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHECK = 'CHECK',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Espèces',
  [PaymentMethod.MOBILE_MONEY]: 'MTN Mobile Money',
  [PaymentMethod.ORANGE_MONEY]: 'Orange Money',
  [PaymentMethod.BANK_TRANSFER]: 'Virement bancaire',
  [PaymentMethod.CHECK]: 'Chèque',
};
