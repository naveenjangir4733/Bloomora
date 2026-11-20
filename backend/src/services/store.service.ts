import type { StoreRepository } from '@/repositories/store.repository';
import type { StoreConfig, StoreSettings } from '@/types/store.types';
import { AppError } from '@/utils/app-error.util';

export class StoreService {
  constructor(private readonly store: StoreRepository) {}

  public async getSettings(): Promise<StoreSettings> {
    const settings = await this.store.getSettings();
    if (!settings) {
      throw AppError.unavailable('Store settings are missing. Run `pnpm db:setup` in the backend.');
    }
    return settings;
  }

  public async getConfig(): Promise<StoreConfig> {
    const [settings, paymentOptions, highlights, stats] = await Promise.all([
      this.getSettings(),
      this.store.getPaymentOptions(),
      this.store.getHighlights(),
      this.store.getStats(),
    ]);
    return { settings, paymentOptions, highlights, stats };
  }
}
