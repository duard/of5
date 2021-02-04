import { Injectable } from '@nestjs/common';

import { Message } from '@of5/shared/interfaces';

@Injectable()
export class AppService {
  getData(): Message {
    return { message: 'Welcome to starter-api!' };
  }
}
