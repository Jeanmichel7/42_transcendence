import { IsNotEmpty, IsString, IsOptional, Length, IS_STRONG_PASSWORD, IsNumber } from "class-validator";

export class CreateMessageDto {
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

    @IsNotEmpty()
    @IsString()
    // @Length(1)
    readonly data:string;

    // @IsOptional()
    // @IsNotEmpty()
    // @IsString()
    // readonly createAt?:string;

    // @IsOptional()
    // @IsNotEmpty()
    // @IsString()
    // readonly updateAt?:string;

}