import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { Profile } from "./profiles.model";
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [ProfilesController],
  imports: [
    SequelizeModule.forFeature([Profile]),
    // ClientsModule.register([
    //   {
    //     name: 'USER_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://localhost:5672'],
    //       queue: 'user_queue',
    //     },
    //   },
    // ]),
  ],
  providers: [ProfilesService,
  //   {
  //   provide: 'USER_SERVICE',
  //   useFactory: () =>  ClientProxyFactory.create({
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: ['amqp://localhost:5672'],
  //       queue: 'user_queue',
  //     },
  //   }),
  // }
  ],
})
export class ProfilesModule {}
