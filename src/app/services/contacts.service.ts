import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from '../model/Contact';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getContacts(): Observable<Contact[]> {
    return this.http
      .get<Contact[]>(`${this.apiUrl}/Contacts`)
      .pipe(catchError(this.handleError));
  }

  getContact(id: number): Observable<Contact> {
    return this.http
      .get<Contact>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  addContact(contact: Contact): Observable<Contact> {
    return this.http
      .post<Contact>(`${this.apiUrl}/Contacts`, contact)
      .pipe(catchError(this.handleError));
  }

  updateContact(contact: Contact): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/Contacts/${contact.id}`, contact)
      .pipe(catchError(this.handleError));
  }

  deleteContact(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/Contacts/${id}`)
      .pipe(catchError(this.handleError));
  }
  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    const errorMessage = `Error ${error.status}: ${error.message}`;
    // Log the error to the console for debugging
    console.error('An error occurred:', error);
    console.error('An error occurred:', errorMessage);

    //return throwError(() => error); // Rethrow the error to be handled globally
    return throwError(() => error); // Rethrow the error to be handled globally
  }
}
