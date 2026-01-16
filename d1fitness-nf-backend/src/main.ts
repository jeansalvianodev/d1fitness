import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('D1FITNESS - Envio de Notas Fiscais')
    .setDescription('API para automação de envio de Notas Fiscais eletrônicas por email. Integra-se com APIs de vendas, processa XML de NF-e, gera DANFE em PDF e envia por email.')
    .setVersion('1.0')
    .addTag('Vendas', 'Endpoints para consulta de vendas')
    .addTag('Notas Fiscais', 'Endpoints para busca de notas fiscais')
    .addTag('Envio de Notas Fiscais', 'Endpoints para envio de NF por email')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
