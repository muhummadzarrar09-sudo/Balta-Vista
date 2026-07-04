export type PaymentMethodId = 'easypaisa' | 'jazzcash' | 'hbl' | 'ubl' | 'mcb' | 'alfalah' | 'meezan' | 'other';

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  type: 'wallet' | 'bank';
  description: string;
  icon: string;
  details: {
    accountTitle?: string;
    accountNumber?: string;
    iban?: string;
    bankName?: string;
    branch?: string;
    phoneNumber?: string;
    qrCode?: boolean;
  };
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'easypaisa',
    name: 'Easypaisa',
    type: 'wallet',
    description: 'Send payment via Easypaisa app — instant, no bank needed.',
    icon: 'EP',
    details: {
      accountTitle: 'Balta Vista Nathiagali',
      phoneNumber: '0300 1234567',
      accountNumber: '03001234567',
      qrCode: true,
    },
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    type: 'wallet',
    description: 'Send via JazzCash app from any mobile wallet.',
    icon: 'JC',
    details: {
      accountTitle: 'Balta Vista Nathiagali',
      phoneNumber: '0300 1234567',
      accountNumber: '03001234567',
      qrCode: true,
    },
  },
  {
    id: 'hbl',
    name: 'HBL — Habib Bank',
    type: 'bank',
    description: 'Direct bank transfer to our HBL current account.',
    icon: 'HBL',
    details: {
      bankName: 'Habib Bank Limited (HBL)',
      accountTitle: 'Balta Vista Nathiagali',
      accountNumber: '1234-567890-01',
      iban: 'PK36 HABB 0012 3456 7890 01',
      branch: 'Nathiagali Branch, KPK',
    },
  },
  {
    id: 'ubl',
    name: 'UBL — United Bank',
    type: 'bank',
    description: 'Direct transfer to our UBL account from any branch.',
    icon: 'UBL',
    details: {
      bankName: 'United Bank Limited (UBL)',
      accountTitle: 'Balta Vista Nathiagali',
      accountNumber: '5678-901234-56',
      iban: 'PK54 UNIL 0012 3456 7890 56',
      branch: 'Islamabad Main Branch',
    },
  },
  {
    id: 'mcb',
    name: 'MCB — Muslim Commercial Bank',
    type: 'bank',
    description: 'Transfer via MCB from anywhere in Pakistan.',
    icon: 'MCB',
    details: {
      bankName: 'MCB Bank Limited',
      accountTitle: 'Balta Vista Nathiagali',
      accountNumber: '9012-345678-90',
      iban: 'PK73 MCBB 0012 3456 7890 90',
      branch: 'Rawalpindi Cantonment Branch',
    },
  },
  {
    id: 'alfalah',
    name: 'Bank Alfalah',
    type: 'bank',
    description: 'Direct transfer to our Bank Alfalah account.',
    icon: 'BA',
    details: {
      bankName: 'Bank Alfalah Limited',
      accountTitle: 'Balta Vista Nathiagali',
      accountNumber: '3456-789012-34',
      iban: 'PK91 ALFH 0012 3456 7890 34',
      branch: 'Abbottabad Branch',
    },
  },
  {
    id: 'meezan',
    name: 'Meezan Bank',
    type: 'bank',
    description: 'Islamic banking transfer to our Meezan account.',
    icon: 'MB',
    details: {
      bankName: 'Meezan Bank Limited',
      accountTitle: 'Balta Vista Nathiagali',
      accountNumber: '7890-123456-78',
      iban: 'PK28 MEZN 0012 3456 7890 78',
      branch: 'Islamabad, F-10 Branch',
    },
  },
  {
    id: 'other',
    name: 'Other Bank Transfer',
    type: 'bank',
    description: 'Ask the reservations team for other bank details.',
    icon: '🏦',
    details: {
      accountTitle: 'Balta Vista Nathiagali',
    },
  },
];

export const walletMethods = paymentMethods.filter((m) => m.type === 'wallet');
export const bankMethods = paymentMethods.filter((m) => m.type === 'bank');

export function getPaymentMethod(id: PaymentMethodId): PaymentMethod | undefined {
  return paymentMethods.find((m) => m.id === id);
}
