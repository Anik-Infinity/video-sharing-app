import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FieldExceptionFilter } from '../common/filters/field-exception.filter';
import { SystemExceptionFilter } from '../common/filters/system-exception.filter'
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const logger = new Logger('Video Sharing App BootStrap');

    app.setGlobalPrefix('/video-sharing-app/api/v1');

    const options = new DocumentBuilder()
        .setTitle('Video Sharing App API')
        .setDescription('Video Sharing App API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/video-sharing-app', app, document);

    app.enableCors();

    app.useGlobalFilters(new SystemExceptionFilter());
    app.useGlobalFilters(new FieldExceptionFilter());

    await app.listen(3000);

    logger.log(
        `Video Sharing App is running in : http://localhost:3000`,
    );
    logger.log(
        `Video Sharing App API Documentation is running in : http://localhost:3000/video-sharing-app`,
    );
}

bootstrap();
