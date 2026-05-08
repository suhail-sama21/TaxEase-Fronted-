import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { TaxpayerService } from '../service/taxpayer-service';
import { User } from '../dto/taxpayer-profile';
import { Signal } from '@angular/core';
import { delay } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from '../stores/authStore/auth.features';
import * as AuthActions from '../stores/authStore/auth.action';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit{
  
  isSaving = false;
  isSavingPassword = false;
  isEditMode = false;
  isConfirmModalOpen = false;
  editChanges: any = {};

  // Mock User Data
  userProfile = signal({
    fullName: 'John Doe',
    email: 'auditmazhai@example.com',
    phone: '+1 (555) 123-4567',
    type: 'Citizen',
    address: '123 Main St, Springfield, IL 62701',
    dob: '1985-06-15',
    pan: 'ABCDE1234F'
  });

  security = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  userData: any;
  constructor(private taxpayerService: TaxpayerService, private store: Store){}

  ngOnInit(): void {
    this.store.select(selectUser).subscribe(user => {
      if (user) {
        this.userData = user;
        this.assignData();
        console.log('User Data from Store:', this.userData);
      }
      else{
        console.log("No user data found in sore")
      }
    });
  }

  assignData() {
    this.userProfile.update(profile => ({
      fullName: this.userData.name,
      email: this.userData.email,
      address: this.userData.address,
      phone: this.userData.phone,
      type: this.userData.role || 'Citizen',
      dob: this.userData.dob,
      pan: this.userData.panNumber
    }));
  }

  enableEditMode() {
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.assignData();
  }

  openConfirmModal() {
    this.editChanges = {
      name: this.userProfile().fullName,
      phone: this.userProfile().phone,
      address: this.userProfile().address,
      panNumber: this.userProfile().pan,
      dob: this.userProfile().dob
    };
    this.isConfirmModalOpen = true;
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
  }

  confirmProfileUpdate() {
    if (!this.userData?.id) {
      console.error('User ID not found');
      return;
    }

    this.isSaving = true;
    this.taxpayerService.updateProfile(this.editChanges).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.isEditMode = false;
        this.isConfirmModalOpen = false;
        this.userData = response.user;
        this.assignData();
        alert('Profile updated successfully!');
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Profile update error:', err);
        alert('Failed to update profile. Please try again.');
      }
    });
  }

  saveProfile() {
    this.isSaving = true;
    // Simulate API call to Update Profile
    setTimeout(() => {
      this.isSaving = false;
      alert('Profile updated successfully!');
    }, 1000);
  }

  updatePassword() {
    this.passwordInfoAppear = false;
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (this.security.newPassword.length < 8) {
      this.passwordInfoBox('minimumError');
      return;
    }

    if (!strongRegex.test(this.security.newPassword)) {
      this.passwordInfoBox('strength');
      return;
    }

    if (this.security.newPassword !== this.security.confirmPassword) {
      this.passwordInfoBox('notEqual');
      return;
    }

    if (!this.userData?.id) {
      this.passwordInfoBox('userMissing');
      return;
    }

    this.isSavingPassword = true;

    this.taxpayerService.updatePassword(this.userData.id, {
      oldPassword: this.security.currentPassword,
      newPassword: this.security.newPassword
    }).subscribe({
      next: (response) => {
        this.isSavingPassword = false;
        this.passwordInfoBox('successful');
        this.security.currentPassword = '';
        this.security.newPassword = '';
        this.security.confirmPassword = '';
      },
      error: (err) => {
        this.isSavingPassword = false;
        const errorMessage = typeof err?.error === 'string' ? err.error : err?.message || 'Unable to update password';
        console.error('Password update error:', err);
        
        if (err.status === 401 || /incorrect/i.test(errorMessage)) {
          this.passwordInfoBox('incorrect');
        } else if (err.status === 0) {
          this.passwordInfoBox('networkError');
        } else {
          this.passwordInfoBox('serverError');
        }
      }
    });
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  passwordInfoAppear = false
  infoMessage: string = ""
  boxColor = ""
  passwordInfoBox(message: string){
    this.boxColor="#f85149"
    if (message === "minimumError"){
      this.passwordInfoAppear = true
      this.infoMessage = "Ensure your password is has minimum of 8 characters" 
    }
    else if( message === "strength"){
      this.passwordInfoAppear = true
      this.infoMessage = "Ensure your password is unique and strong with uppercase, lowercase, numbers & symbols"
    }
    else if (message === "notEqual"){
      this.passwordInfoAppear = true
      this.infoMessage = "Passwords do not match. Please confirm your new password."
    }
    else if (message === "incorrect"){
      this.passwordInfoAppear = true
      this.infoMessage = "Current password is incorrect. Please try again."
    }
    else if (message === "userMissing"){
      this.passwordInfoAppear = true
      this.infoMessage = "Unable to find current user. Please log in again."
    }
    else if (message === "serverError"){
      this.passwordInfoAppear = true
      this.infoMessage = "Unable to update password right now. Please try again later."
    }
    else if (message === "networkError"){
      this.passwordInfoAppear = true
      this.infoMessage = "Network error. Please check your connection and try again."
    }
    else if (message === "successful"){
      this.passwordInfoAppear = true;
      this.boxColor ="#3fb950"
      this.infoMessage = "Password changed successfully"
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        this.passwordInfoAppear = false;
      }, 3000);
    }
  }

  
}
