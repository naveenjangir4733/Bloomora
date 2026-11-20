import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';
import { validateRequest } from '@/middlewares/validate.middleware';
import { createUserSchema, updateUserSchema, userQuerySchema } from '@/types/user.types';

export const userRouter = Router();
const userController = new UserController();

userRouter.get(
  '/',
  validateRequest({ query: userQuerySchema }),
  userController.getUsers,
);

userRouter.get('/:id', userController.getUserById);

userRouter.post(
  '/',
  validateRequest({ body: createUserSchema }),
  userController.createUser,
);

userRouter.put(
  '/:id',
  validateRequest({ body: updateUserSchema }),
  userController.updateUser,
);

userRouter.delete('/:id', userController.deleteUser);
