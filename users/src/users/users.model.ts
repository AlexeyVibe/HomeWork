import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Role } from "../roles/roles.model";
import { UserRoles } from "../roles/user-role";

interface UserCreationAtt {
  email: string;
  password: string;
}

@Table({tableName:'users'})
export class User extends Model<User,UserCreationAtt> {

  @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
  id:number

  @Column({type:DataType.STRING, unique:true, allowNull:false})
  email:string

  @Column({type:DataType.INTEGER, unique:true})
  profileId:number

  @Column({type:DataType.STRING, allowNull:false})
  password:string

  @BelongsToMany(() => Role,() => UserRoles)
  roles:Role[]



}