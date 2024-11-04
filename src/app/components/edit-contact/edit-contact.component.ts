import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  OnChanges, // Ensure to import OnChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact } from 'src/app/model/Contact';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
})
export class EditContactComponent implements OnInit, OnChanges {
  @Input() contact: Contact | null = null; // Input property for receiving the contact to edit
  @Output() contactUpdated = new EventEmitter<{
    contact: Contact | null;
    message: string;
    messageType: 'success' | 'error';
  }>(); // Output event to notify parent component of updates
  @Output() cancelEdit = new EventEmitter<void>(); // Emit cancel event
  editContactForm: FormGroup; // Declare the form group

  constructor(
    private contactsService: ContactsService,
    private fb: FormBuilder
  ) {
    // Initialize the form group with form controls
    this.editContactForm = this.fb.group({
      id: [''],
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // Watch for changes in the input property 'contact'
    if (changes['contact'] && this.contact) {
      this.editContactForm.patchValue(this.contact); // Update form values with new contact data
    }
  }

  onSubmit() {
    if (this.editContactForm.valid) {
      const updatedContact: Contact = this.editContactForm.value; // Get the updated contact data
      this.contactsService.updateContact(updatedContact).subscribe({
        next: (contact) => {
          this.contactUpdated.emit({
            contact: updatedContact,
            message: `Contact ${updatedContact.fname} edited successfully!`,
            messageType: 'success',
          }); // Emit the updated contact
        },
        error: (err) => {
          // Optionally handle error, e.g., emit an error message
          this.contactUpdated.emit({
            contact: null, // No contact added
            message: `Error editing contact: ${err.message}`,
            messageType: 'error',
          });
        },
      });
    }
  }
  onCancel() {
    this.cancelEdit.emit(); // Emit cancel event
    this.editContactForm.reset(); // Reset the form
  }
  ngOnInit(): void {
    // Additional initialization logic can go here
  }
}
