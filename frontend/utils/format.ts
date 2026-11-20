const numberFormatter = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });
const dateFormatter = new Intl.DateTimeFormat('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

/** Formats a PKR amount the way local shoppers expect, e.g. `Rs 2,200`. */
export const formatPrice = (amount: number): string => `Rs ${numberFormatter.format(amount)}`;

export const formatDate = (isoDate: string): string => dateFormatter.format(new Date(isoDate));

export const pluralize = (count: number, singular: string, plural = `${singular}s`): string =>
  `${count} ${count === 1 ? singular : plural}`;

export const toWhatsAppUrl = (number: string, message: string): string =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
