import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Roles } from '../../decorators/roles.decorator';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { HttpConflictErrors } from '../../errorHandling/httpConflictErrors.type';
import { HttpNotFoundErrors } from 'src/errorHandling/httpNotFoundErrors.type';

@Injectable()
@Roles('admin')
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException({
        type: HttpNotFoundErrors.USERS_USER_NOT_FOUND,
        description: 'user is not found',
      });
    }
    return user;
  }

  async getByEmail(email: string) {
    return await this.userRepository.findOne({ email });
  }

  async create(payload: RegisterDto) {
    const checkUserExistence = await this.getByEmail(payload.email);

    if (checkUserExistence) {
      throw new ConflictException({
        type: HttpConflictErrors.USERS_USER_EXISTS,
        description: 'user is already present',
      });
    }

    const newUser = this.userRepository.create(payload);
    return await this.userRepository.save(newUser);
  }

  async update(editRequestDto: UpdateUserDto, user: User) {
    user.city = editRequestDto.city;
    user.street = editRequestDto.street;
    user.number = editRequestDto.number;
    user.zipCode = editRequestDto.zipCode;
    user.firstName = editRequestDto.firstName;
    user.lastName = editRequestDto.lastName;
    user.role = editRequestDto.role;
    user.phoneNumber = editRequestDto.phoneNumber;

    return await this.userRepository.save(user);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
