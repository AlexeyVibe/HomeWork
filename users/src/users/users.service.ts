import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from './users.model';
import { RolesService } from "../roles/roles.service";
import { AddRoleDto } from "./dto/addRoleDto";
import { CreateUserDto } from "./dto/createUserDto";
import { Client, ClientProxy, Transport } from "@nestjs/microservices";
import { AuthService } from "../auth/auth.service";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User) private userRepository: typeof User,
              private roleService: RolesService,@Inject(forwardRef(() => AuthService))
              private authService: AuthService,) {
  }

  async createUser(dto: CreateUserDto) {
    const hashPassword = await this.authService.registration(dto);
    const user = await this.userRepository.create({...dto, password: hashPassword});
    const role = await this.roleService.getRoleByValue("ADMIN");
    await user.$set('roles', [role.id]);
    user.roles = [role]
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({include:{all:true}});
    return users;
  }

  async getUserByEmail(email:string){
    const user = await this.userRepository.findOne({where:{email}, include:{all:true}});
    return user;
  }

  async update(id:number, dto: CreateUserDto){
    const hashPassword = await bcrypt.hash(dto.password, 5);
    await this.userRepository.update({...dto, password: hashPassword},{where:{ id:id }});
    const user = await this.userRepository.findByPk(id);
    return user.profileId;
  }

  async delete(id:number){
    const user = await this.userRepository.findByPk(id);
    const profileId = user.profileId;
    await this.userRepository.destroy( {where:{ id:id }});
    return profileId
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);
    if (role && user) {
      await user.$add('role', role.id);
      return dto;
    }
    throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
  }

}
