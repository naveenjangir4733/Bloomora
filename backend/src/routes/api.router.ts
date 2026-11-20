import { Router } from 'express';
import type { Controllers } from '@/container';
import { validateRequest } from '@/middlewares/validate.middleware';
import { idParamsSchema, slugParamsSchema } from '@/validators/common.validator';
import { contactMessageSchema, customOrderSchema } from '@/validators/inquiry.validator';
import { createOrderSchema, orderLookupQuerySchema, orderParamsSchema } from '@/validators/order.validator';
import { productQuerySchema } from '@/validators/product.validator';
import { reviewQuerySchema } from '@/validators/review.validator';
import { createUserSchema, updateUserSchema, userQuerySchema } from '@/validators/user.validator';

const bySlug = validateRequest({ params: slugParamsSchema });
const byId = validateRequest({ params: idParamsSchema });

export const createApiRouter = (controllers: Controllers): Router => {
  const router = Router();
  const { health, store, categories, products, reviews, orders, inquiries, users } = controllers;

  router.get('/health', health.check);

  router.get('/store', store.getConfig);
  router.get('/pages', store.listPages);
  router.get('/pages/:slug', bySlug, store.getPage);

  router.get('/categories', categories.list);
  router.get('/categories/:slug', bySlug, categories.getBySlug);

  router.get('/products', validateRequest({ query: productQuerySchema }), products.list);
  router.get('/products/:slug', bySlug, products.getBySlug);

  router.get('/reviews', validateRequest({ query: reviewQuerySchema }), reviews.list);

  router.post('/orders', validateRequest({ body: createOrderSchema }), orders.create);
  router.get(
    '/orders/:orderNumber',
    validateRequest({ params: orderParamsSchema, query: orderLookupQuerySchema }),
    orders.track,
  );

  router.post('/custom-orders', validateRequest({ body: customOrderSchema }), inquiries.createCustomOrder);
  router.post('/contact', validateRequest({ body: contactMessageSchema }), inquiries.createContactMessage);

  router.get('/users', validateRequest({ query: userQuerySchema }), users.list);
  router.post('/users', validateRequest({ body: createUserSchema }), users.create);
  router.get('/users/:id', byId, users.getById);
  router.patch('/users/:id', validateRequest({ params: idParamsSchema, body: updateUserSchema }), users.update);
  router.delete('/users/:id', byId, users.remove);

  return router;
};
