import { AuthService, UserPayload } from './auth.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private auth;
    constructor(auth: AuthService);
    validate(payload: UserPayload): Promise<{
        userId: string;
        email: string;
        role: string;
    }>;
}
export {};
