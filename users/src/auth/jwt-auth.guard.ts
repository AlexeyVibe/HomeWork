import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";


//  создание класса, который реализует интерфейс CanActivate,
//  используемый для реализации стратегии защиты маршрута.
@Injectable()
export class JwtAuthGuard implements CanActivate {

    //  * конструктор класса, принимающий в качестве аргумента объект сервиса JwtService,
    //  необходимый для работы с JWT токенами.
    constructor(private jwtService: JwtService) {
    }


    //  * метод, который определяет, будет ли маршрут защищен или нет.
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        //  получение объекта запроса из контекста выполнения, который будет использоваться для проверки наличия JWT токена.
        const req = context.switchToHttp().getRequest()
        try {
            //  получение заголовка авторизации из объекта запроса.
            const authHeader = req.headers.authorization;
            //  получение первой части заголовка авторизации,
            //  которая должна содержать значение "Bearer".
            const bearer = authHeader.split(' ')[0]
            //  получение второй части заголовка авторизации, которая содержит JWT токен.
            const token = authHeader.split(' ')[1]

            //  проверка корректности формата заголовка авторизации.
            if (bearer !== 'Bearer' || !token) {
                //  выброс исключения UnauthorizedException, если заголовок авторизации некорректен.
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }

            //  вызов метода verify объекта сервиса JwtService для проверки подлинности JWT токена.
            const user = this.jwtService.verify(token);
            // сохранение данных пользователя в объекте запроса
            req.user = user;
            // возврат значения true, если пользователь авторизован.
            return true;
        } catch (e) {
            // выброс исключения UnauthorizedException, если пользователь не авторизован.
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }
    }

}
