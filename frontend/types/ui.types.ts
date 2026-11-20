export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'rose' | 'amber' | 'sage' | 'sky' | 'neutral' | 'danger';
export type AlertVariant = 'success' | 'error' | 'info';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export interface NavLink {
  label: string;
  to: string;
}

export interface BreadcrumbItem {
  label: string;
  to?: string;
}
