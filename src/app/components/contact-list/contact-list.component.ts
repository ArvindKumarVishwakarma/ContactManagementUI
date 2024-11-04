import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/model/Contact';
import { ContactsService } from 'src/app/services/contacts.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;
  showAddContact = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  private messageTimeout: any;
  constructor(
    private contactsService: ContactsService,
    private errorService: ErrorService
  ) {}
  // triggerError() {
  //   throw new Error('This is a test error!');
  // }
  ngOnInit(): void {
    this.loadContacts();
    this.errorService.error$.subscribe((message) => {
      this.errorMessage = message;
    });
    //Subscribe to error messages from the ErrorService
    this.errorService.error$.subscribe((message) => {
      this.errorMessage = message;
      // Optionally, you can dismiss the error message after some time
      if (message) {
        setTimeout(() => {
          this.errorMessage = null; // Clear the error message after a delay
        }, 5000);
      }
    });
  }
  // loadContacts() {
  //   this.contactsService.getContacts().subscribe((data) => {
  //     this.contacts = data;
  //   });
  // }
  loadContacts() {
    this.contactsService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        this.setMasterAutoDismiss(`Contact loaded successfully!`, 'success');
      },
      error: (err) => {
        //this.setAutoDismiss(`Error loading contacts: ${err.message}`, 'error');
        this.errorMessage = `Error loading contacts: ${err.error}`;
        this.errorService.setError(this.errorMessage);
      },
    });
  }

  onAddContact() {
    this.showAddContact = true;
  }

  onEditContact(contact: Contact) {
    this.selectedContact = contact;
  }

  onContactAdded(event: {
    contact: Contact | null;
    message: string;
    messageType: 'success' | 'error';
  }) {
    this.showAddContact = false;
    //this.setAutoDismiss(event.message, event.messageType);
    if (event.messageType === 'success') {
      this.successMessage = event.message;
      this.errorMessage = null; // Clear any error message if success message is shown
    } else if (event.messageType === 'error') {
      this.errorMessage = event.message;
      this.successMessage = null; // Clear any success message if error message is shown
    }
  }

  onContactUpdated(event: {
    contact: Contact | null;
    message: string;
    messageType: 'success' | 'error';
  }) {
    this.selectedContact = null;
    if (event.messageType === 'success') {
      this.successMessage = event.message;
      this.errorMessage = null; // Clear any error message if success message is shown
    } else if (event.messageType === 'error') {
      this.errorMessage = event.message;
      this.successMessage = null; // Clear any success message if error message is shown
    }
  }

  // onDeleteContact(contactId: number) {
  //   this.contactsService.deleteContact(contactId).subscribe(() => {
  //     this.loadContacts();
  //   });
  // }
  onDeleteContact(contactId: number, email: string) {
    const confirmation = confirm(
      'Are you sure you want to delete this contact?'
    );
    if (!confirmation) return; // If the user cancels, exit the method.
    this.contactsService.deleteContact(contactId).subscribe({
      next: () => {
        this.successMessage = `Contact with email ${email} deleted successfully!`;
        this.errorMessage = null;
      },
      error: (err) => {
        //this.setAutoDismiss(`Error deleting contact: ${err.error}`, 'error');
        this.errorMessage = `Error deleting contact: ${err.error}`;
        this.successMessage = null;
      },
    });
  }

  // Handle cancel events from child components
  onCancelAdd(): void {
    this.showAddContact = false; // Hide the add contact form
  }

  onCancelEdit(): void {
    this.selectedContact = null; // Clear the selected contact
  }
  // Set a timer to auto-dismiss success or error messages
  private setMasterAutoDismiss(message: string, type: 'success' | 'error') {
    clearTimeout(this.messageTimeout); // Clear any existing timeout
    if (type === 'success') {
      this.successMessage = message;
      this.errorMessage = null; // Clear any error message if success message is shown
    } else if (type === 'error') {
      this.errorMessage = message;
      this.successMessage = null; // Clear any success message if error message is shown
    }
    this.messageTimeout = setTimeout(() => {
      this.clearInitialMessages();
    }, 2000); // Dismiss after 2 seconds
  }
  private setGenericAutoDismiss(message: string, type: 'success' | 'error') {
    clearTimeout(this.messageTimeout); // Clear any existing timeout
    if (type === 'success') {
      this.successMessage = message;
      this.errorMessage = null; // Clear any error message if success message is shown
    } else if (type === 'error') {
      this.errorMessage = message;
      this.successMessage = null; // Clear any success message if error message is shown
    }
  }
  clearMessages() {
    this.successMessage = null;
    this.errorMessage = null;
    this.loadContacts();
  }
  clearInitialMessages() {
    this.successMessage = null;
    this.errorMessage = null;
  }
}
