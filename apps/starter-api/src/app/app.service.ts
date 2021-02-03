import { Injectable } from '@nestjs/common';

import { IMessage } from '@of5/shared/interfaces';

@Injectable()
export class AppService {
  getData(): IMessage {
    return { message: 'Welcome to starter-api!' };
  }
}
