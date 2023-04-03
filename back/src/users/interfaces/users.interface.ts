export interface User {
    id: bigint,
    firstName: string,
    lastName: string,
    login: string,
    email: string,
    password?: string,
    description?: string,
    avatar?: string,
    role?: string,
    is_2fa?: boolean,
}