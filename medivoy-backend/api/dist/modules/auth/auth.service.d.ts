import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export interface UserPayload {
    sub: string;
    email: string;
    role: string;
}
export declare class AuthService {
    private jwt;
    private userRepo;
    constructor(jwt: JwtService, userRepo: Repository<User>);
    register(email: string, password: string, role?: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    private generateToken;
    validateUser(payload: UserPayload): Promise<User>;
}
