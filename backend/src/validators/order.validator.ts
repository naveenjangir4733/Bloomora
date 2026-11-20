import { z } from 'zod';
import { PAYMENT_METHODS } from '@/types/order.types';
import { optionalEmailSchema, optionalTextSchema, phoneSchema } from '@/validators/common.validator';

export const MAX_QUANTITY_PER_LINE = 20;

const orderItemSchema = z.object({
  productId: z.string().uuid('Invalid product id'),
  variantId: z
    .string()
    .uuid('Invalid variant id')
    .nullish()
    .transform((value): string | null => value ?? null),
  quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_LINE),
});

export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, 'Please enter your full name').max(100),
    phone: phoneSchema,
    email: optionalEmailSchema,
    city: z.string().trim().min(2, 'Please enter your city').max(80),
    address: z.string().trim().min(10, 'Please enter your complete delivery address').max(500),
    notes: optionalTextSchema(500),
  }),
  paymentMethod: z.enum(PAYMENT_METHODS),
  items: z.array(orderItemSchema).min(1, 'Your cart is empty').max(30),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
export type CreateOrderItemDto = CreateOrderDto['items'][number];

export const orderParamsSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^BLM-\d+$/, 'Invalid order number'),
});

export type OrderParams = z.infer<typeof orderParamsSchema>;

export const orderLookupQuerySchema = z.object({ phone: phoneSchema });

export type OrderLookupQueryDto = z.infer<typeof orderLookupQuerySchema>;
