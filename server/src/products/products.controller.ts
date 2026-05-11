import { Controller, Get, Param, Query } from '@nestjs/common'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('category') category?: string) {
    const products = await this.productsService.findAll(category)
    return {
      code: 200,
      msg: 'success',
      data: products,
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id)
    if (!product) {
      return {
        code: 404,
        msg: '产品不存在',
        data: null,
      }
    }
    return {
      code: 200,
      msg: 'success',
      data: product,
    }
  }
}
