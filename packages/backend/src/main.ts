import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateOpenApi } from '@ts-rest/open-api';
import { SwaggerModule } from '@nestjs/swagger';
import { tsRestRoute } from '@monorepo-firebase/ts-router/dist';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const document = generateOpenApi(tsRestRoute, {
    info: {
      title: 'Posts API',
      version: '1.0.0',
    },
  }, {
    setOperationId: true,
    jsonQuery: true
  },
  );

  SwaggerModule.setup('define-api', app, document);

  await app.listen(3000);
}
bootstrap();
