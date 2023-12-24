import { Sequelize } from 'sequelize-typescript';
import { Auth } from 'src/auth/auth.entity';
import { Order } from 'src/order/order,entity';
import { Comment } from 'src/comment/comment..entity';
import { Driver } from 'src/driver/driver.entity';
import { OrderDriver } from 'src/order/orderDriver.entity';
import { Stock } from 'src/ReceiveStock/stock.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'everest.liara.cloud',
        port: 30389,
        username: 'root',
        password: 'OarJYbxUV9bSSM9KMfQdV2XB',
        database: 'nifty_diffie'
      });
      sequelize.addModels([Auth]);
      sequelize.addModels([Order,Driver,OrderDriver,Comment]);
      sequelize.addModels([Stock])
      await sequelize.sync();
      return sequelize;
    },
  },
];
