export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function assert(condition: any, status: number, msg: string) {
  if (!condition) throw new HttpError(status, msg);
}
