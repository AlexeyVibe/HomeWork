import {NestFactory} from "@nestjs/core";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {AppModule} from "./app.module";


async function start() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://rabbitmq:5672'],
            queue: 'profile_queue',
            queueOptions: {
                durable: false
            },
        },
    });

    app.listen();
    // const PORT = process.env.PORT || 5000;
    // const app = await NestFactory.create(AppModule)
    // await app.listen(PORT, () => console.log('Server started on port =' + PORT))
}

start();