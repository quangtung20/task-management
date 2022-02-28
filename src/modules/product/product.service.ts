import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { APIfeatures } from 'src/config/query.feature';
import { ProductDto } from './dto/product.dto';
import { GetProductInterface } from './get-product.interface';
import { ProductRepository } from './product.repository';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository
  ) { }

  async create(productDto: ProductDto): Promise<string> {
    try {
      if (!productDto.image) throw new BadRequestException('No image upload');

      const product = await this.productRepository.findOne({ product_id: productDto.product_id });
      if (product) {
        new BadRequestException('This product already exists.');
      }

      productDto.title = productDto.title.toLowerCase();

      await this.productRepository.save(productDto);

      return 'Created a product';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getProducts(queryString): Promise<GetProductInterface> {
    try {
      const page: number = <number>queryString.page * 1 || 1;
      const limit: number = <number>queryString.limit * 1 || 1;
      const skip = limit * (page - 1);
      const title = queryString.title;
      let search: string = queryString.search.toString();
      let inc: ('ASC' | 'DESC') = 'ASC';
      if (search.search('-') !== -1) {
        inc = 'DESC';
        search = search.split('-').join('');
      }

      const query = this.productRepository.createQueryBuilder('product')

      if (title) {
        query.andWhere(
          '(LOWER(product.title) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search) OR LOWER(product.content) LIKE LOWER(:search))',
          { search: `%${title}%` },
        )
      }

      query.leftJoinAndSelect('product.image', 'image').orderBy(`product.${search}`, `${inc}`).skip(skip).take(limit);
      const products = await query.getMany();
      products.forEach((product) => {
        delete product.image.id;
      })

      return { status: 'success', result: products.length, products: products };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async update(id: string, updateProductDto: ProductDto): Promise<string> {
    try {
      if (!updateProductDto.image) {
        throw new BadRequestException('No image upload');
      }
      await this.productRepository.update(id, updateProductDto);

      return 'Updated a Product';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      await this.productRepository.delete(id);
      return 'Deleted a Product';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
