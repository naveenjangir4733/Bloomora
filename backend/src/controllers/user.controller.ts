import { HttpStatus } from '@/constants/http-status.constant';
import type { UserService } from '@/services/user.service';
import type { NoParams } from '@/types/http.types';
import { ApiResponse } from '@/utils/api-response.util';
import { asyncHandler } from '@/utils/async-handler.util';
import type { IdParams } from '@/validators/common.validator';
import type { CreateUserDto, UpdateUserDto, UserQueryDto } from '@/validators/user.validator';

export class UserController {
  constructor(private readonly userService: UserService) {}

  public readonly list = asyncHandler<NoParams, unknown, UserQueryDto>(async (req, res): Promise<void> => {
    res.json(ApiResponse.paginated(await this.userService.list(req.query)));
  });

  public readonly getById = asyncHandler<IdParams>(async (req, res): Promise<void> => {
    res.json(ApiResponse.success(await this.userService.getById(req.params.id)));
  });

  public readonly create = asyncHandler<NoParams, CreateUserDto>(async (req, res): Promise<void> => {
    const user = await this.userService.create(req.body);
    res.status(HttpStatus.CREATED).json(ApiResponse.success(user, 'User created successfully'));
  });

  public readonly update = asyncHandler<IdParams, UpdateUserDto>(async (req, res): Promise<void> => {
    res.json(ApiResponse.success(await this.userService.update(req.params.id, req.body), 'User updated successfully'));
  });

  public readonly remove = asyncHandler<IdParams>(async (req, res): Promise<void> => {
    await this.userService.delete(req.params.id);
    res.json(ApiResponse.success(null, 'User deleted successfully'));
  });
}
