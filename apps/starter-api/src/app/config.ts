import { join } from 'path';

import { environment } from './../environments/environment';

export const config = () => ({
  port: Number(process.env.API_PORT),
  host: process.env.API_HOST,
  jwtSecret: process.env.JWT_SECRET,
  database: {
    type: environment.API_BASE_TYPEORM_TYPE || 'mysql',
    port: Number(environment.API_BASE_TYPEORM_PORT),
    synchronize: environment.API_BASE_TYPEORM_SYNC,

    database: environment.API_BASE_TYPEORM_DATABASE,
    username: environment.API_BASE_TYPEORM_USERNAME,
    password: environment.API_BASE_TYPEORM_PASSWORD,
    host: environment.API_BASE_TYPEORM_HOSTNAME,

    entities: [
      __dirname + '/../**/*.entity{.ts,.js}',
      'libs/typeorm/src/lib/entity/**/*.entity{.ts,.js}',
      'libs/lib-api-cruds/src/lib/entity/**/*.entity{.ts,.js}',
      join(__dirname, './**/*.entity{.ts,.js}'),
      '../../../../../libs/lib-api-cruds/src/lib/*.entity{.ts,.js}',
      "src/**/**.entity{.ts,.js}",
      "../../../../libs/api-pessoas/src/lib/*.entity{.ts,.js}"

    ],
    // logging: 'all',
    autoLoadEntities: true,
    logging: false

  },
});

/*
  production: false,
  environment: 'development',
  TIMEZONE: 'America/Sao_Paulo',

  API_BASE_TYPEORM_TYPE: process.env.API_BASE_TYPEORM_TYPE,
  API_BASE_TYPEORM_PORT: process.env.API_BASE_TYPEORM_PORT,
  API_BASE_TYPEORM_SYNC: process.env.API_BASE_TYPEORM_SYNC,

  API_BASE_TYPEORM_DATABASE: process.env.API_BASE_TYPEORM_DATABASE,
  API_BASE_TYPEORM_USERNAME: process.env.API_BASE_TYPEORM_USERNAME,
  API_BASE_TYPEORM_PASSWORD: process.env.API_BASE_TYPEORM_PASSWORD,
  API_BASE_TYPEORM_HOSTNAME: process.env.API_BASE_TYPEORM_HOSTNAME,

  API_PORT: 3333,
  API_HOST: 'localhost',
  JWT_SECRET: 'secredinhos 3D',
*/
