import type { Ref } from 'vue';
import type { MutationResult } from '@/types/api.types';
import type { CreateOrderPayload, OrderConfirmation } from '@/types/order.types';
import type { ContactPayload, CustomOrderPayload, InquiryReceipt } from '@/types/store.types';

export interface OrdersApi {
  placeOrder: (payload: CreateOrderPayload) => Promise<OrderConfirmation>;
  trackOrder: (orderNumber: string, phone: string) => Promise<OrderConfirmation>;
  /** The confirmation of the order placed in this session (shown right after checkout). */
  lastOrder: Ref<OrderConfirmation | null>;
}

export const useOrders = (): OrdersApi => {
  const api = useApiClient();
  const lastOrder = useState<OrderConfirmation | null>('last-order', (): null => null);

  const placeOrder = async (payload: CreateOrderPayload): Promise<OrderConfirmation> => {
    const { data } = await api.post<OrderConfirmation>('/orders', payload);
    lastOrder.value = data;
    return data;
  };

  const trackOrder = (orderNumber: string, phone: string): Promise<OrderConfirmation> =>
    api.get<OrderConfirmation>(`/orders/${encodeURIComponent(orderNumber.trim())}`, { phone });

  return { placeOrder, trackOrder, lastOrder };
};

export interface InquiriesApi {
  submitCustomOrder: (payload: CustomOrderPayload) => Promise<MutationResult<InquiryReceipt>>;
  submitContact: (payload: ContactPayload) => Promise<MutationResult<InquiryReceipt>>;
}

export const useInquiries = (): InquiriesApi => {
  const api = useApiClient();
  return {
    submitCustomOrder: (payload: CustomOrderPayload): Promise<MutationResult<InquiryReceipt>> =>
      api.post<InquiryReceipt>('/custom-orders', payload),
    submitContact: (payload: ContactPayload): Promise<MutationResult<InquiryReceipt>> =>
      api.post<InquiryReceipt>('/contact', payload),
  };
};
