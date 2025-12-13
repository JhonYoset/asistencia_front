import { ErrorHandler, Injectable } from "@angular/core";
import { LoggingService } from "@shared/services/logging.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler{
    constructor(private loggingService : LoggingService){}
    handleError(error: any): void {
        this.loggingService.logError(error);
    }
}