import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { TaxpayerService } from '../service/taxpayer-service';
import { User } from '../dto/taxpayer-profile';
import { Signal } from '@angular/core';
import { delay } from 'rxjs';

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

  userData: any;
  constructor( private taxpayerService: TaxpayerService){}

  ngOnInit(): void {
    this.taxpayerService.getProfile().subscribe({
      next: (data) => {
        if(data){
          this.userData = data;
          this.assignData();
          console.log('User Profile Data:', this.userProfile);
        }
      },error(err) {
        console.error('Error fetching user profile:', err);
      }
    });
  }

  assignData() {
  this.userProfile.update(profile => ({
    ...profile,                   // 1. Keep everything currently in the signal (dob, pan, etc.)
    fullName: this.userData.name, // 2. Overwrite only these specific fields
    email: this.userData.email,
    address: this.userData.address,
    phone: this.userData.phone,
    type: this.userData.role || 'Citizen'
  }));
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
    delay(500);
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (this.security.newPassword.length < 8){
      this.passwordInfoBox("minimumError")
      return;
    }
    else if (!strongRegex.test(this.security.newPassword)){
      console.log(this.security.newPassword);
      console.log(this.security.confirmPassword);
      console.log(strongRegex.test(this.security.newPassword));
      this.passwordInfoBox("strength")
      return;
    }
    else if(this.security.newPassword !== this.security.confirmPassword){
      this.passwordInfoBox("notEqual");
      return;
    }
    
    this.isSavingPassword = true;
    setTimeout(() => {
      this.isSavingPassword = false;
      this.security = { currentPassword: '', newPassword: '', confirmPassword: '' };
      this.passwordInfoBox("successful")
    }, 1000);
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
      this.infoMessage = "Password dosent match, Ensure your new password matches with the confirm password"
    }
    else if (message === "successful"){
      this.passwordInfoAppear = true;
      this.boxColor ="#3fb950"
      this.infoMessage = "Password changed sucessfully"
    }
  }
}