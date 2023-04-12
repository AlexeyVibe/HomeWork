import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";
import {UserRoles} from "./user-role";

interface RoleCreationAtt {
  value: string;
}

@Table({tableName:'roles'})
export class Role extends Model<Role,RoleCreationAtt> {

  @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
  id:number


  @Column({type:DataType.STRING, unique:true, allowNull:false})
  value:string

  @BelongsToMany(() => User,() => UserRoles)
  users:User[]

}