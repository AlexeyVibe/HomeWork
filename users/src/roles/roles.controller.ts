import { Body, Controller, Get, Param, Post, UsePipes } from "@nestjs/common";
import { RolesService } from './roles.service';
import { CreateRoleDto } from "./dto/createRoleDto";

@Controller('roles')
export class RolesController {

  constructor(private roleService: RolesService) {}


  @Post()
  create(@Body() dto: CreateRoleDto){
    return this.roleService.createRole(dto);
  }


  @Get('/:value')
  getByValue(@Param('value') value:string){
    return this.roleService.getRoleByValue(value);
  }
}
