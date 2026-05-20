/**
 * 邑夏小程序 · 快递模块
 */
import { Module } from '@nestjs/common'
import { ExpressController } from './express.controller'
import { ExpressService } from './express.service'

@Module({
  controllers: [ExpressController],
  providers: [ExpressService],
  exports: [ExpressService],
})
export class ExpressModule {}
