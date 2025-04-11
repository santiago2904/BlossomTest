import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;

    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const timeElapsed = Date.now() - startTime;

      // Log when the request is completed
      if (statusCode >= 400) {
        this.logger.error(
          `${method} ${originalUrl} ${statusCode} ${contentLength || '-'} - ${timeElapsed}ms`,
        );
      } else if (statusCode >= 200 && statusCode < 300) {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} ${contentLength || '-'} - ${timeElapsed}ms`,
        );
      }
    });

    next();
  }
}
