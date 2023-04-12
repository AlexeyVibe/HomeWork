import { forwardRef, Module } from "@nestjs/common";
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { UserRoles } from "./user-role";
import { User } from "../users/users.model";
import { Role } from './roles.model';
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    SequelizeModule.forFeature([Role, User, UserRoles]),
  ],
  exports: [RolesService]
})
export class RolesModule {}
