import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import entities from 'src/typeorm';

export const typeOrmConfig = async (configService: ConfigService)
: Promise<TypeOrmModuleOptions> => {
  console.log("host : ", configService.get('DB_HOST'));
  return {
    type: 'postgres',
    // host: '172.19.0.2',
    // port: 5432,
    // username: 'postgres',
    // password: 'mysecretpassword',
    // database: 'pong_db',
    host: configService.get('DB_HOST'),
    port: +configService.get<number>('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: entities,
    synchronize: true,
  };
};
