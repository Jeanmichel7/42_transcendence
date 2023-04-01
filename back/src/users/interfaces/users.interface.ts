export interface User {
    id: bigint,
    firstName: string,
    lastName: string,
    login: string,
    email: string,
    password?: string,
    description?: string,
    avatar?: string,
    is_admin?: boolean,
}