export type UserRole = "admin" | "manager" | "viewer";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: UserRole;
    createdAt: string;
    lastLogin: string;
}
