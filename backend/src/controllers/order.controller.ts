import { HttpStatus } from '@/constants/http-status.constant';
import type { OrderService } from '@/services/order.service';
import type { NoParams } from '@/types/http.types';
import { ApiResponse } from '@/utils/api-response.util';
import { asyncHandler } from '@/utils/async-handler.util';
import type { CreateOrderDto, OrderLookupQueryDto, OrderParams } from '@/validators/order.validator';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  public readonly create = asyncHandler<NoParams, CreateOrderDto>(async (req, res): Promise<void> => {
    const confirmation = await this.orderService.placeOrder(req.body);
    res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(confirmation, `Order ${confirmation.order.orderNumber} placed successfully`));
  });

  public readonly track = asyncHandler<OrderParams, unknown, OrderLookupQueryDto>(async (req, res): Promise<void> => {
    res.json(ApiResponse.success(await this.orderService.trackOrder(req.params.orderNumber, req.query.phone)));
  });
}
