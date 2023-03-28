export interface Users {
    id: number,
    firstName: string,
    lastName: string,
    pseudo: string,
    email: string,
    password: string,
    description?: string,
    avatar?: string,
    is_admin?: boolean,
}