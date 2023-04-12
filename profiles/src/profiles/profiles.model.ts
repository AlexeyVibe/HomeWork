import { Column, DataType, Model, Table } from "sequelize-typescript";

interface ProfileCreationAtt {
  name: string;
  phone: string;
}

@Table({tableName:'profiles'})
export class Profile extends Model<Profile,ProfileCreationAtt>{


  @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
  id:number


  @Column({type:DataType.STRING, allowNull:false})
  name: string;


  @Column({type:DataType.STRING, allowNull:false})
  phone: string;


}