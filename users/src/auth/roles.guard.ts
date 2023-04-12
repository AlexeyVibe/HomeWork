import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "./roles-auth.decorator";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private reflector: Reflector) {
    }
    /**
     * Метод, определяющий, может ли запрос быть обработан.
     * @param context - объект ExecutionContext, содержащий данные о запросе.
     * @returns boolean | Promise<boolean> | Observable<boolean>
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            // Получение списка необходимых ролей из аннотации @Roles.
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ])
            // Если роли не указаны, разрешаем доступ.
            if (!requiredRoles) {
                return true;
            }
            //  получение объекта запроса из контекста выполнения,
            //  который будет использоваться для проверки наличия JWT токена.
            const req = context.switchToHttp().getRequest();
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
            return user.roles.some(role => requiredRoles.includes(role.value));
        } catch (e) {
            // выброс исключения UnauthorizedException, если пользователь не авторизован.
            throw new HttpException( 'Нет доступа', HttpStatus.FORBIDDEN)
        }
    }

}