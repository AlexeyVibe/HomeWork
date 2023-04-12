import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post, UseGuards,
  UseInterceptors,
  UsePipes
} from "@nestjs/common";
import { Client, ClientProxy, EventPattern, MessagePattern, Payload, Transport } from "@nestjs/microservices";
import { CreateUserDto } from "./dto/createUserDto";
import { UsersService } from "./users.service";
import {User} from "./users.model";
import { ResultUsersDto } from "./dto/resultUserDto";
import { ValidationPipe } from "../pipes/validation.pipe";
import { SelfOrAdminInterceptor } from "../auth/auth.middleware";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AddRoleDto } from "./dto/addRoleDto";
import { Roles } from "../auth/roles-auth.decorator";
import { RolesGuard } from "../auth/roles.guard";


@Controller('users')
export class UsersController {

  constructor(private userService: UsersService) {
  }

  @Client({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'profile_queue',
      queueOptions: {
        durable: false,
      },
    },
  })
  client: ClientProxy;

  async onModuleInit() {

    await this.client.connect();
  }

  @UsePipes(ValidationPipe)
  @Post()
  async appPost(@Body() userDto: CreateUserDto) {
    const profile = await this.client.send('add.new.user', userDto).toPromise();
    userDto.profileId = profile.id;
    const user = await this.userService.createUser(userDto);
    return user;
  }

  @Get('/')
  async getAllUsers() {
    const profiles = await this.client.send('get.profiles.list', '').toPromise();
    const users = await this.userService.getAllUsers();

    const resultUsers: ResultUsersDto[] = [];

    for (const user of users) {
      const profile = profiles.find(p => p.id === user.profileId) || { name: null, phone: null };
      if (!profile) {
        continue;
      }

      const roles = await user.$get('roles'); // получаем роли пользователя
      const resultUser: ResultUsersDto = {
        id: user.id,
        email: user.email,
        profile: {
          name: profile.name,
          phone: profile.phone,
        },
        roles: roles.map(role => ({ id: role.id, value: role.value })), // добавляем массив значений ролей пользователя
      };
      resultUsers.push(resultUser);
    }

    return resultUsers;
  }

  @UseInterceptors(SelfOrAdminInterceptor)
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Patch('/:id')
  async update(@Param('id') id: number, @Body() dto: CreateUserDto) {
    const profileId = await this.userService.update(id,dto);
    dto.profileId = profileId;
    await this.client.send('update.profile', dto).toPromise();
    return HttpStatus.OK;
  }

  @UseInterceptors(SelfOrAdminInterceptor)
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@Param('id') id: number) {
    const profileId = await this.userService.delete(id);
    await this.client.send('delete.profile', profileId).toPromise();
    return HttpStatus.OK;
  }

  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.userService.addRole(dto);
  }

}
