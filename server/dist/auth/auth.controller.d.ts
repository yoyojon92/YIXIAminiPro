import { AuthService } from './auth.service';
declare class LoginDto {
    code: string;
    encryptedData?: string;
    iv?: string;
}
declare class UpdateUserDto {
    phone?: string;
    nickname?: string;
    avatar?: string;
    schoolId?: string;
    schoolName?: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: import("./auth.service").LoginResult;
    }>;
    getUser(auth: string): Promise<{
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: import("./auth.service").User | undefined;
    }>;
    updateUser(auth: string, body: UpdateUserDto): Promise<{
        code: number;
        msg: string;
        data: import("./auth.service").User | undefined;
    }>;
    verifyAge(auth: string, body: {
        idCard: string;
    }): Promise<{
        code: number;
        msg: string;
        data: {
            success: boolean;
        };
    }>;
}
export {};
