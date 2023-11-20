import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { c } from './contract';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @TsRestHandler(c.hello)
  // async getHello() {
  //   return tsRestHandler(c.hello, async () => {
  //     return {
  //       status: 200,
  //       body: { name: 'Hello' }
  //     }
  //   })
  // }
}
