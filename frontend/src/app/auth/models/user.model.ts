export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    bio?: string;
    membership?: string;
    membershipStatus?: string;
    profilePicture?: string;
    membershipEndDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
    isActive?: boolean;
    newPassword?: string;
}

export interface AuthResponse {
    token: string;
}
