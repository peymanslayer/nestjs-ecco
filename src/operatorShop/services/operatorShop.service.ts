import { Inject, Injectable } from '@nestjs/common';
import { OperatorService } from 'src/operator/services/operator.service';
import { InsertOperatorShopDto } from '../dtos/insert.operatorShop';
import { OperatorShop } from '../operatorShop.schema';
import { Workbook } from 'exceljs';
import { FindAllOperatorShopById } from '../dtos/findAllOperatorById';
import { Op } from 'sequelize';
@Injectable()
export class OperatorShopService {
  constructor(
    private readonly operatorService: OperatorService,
    @Inject('OPERATOR_SHOP')
    private readonly operatorShopRepository: typeof OperatorShop,
  ) {}

  async insertOperatorShop(body: InsertOperatorShopDto) {
    const limitOfDriverOfOperator = await this.limitOfDriverOfOperator(
      body.driver,
    );
    if (limitOfDriverOfOperator.length > 3) {
      return {
        status: 400,
        message: 'limit',
      };
    }
    const insertOperatorShop = await this.operatorShopRepository.create({
      ...body,
    });
    return {
      status: 200,
      message: insertOperatorShop,
    };
  }

  async exportExcelOfOperator() {
    let data = [];
    const findAllOrderOfOperatorById =
      await this.operatorShopRepository.findAll({
        order:[['createdAt','DESC']]
      });
    for (let i = 0; i < findAllOrderOfOperatorById.length; i++) {
      data.push({
        shopCode: findAllOrderOfOperatorById[i].shopCode,
        registerHistory: findAllOrderOfOperatorById[i].registerHistory,
        registerTime: findAllOrderOfOperatorById[i].registerTime,
        driver: findAllOrderOfOperatorById[i].driver,
        plasticPallet: findAllOrderOfOperatorById[i].plasticPallet,
        woodPallet: findAllOrderOfOperatorById[i].woodPallet,
      });
    }
    const book = new Workbook();
    const workSheet = book.addWorksheet('operator');
    workSheet.columns = [
      { key: 'کد فروشگاه', header: 'کد فروشگاه', width: 20 },
      { key: 'تاریخ ثیت', header: 'تاریخ ثبت', width: 20 },
      { key: 'ساعت ثبت', header: 'ساعت ثبت', width: 20 },
      { key: 'نام راننده', header: 'نام راننده', width: 20 },
      { key: 'تعداد پالت پلاستیکی', header: 'تعداد پالت پلاستیکی', width: 20 },
      { key: 'تعداد پالت چوبی', header: 'تعداد پالت چوبی', width: 20 },
    ];
    data.forEach((x) => {
      workSheet.addRow(Object.values(x));
    });

    const buffer = await book.xlsx.writeBuffer();
    return buffer;
  }

  async findAllOperatorShopById(body: FindAllOperatorShopById) {
    if (body.afterHistory && body.beforeHistory) {
      const findAllDeletedOrderByShopId =
        await this.operatorShopRepository.findAll({
          where: {
            operatorId: body.operatorId,
            registerHistory: {
              [Op.between]: [body.beforeHistory, body.afterHistory],
            },
          },
          order:[['registerHistory','DESC']]
        });
      return {
        status: 200,
        message: findAllDeletedOrderByShopId,
      };
    } else {
      const findAllDeletedOrderByShopId =
        await this.operatorShopRepository.findAll({
          where: { operatorId: body.operatorId },
          order:[['registerHistory','DESC']]
        });
      return {
        status: 200,
        message: findAllDeletedOrderByShopId,
      };
    }
  }

  async limitOfDriverOfOperator(name: string) {
    const date = new Date();
    const time = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const result = `${time}/${month}/${day}`;
    console.log(result);

    const limitOfDriverOfOperator = await this.operatorShopRepository.findAll({
      where: { driver: name, registerHistory: result },
    });
    console.log(limitOfDriverOfOperator);

    return limitOfDriverOfOperator;
  }

  async getOperatorShopOrderById(id: number) {
    const getOperatorShopOrderById =
      await this.operatorShopRepository.findByPk(id);
    return {
      status: 200,
      message: getOperatorShopOrderById,
    };
  }
}
