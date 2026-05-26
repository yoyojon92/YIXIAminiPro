export interface User {
    id: string;
    openid: string;
    phone: string;
    nickname: string;
    avatar: string;
    schoolId?: string;
    schoolName?: string;
    role: 'student' | 'agent' | 'distributor' | 'admin';
    ageVerified: boolean;
    createdAt: string;
}
export interface LoginResult {
    user: User;
    token: string;
}
export declare class AuthService {
    private users;
    login(code: string, encryptedData?: string, iv?: string): Promise<LoginResult | null>;
    getUserById(userId: string): Promise<User | undefined>;
    updateUser(userId: string, data: Partial<User>): Promise<User | undefined>;
    verifyAge(userId: string, idCard: string): Promise<boolean>;
}
