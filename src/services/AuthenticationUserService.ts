import { compare } from 'bcryptjs';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

import User from '../models/User';

interface RequestDTO {
  email: string;
  password: string;
}

class AuthenticatorUserService {
  public async execute({ email, password }: RequestDTO): Promise<{ user: User, token: string }> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { email }
    });

    if(!user) {
      throw new AppError('Incorrect email or password!', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if(!passwordMatched){
      throw new AppError('Incorrect email or password!', 401);
    }

    const token = sign({  }, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn
    });

    return { user, token };
  }
}

export default AuthenticatorUserService;
