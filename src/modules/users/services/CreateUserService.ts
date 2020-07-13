import { hash } from 'bcryptjs';

import { getRepository } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

interface UserDTO {
  name: string;
  email: string;
  password: string;
}

class CreateUserService{
  public async execute({ name, email, password }: UserDTO): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExists = await userRepository.findOne({
      where: { email: email }
    });

    if(checkUserExists){
      throw new AppError('Email adress already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword
    });

    await userRepository.save(user);

    delete user.password;

    return user;
  }
}

export default CreateUserService;
