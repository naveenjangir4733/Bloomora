import { CategoryController } from '@/controllers/category.controller';
import { HealthController } from '@/controllers/health.controller';
import { InquiryController } from '@/controllers/inquiry.controller';
import { OrderController } from '@/controllers/order.controller';
import { ProductController } from '@/controllers/product.controller';
import { ReviewController } from '@/controllers/review.controller';
import { StoreController } from '@/controllers/store.controller';
import { UserController } from '@/controllers/user.controller';
import { db } from '@/db/postgres';
import { CategoryRepository } from '@/repositories/category.repository';
import { ContentRepository } from '@/repositories/content.repository';
import { InquiryRepository } from '@/repositories/inquiry.repository';
import { OrderRepository } from '@/repositories/order.repository';
import { ProductRepository } from '@/repositories/product.repository';
import { ReviewRepository } from '@/repositories/review.repository';
import { StoreRepository } from '@/repositories/store.repository';
import { UserRepository } from '@/repositories/user.repository';
import { CategoryService } from '@/services/category.service';
import { ContentService } from '@/services/content.service';
import { InquiryService } from '@/services/inquiry.service';
import { OrderService } from '@/services/order.service';
import { ProductService } from '@/services/product.service';
import { ReviewService } from '@/services/review.service';
import { StoreService } from '@/services/store.service';
import { UserService } from '@/services/user.service';

export interface Controllers {
  health: HealthController;
  store: StoreController;
  categories: CategoryController;
  products: ProductController;
  reviews: ReviewController;
  orders: OrderController;
  inquiries: InquiryController;
  users: UserController;
}

/** Composition root: wires repositories → services → controllers in one place. */
export const createControllers = (): Controllers => {
  const categoryRepository = new CategoryRepository(db);
  const productRepository = new ProductRepository(db);
  const reviewRepository = new ReviewRepository(db);
  const storeRepository = new StoreRepository(db);

  return {
    health: new HealthController(db),
    store: new StoreController(new StoreService(storeRepository), new ContentService(new ContentRepository(db))),
    categories: new CategoryController(new CategoryService(categoryRepository)),
    products: new ProductController(new ProductService(productRepository, reviewRepository)),
    reviews: new ReviewController(new ReviewService(reviewRepository)),
    orders: new OrderController(new OrderService(db, new OrderRepository(db), productRepository, storeRepository)),
    inquiries: new InquiryController(new InquiryService(new InquiryRepository(db), categoryRepository)),
    users: new UserController(new UserService(new UserRepository(db))),
  };
};
