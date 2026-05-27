import { AuthService } from './auth.service';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(body: {
        email: string;
        password: string;
        role?: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
}
