import { Controller, Inject } from "@nestjs/common";
import { Client, ClientProxy, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { CreateUserDto } from "./dto/creatUserDto";
import { ProfilesService } from "./profiles.service";

@Controller('profiles')
export class ProfilesController {

  constructor(private readonly profileService: ProfilesService,
              ) {}


  @MessagePattern('add.new.user')
  async handleUserData(@Payload() userDto: CreateUserDto) {
    console.log(userDto)
    return  await this.profileService.createProfile(userDto);
  }

  @MessagePattern('get.profiles.list')
  async getAllProfiles() {
    return  await this.profileService.getAllProfiles();
  }

  @MessagePattern('update.profile')
  async updateProfile(@Payload() userDto: CreateUserDto) {
    return  await this.profileService.updateProfile(userDto);
  }

  @MessagePattern('delete.profile')
  async deleteProfile(@Payload() id: number) {
    return  await this.profileService.deleteProfile(id);
  }
}
