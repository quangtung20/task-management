import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import Role from 'src/config/role.enum';
import RoleGuard from 'src/guards/role.guard';
import { ProductDto } from './dto/product.dto';
import { GetProductInterface } from './get-product.interface';
import { ProductService } from './product.service';


@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseGuards(RoleGuard(Role.admin))
  create(@Body() productDto: ProductDto): Promise<string> {
    return this.productService.create(productDto);
  }

  @Get()
  getProducts(@Query() queryString): Promise<GetProductInterface> {
    console.log(queryString);
    return this.productService.getProducts(queryString);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: ProductDto): Promise<string> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<string> {
    return this.productService.remove(id);
  }
}
