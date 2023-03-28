export interface Users {
    id: number,
    name: string,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    description?: string,
    avatar: string,
    isAdmin?: boolean,
}