import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/app/services/auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '../src/app/services/logger.service';
import { Auth } from '../src/app/schemas/auth.schemas';
import { HttpStatus } from '@nestjs/common';
import { AuthController } from '../src/app/controllers/auth.controller';
import { getMockRes } from '@jest-mock/express';

describe('AuthService', () => {
  let service: AuthService;
  let controller: AuthController;

  const jwtServiceMock = {
    signAsync: jest.fn().mockResolvedValue('mockAccessToken'),
  };
  const loggerServiceMock = {
    error: jest.fn(),
  };
  const authModelMock = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(Auth.name), useValue: authModelMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: Logger, useValue: loggerServiceMock },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserDetails', () => {
    it('should return user details when user exists', async () => {
      const id = '123';
      const user = { _id: id, name: 'John Doe' };
      const { res } = getMockRes({
        status: HttpStatus.OK,
        body: user,
      });
      const getUserSpy = jest.spyOn(service, 'getUser').mockResolvedValue(user);

      await controller.getUserDetails(res, id);

      expect(getUserSpy).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should handle errors when user does not exist', async () => {
      const id = '123';
      const error = new Error('User not found');
      const { res } = getMockRes({
        status: HttpStatus.NOT_FOUND,
        body: { status: HttpStatus.NOT_FOUND, data: error.message },
      });
      const getUserSpy = jest
        .spyOn(service, 'getUser')
        .mockRejectedValue(error);

      await controller.getUserDetails(res, id);

      expect(getUserSpy).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        status: HttpStatus.NOT_FOUND,
        data: error.message,
      });
    });
  });

  describe('SignIn', () => {
    it('should sign in user if user exists', async () => {
      const user = { email: 'test@example.com' };
      const userExist = { _id: '123', email: 'test@example.com' };
      authModelMock.findOne.mockResolvedValueOnce(userExist);

      const result = await service.SignIn(user);

      expect(authModelMock.findOne).toHaveBeenCalledWith({
        email: user.email.toLowerCase(),
      });
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        sub: userExist._id,
        username: userExist.email,
      });
      expect(result.status).toBe(200);
      expect(result.data).toEqual({
        email: userExist.email,
        _id: userExist._id,
        access_token: 'mockAccessToken',
      });
    });
  });
});
