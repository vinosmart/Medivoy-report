import { OrdersService } from './orders.service';
export declare class OrdersController {
    private svc;
    constructor(svc: OrdersService);
    create(req: any, body: any): Promise<import("./entities/order.entity").Order>;
    findAll(req: any): Promise<import("./entities/order.entity").Order[]>;
    updateStatus(req: any, id: string, body: {
        status: string;
    }): Promise<import("./entities/order.entity").Order>;
    remove(req: any, id: string): Promise<{
        message: string;
        id: string;
    }>;
}
