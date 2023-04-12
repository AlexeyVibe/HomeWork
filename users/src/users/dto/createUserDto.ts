import { IsEmail, IsString, Length } from "class-validator";


export class CreateUserDto {
  @IsString({message: 'Должно быть строкой'})
  @IsEmail({}, {message: "Некорректный email"})
  readonly email: string;
  @IsString({message: 'Должно быть строкой'})
  @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})
  readonly password: string;
  @IsString({message: 'Должно быть строкой'})
  readonly name: string;
  @IsString({message: 'Должно быть строкой'})
  @Length(11, 11, {message: 'Должен состоять из 11 цифр'})
  readonly phone: string;

  profileId: number;
}