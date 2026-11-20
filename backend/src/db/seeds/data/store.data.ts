import { photo } from '@/db/seeds/data/images.data';
import type { HighlightSeed, PaymentOptionSeed, StoreSettingsSeed, UserSeed } from '@/db/seeds/seed.types';

/** Demo store settings. Contact details and account numbers are placeholders. */
export const storeSettingsData: StoreSettingsSeed = {
  storeName: 'Bloomora',
  tagline: 'Little things, made with love.',
  description:
    'Bloomora is a small handmade studio crafting fuzzy-wire bouquets, glow lamps, keepsakes and gifts that never wilt — made by hand in Pakistan.',
  heroTitle: 'Handmade blooms that never wilt.',
  heroSubtitle:
    'Fuzzy-wire bouquets, glowing lotus lamps, keychains and keepsakes — shaped petal by petal and delivered across Pakistan.',
  heroImageUrl: photo('bouquetKraft', 1400),
  announcements: [
    'Advance payment only — no cash on delivery',
    'Free delivery on orders over Rs 5,000',
    'Nationwide delivery across Pakistan',
    'Handmade with love in Pakistan',
  ],
  currencyCode: 'PKR',
  shippingFee: 250,
  freeShippingThreshold: 5000,
  contactEmail: 'hello@bloomora.example',
  contactPhone: '+92 300 0000000',
  whatsappNumber: '923000000000',
  instagramUrl: 'https://www.instagram.com/',
  facebookUrl: 'https://www.facebook.com/',
  tiktokUrl: 'https://www.tiktok.com/',
  youtubeUrl: 'https://www.youtube.com/',
};

export const paymentOptionsData: PaymentOptionSeed[] = [
  {
    method: 'bank_transfer',
    label: 'Bank Transfer',
    accountTitle: 'Bloomora Studio',
    accountNumber: 'PK00 DEMO 0000 0000 0000 0000',
    instructions: 'Transfer the order total and send the receipt with your order number on WhatsApp.',
  },
  {
    method: 'easypaisa',
    label: 'Easypaisa',
    accountTitle: 'Bloomora Studio',
    accountNumber: '0300 0000000',
    instructions: 'Send the order total to this Easypaisa account and share the transaction ID with your order number.',
  },
  {
    method: 'jazzcash',
    label: 'JazzCash',
    accountTitle: 'Bloomora Studio',
    accountNumber: '0300 0000000',
    instructions: 'Send the order total to this JazzCash account and share the transaction ID with your order number.',
  },
];

export const highlightsData: HighlightSeed[] = [
  {
    icon: '🤲',
    title: 'Handmade with care',
    description: 'Every petal is shaped by hand in our studio — no two pieces are exactly alike.',
  },
  {
    icon: '💳',
    title: '100% advance payment',
    description: 'Pay by bank, Easypaisa or JazzCash. We start crafting as soon as payment is confirmed.',
  },
  {
    icon: '🚚',
    title: 'Nationwide delivery',
    description: 'Safely packed and delivered to every city in Pakistan within 3–6 working days.',
  },
  {
    icon: '🎁',
    title: 'Custom orders welcome',
    description: 'Names, dates, colours or a completely new idea — tell us and we will make it.',
  },
];

export const usersData: UserSeed[] = [
  { name: 'Studio Admin', email: 'admin@bloomora.example', role: 'admin' },
  { name: 'Content Editor', email: 'editor@bloomora.example', role: 'editor' },
  { name: 'Demo Customer', email: 'customer@bloomora.example', role: 'customer' },
];
