import "express";

declare module "express-serve-static-core" {
  interface Request {
    file?: {
      buffer: Buffer;
      mimetype: string;
      originalname: string;
      size: number;
    };
  }
}
