import { Sequelize } from 'sequelize-typescript';
import { Auth } from 'src/auth/auth.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'peyman1378()&P',
        database: 'nest-ecco',
      });
      sequelize.addModels([Auth]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
