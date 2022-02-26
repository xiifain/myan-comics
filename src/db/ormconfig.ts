import { ConnectionOptions } from 'typeorm';

const database = {
  development: 'myan-comics-nest',
  test: 'myan_comics_nest_test',
};

// Check typeORM documentation for more information.
const config: ConnectionOptions = {
  type: 'postgres',
  port: Number(process.env.POSTGRES_PORT),
  host: process.env.POSTGRES_HOST, // localhost
  username: process.env.POSTGRES_USER, // databse login role username
  password: process.env.POSTGRES_PASSWORD, // database login role password
  database: database[process.env.NODE_ENV], // db name
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],

  // We are using migrations, synchronize should be set to false.
  synchronize: true,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: true,
  logger: 'file',

  // allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev
  migrations: [__dirname + '/../db/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
};

export = config;
