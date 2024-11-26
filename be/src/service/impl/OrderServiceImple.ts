import { OrderStatus } from "@prisma/client";
import { NotFoundException } from "../../exception/NotFoundException";
import { OrderMapper } from "../../mapper/OrderMapper";
import { OrderModel } from "../../model/Order";
import { OrderDetailRepository } from "../../repository/OrderDetailRepository";
import { OrderRepository } from "../../repository/OrderRepository";
import { PagingOptions, PagingResult } from "../../utils/QueryType";
import { OrderService } from "../OrderService";
import { ProductService } from "../ProductService";
import { OrderRequest } from "../request/OrderRequest";
import { UserService } from "../UserService";
import { ProductServiceImpl } from "./ProductServiceImpl";
import { UserServiceImpl } from "./UserServiceImpl";
import { Decimal } from "@prisma/client/runtime/library";

export class OrderServiceImpl implements OrderService {
  private readonly orderRepository: OrderRepository;
  private readonly orderDetailRepository: OrderDetailRepository;
  private readonly orderMapper: OrderMapper;
  private readonly productService: ProductService;
  private readonly userService: UserService;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.orderDetailRepository = new OrderDetailRepository();
    this.orderMapper = new OrderMapper();
    this.productService = new ProductServiceImpl();
    this.userService = new UserServiceImpl();
  }

  async delete(id: number): Promise<void> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    await this.orderRepository.delete(id);
    return;
  }

  async create(request: OrderRequest, userId: number): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const newOrder = await this.orderRepository.create({
      userId: userId,
      status: OrderStatus.PENDING,
      createdDate: new Date(),
      confirmDate: null,
    });
    await Promise.all(
      request.orderDetails.map(async (detail) => {
        const product = await this.productService.findById(detail.productId);
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${detail.productId} not found`
          );
        }

        const newOrderDetail = {
          orderId: newOrder.id,
          productId: product.id,
          quantity: detail.quantity,
          totalPrice: new Decimal(detail.quantity).mul(product.cost),
          cost: new Decimal(product.cost).mul(detail.quantity),
        };

        // Create order detail and update product quantity
        await this.orderDetailRepository.create(newOrderDetail);
        await this.productService.updateQuantity(
          product.id,
          -detail.quantity,
          0
        );
      })
    );
    return;
  }
  async findAll(page: PagingOptions): Promise<PagingResult<OrderModel>> {
    const orders = await this.orderRepository.findAll(page);
    const data = orders.map((order) => this.orderMapper.toDto(order));
    return {
      data,
      total: orders.length,
    };
  }
  async findById(id: number): Promise<OrderModel | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      return null;
    }
    return this.orderMapper.toDto(order);
  }
  async updateDetail(orderId: number, status: OrderStatus): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    const { id, ...data } = order;
    await this.orderRepository.update(id, {
      ...data,
      status: status,
    });
    return;
  }
}
