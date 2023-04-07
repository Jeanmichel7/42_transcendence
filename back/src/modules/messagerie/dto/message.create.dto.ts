import { IsNotEmpty, IsString, IsOptional, Length, IS_STRONG_PASSWORD, IsNumber } from "class-validator";

export class MessageCreateDTO {
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    readonly id?: bigint;

    // @IsOptional()
    // @IsNotEmpty()
    // @IsNumber()
    // readonly ownerUserId?: number;

    // @IsNotEmpty()
    // readonly ownerUserId?: bigint;

    // @IsOptional()
    // @IsNotEmpty()
    // @IsNumber()
    // readonly destUserId?: bigint;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    // @Length(1)
    text:string;

    // @IsOptional()
    // @IsNotEmpty()
    // @IsString()
    // readonly createAt?:string;

    // @IsOptional()
    // @IsNotEmpty()
    // @IsString()
    // readonly updateAt?:string;

}