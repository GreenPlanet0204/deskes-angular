export class AppError extends Error {
  isServerError = false;
  isFatal: 0 | undefined | boolean = false;
  statusCode: number | undefined;

  constructor(name: string, message: string, isServerError: boolean, statusCode?: any, stack?: any) {
    super();
    this.name = name;
    this.message = message;
    this.stack = stack;
    this.isServerError = isServerError;
    this.statusCode = statusCode;
    this.isFatal = statusCode && statusCode >= 500;
  }
}
