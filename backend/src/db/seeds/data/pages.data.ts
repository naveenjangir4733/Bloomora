import type { ContentPageSeed } from '@/db/seeds/seed.types';

export const contentPagesData: ContentPageSeed[] = [
  {
    slug: 'about',
    title: 'About Bloomora',
    summary: 'A tiny handmade studio turning soft fuzzy wire into flowers, lamps and keepsakes that last forever.',
    sections: [
      {
        heading: 'How it started',
        paragraphs: [
          'Bloomora began at a kitchen table with a bundle of chenille wire and a wish to give flowers that would not wilt by Friday.',
          'Today every piece is still made by hand, one petal at a time, in our small studio in Pakistan.',
        ],
      },
      {
        heading: 'What makes our pieces different',
        paragraphs: [
          'We use premium, velvet-soft fuzzy wire that holds its shape and colour for years.',
          'Nothing is mass produced — tiny variations are part of the charm and proof that a real person made it for you.',
        ],
      },
      {
        heading: 'Made for gifting',
        paragraphs: [
          'Birthdays, graduations, anniversaries or a quiet “thinking of you” — our pieces are designed to be kept, not thrown away.',
        ],
      },
    ],
  },
  {
    slug: 'shipping-delivery',
    title: 'Shipping & Delivery',
    summary: 'Nationwide delivery across Pakistan with careful, gift-ready packaging.',
    sections: [
      {
        heading: 'Delivery times',
        paragraphs: [
          'Ready-made items ship within 1–2 working days after payment is confirmed and arrive in 3–6 working days.',
          'Custom and made-to-order pieces take 5–7 working days to craft before dispatch.',
        ],
      },
      {
        heading: 'Delivery charges',
        paragraphs: [
          'A flat delivery fee applies to every order and is shown in your cart before checkout.',
          'Orders above the free-delivery threshold ship free anywhere in Pakistan.',
        ],
      },
      {
        heading: 'Tracking',
        paragraphs: [
          'Once your parcel is dispatched we share the courier tracking number on WhatsApp.',
          'You can also check your order status any time on the Track Order page using your order number and phone.',
        ],
      },
    ],
  },
  {
    slug: 'return-refund-policy',
    title: 'Return & Refund Policy',
    summary: 'Because every piece is handmade, we handle returns case by case — and always fairly.',
    sections: [
      {
        heading: 'Damaged on arrival',
        paragraphs: [
          'If your order arrives damaged, send us an unboxing video and photos on WhatsApp within 48 hours of delivery.',
          'We will repair, remake or refund the damaged item at no extra cost.',
        ],
      },
      {
        heading: 'Change of mind',
        paragraphs: [
          'Ready-made items can be returned within 7 days if unused and in original packaging. Return delivery is paid by the customer.',
          'Custom and personalised items cannot be returned unless they arrive damaged.',
        ],
      },
      {
        heading: 'Refund timeline',
        paragraphs: ['Approved refunds are sent to the original payment account within 5–7 working days.'],
      },
    ],
  },
  {
    slug: 'terms-conditions',
    title: 'Terms & Conditions',
    summary: 'The simple rules that apply when you order from Bloomora.',
    sections: [
      {
        heading: 'Orders and payment',
        paragraphs: [
          'All orders require 100% advance payment. We do not offer cash on delivery.',
          'Orders not paid within 48 hours may be cancelled automatically.',
        ],
      },
      {
        heading: 'Product appearance',
        paragraphs: [
          'Because each item is handmade, colours and sizes may vary slightly from photos.',
          'Screen settings can also affect how colours look.',
        ],
      },
      {
        heading: 'Pricing',
        paragraphs: ['Prices are listed in Pakistani Rupees (PKR) and may change without notice. Confirmed orders are never re-priced.'],
      },
    ],
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    summary: 'We only collect what we need to make and deliver your order.',
    sections: [
      {
        heading: 'What we collect',
        paragraphs: ['Your name, phone number, email (optional) and delivery address when you place an order or contact us.'],
      },
      {
        heading: 'How we use it',
        paragraphs: [
          'To confirm payment, craft and deliver your order, and to reply to your messages.',
          'We never sell or share your details with third parties except the courier delivering your parcel.',
        ],
      },
      {
        heading: 'Your choices',
        paragraphs: ['Message us at any time to see, correct or delete the information we hold about you.'],
      },
    ],
  },
];
