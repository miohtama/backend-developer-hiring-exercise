import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /*
  const options = new DocumentBuilder()
  .setTitle('Backend developer exercise')
  .setDescription('Our automatically build Swagger interface')
  .setVersion('1.0')
  .addTag('taggy taa')
  .build();
 
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document); 
  */
  await app.listen(3000);
}
bootstrap();
