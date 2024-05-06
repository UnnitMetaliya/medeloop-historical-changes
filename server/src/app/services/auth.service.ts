import { Injectable } from '@tsed/di';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from '../schemas/auth.schemas';
import { AuthControllerDto } from '../dto/auth.controller.dto';
import * as bcrypt from 'bcrypt';
import { Logger } from './logger.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger: Logger;

  constructor(
    @InjectModel(Auth.name) private authModel: Model<Auth>,
    private readonly loggerService: Logger,
    private jwtService: JwtService,
  ) {
    this.logger = loggerService;
  }

  private sendStatus(data: any | Record<string, any>, status: number) {
    const errorMessage = data instanceof Error ? data.message : data;
    return {
      status,
      data: errorMessage,
    };
  }
  async SignIn(user: AuthControllerDto) {
    try {
      const userExist: Auth = await this.authModel.findOne({
        email: user.email.toLowerCase(),
      });
      if (userExist) {
        const payload = { sub: userExist._id, username: userExist.email };
        const access_token = await this.jwtService.signAsync(payload);
        return this.sendStatus(
          {
            email: userExist.email,
            _id: userExist._id,
            access_token,
          },
          200,
        );
      } else {
        await this.SignUp({
          email: user.email.toLowerCase(),
          password: 'defaultPassword',
        });
        return this.SignIn({
          email: user.email.toLowerCase(),
        });
      }
    } catch (error) {
      throw new Error('Something went wrong!');
    }
  }

  async SignUp(user: any): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const authObj = new this.authModel({
        email: user.email.toLowerCase(),
        password: hashedPassword,
      });
      return this.sendStatus(await authObj.save(), 200);
    } catch (error) {
      if (error.code === 11000) {
        return this.sendStatus('The User is already registered', 421);
      } else {
        return this.sendStatus('Whoops, something bad happened', 500);
      }
    }
  }

  async isAdmin(user: string) {
    try {
      const userExist: Auth = await this.authModel.findOne({
        _id: user,
        isAdmin: true,
      });
      if (userExist) {
        return this.sendStatus(userExist, 200);
      } else {
        throw new Error('Whoops, Not An Admin');
      }
    } catch (error) {
      throw error;
    }
  }
  async isAnUser(user: any) {
    try {
      const userExist: Auth = await this.authModel.findOne({
        _id: user,
      });
      if (userExist) {
        return this.sendStatus(true, 200);
      } else {
        throw new Error('Whoops, User is not registered');
      }
    } catch (error) {
      throw error;
    }
  }
  async getUser(id: string): Promise<any> {
    try {
      const response = await this.authModel.findOne(
        { _id: id },
        { password: 0 },
      );
      return response;
    } catch (error) {
      console.log(error);
      throw new Error('something went wrong.');
    }
  }
}
