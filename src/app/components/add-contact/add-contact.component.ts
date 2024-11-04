import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact } from 'src/app/model/Contact';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css'],
})
export class AddContactComponent implements OnInit {
  @Output() contactAdded = new EventEmitter<{
    contact: Contact | null;
    message: string;
    messageType: 'success' | 'error';
  }>();
  @Output() cancelAdd = new EventEmitter<void>(); // Emit cancel event
  addContactForm: FormGroup;
  constructor(
    private contactsService: ContactsService,
    private fb: FormBuilder
  ) {
    this.addContactForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }
  onCancel() {
    this.cancelAdd.emit(); // Emit cancel event
    this.addContactForm.reset(); // Reset the form
  }
  ngOnInit(): void {}
  onSubmit() {
    if (this.addContactForm.valid) {
      const newContact: Contact = this.addContactForm.value;
      this.contactsService.addContact(newContact).subscribe({
        next: (contact) => {
          this.contactAdded.emit({
            contact,
            message: `Contact ${contact.fname} added successfully!`,
            messageType: 'success',
          });
          this.addContactForm.reset();
        },
        error: (err) => {
          this.contactAdded.emit({
            contact: null, // No contact added
            message: `Error adding contact: ${err.error}`,
            messageType: 'error',
          });
        },
      });
    }
  }
}
