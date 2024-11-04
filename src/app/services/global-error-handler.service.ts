import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private errorService: ErrorService) {}

  handleError(error: HttpErrorResponse): void {
    let errorMessage: string;

    if (error instanceof HttpErrorResponse) {
      // Server-side error
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client-side error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Server-side error: ${error.status} - ${error.message}`;
      }
    } else {
      // General error
      errorMessage = `An unexpected error occurred: ${error}`;
    }

    // Log the error message for debugging
    console.error('An error occurred:', errorMessage);

    // Pass the error message to the ErrorService
    this.errorService.setError(errorMessage);

    // You can also perform other logging actions here if necessary
  }
}
