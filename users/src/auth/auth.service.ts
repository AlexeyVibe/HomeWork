import {
    ExecutionContext,
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";

import * as bcrypt from 'bcryptjs';
import {User} from "../users/users.model";
import {Observable} from "rxjs";
import {AuthDto} from "./dto/auth.dto";
import { CreateUserDto } from "../users/dto/createUserDto";


//  Класс AuthService с аннотацией @Injectable, который предоставляет сервис аутентификации пользователей.
//  Содержит методы для проверки пользовательских данных, создания новых пользователей,
//  генерации JWT-токенов для аутентификации и авторизации пользователей.
@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService,
                @Inject(forwardRef(() => UsersService))
                private userService: UsersService,) {
    }

    /**
     Метод аутентификации пользователя.
     @param dto - DTO объект, содержащий данные для аутентификации пользователя.
     @returns Promise - промис, содержащий сгенерированный JWT токен для пользователя.
     */
    async login(dto: AuthDto) {
        const user = await this.validateUser(dto)
        return this.generateToken(user)
    }

    /**
     Метод регистрации нового пользователя.
     @param dto - DTO объект, содержащий данные для создания нового пользователя.
     @returns Promise - промис, содержащий сгенерированный JWT токен для нового пользователя.
     */
    async registration(dto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(dto.email)
        if (candidate) {
            throw new HttpException('Пользователь с таким email уже зарегестрирован', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userService.createUser({...dto, password: hashPassword});
        return this.generateToken(user);
    }

    /**
     Метод генерации JWT токена для пользователя.
     @param user - пользователь, для которого нужно создать токен.
     @returns объект - объект с токеном.
     */
    async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.roles}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    /**
     Метод проверки пользовательских данных.
     @param dto - DTO объект, содержащий данные для проверки пользователя.
     @returns Promise - промис, содержащий объект пользователя, если пользователь прошел проверку, иначе выбрасывает ошибку UnauthorizedException.
     */
    async validateUser(dto: AuthDto) {
        try {
            const user = await this.userService.getUserByEmail(dto.email);
            const passwordEquals = await bcrypt.compare(dto.password, user.password);
            if (user && passwordEquals) {
                return user;
            }
        }catch (e){
            throw new UnauthorizedException({message: 'Некорректный email или пароль'})
        }

    }

}
