import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import RoleGuard from 'src/guards/role.guard';
import Role from 'src/config/role.enum';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/database/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(RoleGuard(Role.admin))
  findAll() {
    return this.userService.findAll();
  }

  @Get('/infor')
  @UseGuards(RoleGuard(Role.user))
  findOne(@GetUser() user: User) {
    return this.userService.findOne(user._id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.admin))
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Patch('/addcart')
  @UseGuards(RoleGuard(Role.user))
  addCart(@GetUser() user: User, @Body() cart: any): Promise<string> {
    return this.userService.addCart(user, cart);
  }
}
