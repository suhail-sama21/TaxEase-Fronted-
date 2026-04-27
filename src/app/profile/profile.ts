import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html'
})
export class ProfileComponent {
  isSaving = false;
  isSavingPassword = false;

  // Mock User Data
  userProfile = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    type: 'Citizen',
    address: '123 Main St, Springfield, IL 62701',
    dob: '1985-06-15',
    pan: 'ABCDE1234F'
  };

  security = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  saveProfile() {
    this.isSaving = true;
    // Simulate API call to Update Profile
    setTimeout(() => {
      this.isSaving = false;
      alert('Profile updated successfully!');
    }, 1000);
  }

  updatePassword() {
    if (this.security.newPassword !== this.security.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    this.isSavingPassword = true;
    setTimeout(() => {
      this.isSavingPassword = false;
      this.security = { currentPassword: '', newPassword: '', confirmPassword: '' };
      alert('Password updated successfully!');
    }, 1000);
  }
}