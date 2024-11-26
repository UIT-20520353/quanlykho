import { HttpException } from "./HttpException";

export class AuthenException extends HttpException {
  constructor(message: string) {
    super(message, 401);
  }
}
