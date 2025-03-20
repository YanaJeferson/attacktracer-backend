import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async registerAttackTracer(userRegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: userRegisterDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const newUser = this.userRepository.create(userRegisterDto);
    return this.userRepository.save(newUser);
  }

  async registerGitHub(githubUser) {
    let newUser = await this.userRepository.findOne({
      where: { email: githubUser.email },
    });
    if (!newUser) {
      newUser = this.userRepository.create({
        name: githubUser.name,
        email: githubUser.email,
        password: 'github-auth',
        provider: 'github',
        providerId: githubUser.providerId,
      });
      return this.userRepository.save(newUser);
    }
    return newUser;
  }
}
