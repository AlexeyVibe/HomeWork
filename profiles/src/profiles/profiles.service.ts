import { Injectable } from '@nestjs/common';
import { Profile } from "./profiles.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/creatUserDto";


@Injectable()
export class ProfilesService {

  constructor(@InjectModel(Profile) private profileRepository: typeof Profile) {
  }

  async createProfile(dto: CreateUserDto) {
    const profile = await this.profileRepository.create(dto);
    return profile;
  }

  async getAllProfiles(){
    const profiles = await this.profileRepository.findAll({include:{all:true}});
    return profiles;
  }

  async updateProfile(dto: CreateUserDto){
    await this.profileRepository.update({name: dto.name, phone: dto.phone}
      ,{where:{ id:dto.profileId }})
  }

  async deleteProfile(id:number){
    await this.profileRepository.destroy( {where:{ id:id }});
  }
}
