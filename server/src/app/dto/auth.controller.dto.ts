import { IsString, IsNotEmpty } from 'class-validator';

export class AuthControllerDto {
  @IsString({ message: 'email must be an string' })
  @IsNotEmpty({ message: 'email must be an string' })
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}
