import { Router } from 'express';

import AuthenticationUserService from '../services/AuthenticationUserService';

const usersRouter = Router();

// DTO - Data Transfer Object

usersRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticationUserService = new AuthenticationUserService();

  const { user, token } = await authenticationUserService.execute({
    email,
    password
  });

  delete user.password;

  return response.json({ user, token });
});

export default usersRouter;
