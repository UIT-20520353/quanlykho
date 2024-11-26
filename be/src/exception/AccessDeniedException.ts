import { HttpException } from "./HttpException";

export class AccessDeniedException extends HttpException {
  constructor(message: string) {
    super(message, 403);
  }
}
