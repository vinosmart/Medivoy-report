import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
export declare class OrdersService {
    private repo;
    constructor(repo: Repository<Order>);
    create(userId: string, dto: Partial<Order>): Promise<Order>;
    findByUser(userId: string): Promise<Order[]>;
    updateStatus(id: string, userId: string, status: string): Promise<Order>;
    remove(id: string, userId: string): Promise<{
        message: string;
        id: string;
    }>;
}
