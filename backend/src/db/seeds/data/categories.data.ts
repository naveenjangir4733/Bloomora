import { photo } from '@/db/seeds/data/images.data';
import type { CategorySeed } from '@/db/seeds/seed.types';

/** Listed in display order. */
export const categoriesData: CategorySeed[] = [
  {
    slug: 'bouquets',
    name: 'Bouquets',
    tagline: 'Mini · Standard · Premium',
    description: 'Hand-twisted fuzzy-wire bouquets that stay in full bloom forever — no water, no wilting.',
    imageUrl: photo('bouquetKraft'),
  },
  {
    slug: 'lamps',
    name: 'Lamps',
    tagline: 'Mini · Standard · Premium',
    description: 'Soft, warm-glow lamps wrapped in handmade petals for cosy bedrooms and reading corners.',
    imageUrl: photo('tableLampGlow'),
  },
  {
    slug: 'handbags',
    name: 'Handbags',
    tagline: 'Everyday Carry',
    description: 'Statement bags finished with hand-sculpted blooms — a little garden that goes everywhere.',
    imageUrl: photo('wickerBag'),
  },
  {
    slug: 'home-decor',
    name: 'Home Decor',
    tagline: 'Wall Hangings · Mirror Lights · Dancing Flowers',
    description: 'Wall hangings, mirror lights and curtain ties that bring year-round spring indoors.',
    imageUrl: photo('livingRoom'),
  },
  {
    slug: 'pots-pen-holders',
    name: 'Pots & Pen Holders',
    tagline: 'Desk & Home',
    description: 'Forever-green desk companions and pen holders that brighten study tables and offices.',
    imageUrl: photo('penHolder'),
  },
  {
    slug: 'buckets',
    name: 'Buckets',
    tagline: 'Little Containers',
    description: 'Mini buckets and vases brimming with everlasting blooms — perfect shelf fillers.',
    imageUrl: photo('blossomVases'),
  },
  {
    slug: 'keychains',
    name: 'Keychains',
    tagline: 'Tiny Charms',
    description: 'Pocket-sized flower charms for keys, bags and gifting in bulk.',
    imageUrl: photo('goldCharms'),
  },
  {
    slug: 'shadow-boxes',
    name: 'Shadow Boxes',
    tagline: 'Framed Art',
    description: 'Framed floral keepsakes that preserve a date, a name or a memory.',
    imageUrl: photo('floralPainting'),
  },
  {
    slug: 'cards',
    name: 'Cards',
    tagline: 'For Every Occasion',
    description: 'Handmade cards with a raised fuzzy-wire flower — birthdays, anniversaries and thank-yous.',
    imageUrl: photo('kraftGift'),
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    tagline: 'Little Extras',
    description: 'Hair clips, earrings, bracelets and gift-wrap upgrades to finish any order.',
    imageUrl: photo('earrings'),
  },
];
