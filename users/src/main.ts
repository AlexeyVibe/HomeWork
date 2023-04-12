import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Controller, Get } from "@nestjs/common";

@Controller()
class HelloController {
  @Get()
  getHello() {
    return 'привет';
  }
}

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule)
  await app.listen(PORT, () => console.log('Server started on port =' + PORT))
}


start();
