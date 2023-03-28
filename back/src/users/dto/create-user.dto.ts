export class CreateUserDto {
    readonly id:number;
    readonly name:string;
    readonly firstname:string;
    readonly lastname:string;
    readonly email:string;
    readonly password:string;
    readonly description?:string;
    readonly avatar:string;
    readonly isAdmin?:boolean;
}