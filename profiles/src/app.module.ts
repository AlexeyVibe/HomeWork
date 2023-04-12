import {Module} from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import { Profile } from "./profiles/profiles.model";
import { ProfilesModule } from "./profiles/profiles.module";



@Module({
    providers: [],
    controllers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [Profile],
            autoLoadModels: true,
            synchronize: true,
        }),
        ProfilesModule,
    ],
})
export class AppModule{}