import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import Role from 'src/config/role.enum';
import { User } from 'src/database/entities/user.entity';
import { GetUser } from 'src/decorators/get-user.decorator';
import RoleGuard from 'src/guards/role.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('api/payment')
  @UseGuards(RoleGuard(Role.user))
  create(@Body() createPaymentDto: CreatePaymentDto, @GetUser() user: User) {
    return this.paymentService.create(createPaymentDto, user);
  }

  @Get('api/payment')
  @UseGuards(RoleGuard(Role.admin))
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('user/history')
  @UseGuards(RoleGuard(Role.user))
  history(@GetUser() user: User) {
    return this.paymentService.history(user._id, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
