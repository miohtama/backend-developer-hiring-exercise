import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { APISafeException } from './apiexception';
import { ValidationError } from 'class-validator';


/**
 * An exception filter that echoes back safe errors from deeper in the application over the API.
 *  
 */
@Catch(APISafeException)
export class APIHttpExceptionFilter implements ExceptionFilter {
  catch(exception: APISafeException, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = 500;

    // I could not make Jest + NestJS to capture server-side error logs only on failed tests,
    // so we need to log out all errors here.
    // Otherwise you won't see any server-side diagnostics when tests fail.
    console.log("Server-side exception capture (not necessarily a test error)", exception);

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        // User readable error message
        errorMessage: exception.message,
        // Reflect back machine readable exception name
        errorCategory: exception.constructor.name
      });
  }
}
