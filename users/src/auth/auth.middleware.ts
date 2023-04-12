import {
    CallHandler,
    ExecutionContext,
    HttpException, HttpStatus,
    Injectable,
    NestInterceptor,
    NestMiddleware
} from '@nestjs/common';
import {map, Observable} from "rxjs";

@Injectable()
//предназначенный для перехвата запросов и проверки,
// имеет ли пользователь права на выполнение действия.
export class SelfOrAdminInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // Получаем объект запроса из ExecutionContext.
        const request = context.switchToHttp().getRequest();
        // Получаем объект пользователя из запроса.
        const user = request.user;
        // Получаем параметр id из запроса.
        const {id} = request.params;

        // Проверяем, имеет ли пользователь права на выполнение действия.
        if (user.roles[0].value === 'ADMIN' || user.id === Number(id)) {
            // Если пользователь имеет права,
            // возвращаем ответ из следующего middleware или функции-обработчика.
            return next.handle().pipe(
                map(data => {
                    return data;
                }),
            );
        } else {
            // Если пользователь не имеет прав, выбрасываем HttpException с кодом статуса 403.
            throw new HttpException('У вас нет прав на выполнение данного действия', HttpStatus.FORBIDDEN);
        }
    }
}
