import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rafael',
      email: 'rafael@gmail.com',
      password: '123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Marquinhos',
      email: 'batata@gmail.com',
    });

    expect(updatedUser.name).toBe('Marquinhos');
    expect(updatedUser.email).toBe('batata@gmail.com');
  });

  it('should not be able update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Test',
        email: 'email@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Rafael',
      email: 'rafael@gmail.com',
      password: '123',
    });

    const user = await fakeUsersRepository.create({
      name: 'Marquinhos',
      email: 'batata@gmail.com',
      password: '123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Marquinhos',
        email: 'rafael@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rafael',
      email: 'rafael@gmail.com',
      password: '123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Rafael',
      email: 'rafael@gmail.com',
      old_password: '123',
      password: '123456',
    });

    expect(updatedUser.password).toBe('123456');
  });

  it('should not be able to update the password without entering your old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rafael',
      email: 'rafael@gmail.com',
      password: '123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Rafael',
        email: 'rafael@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rafael',
      email: 'rafael@gmail.com',
      password: '123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Rafael',
        email: 'rafael@gmail.com',
        old_password: 'wrong_old_password',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
