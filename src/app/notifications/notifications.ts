import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html'
})
export class NotificationsComponent {
  // Mock data mapping to your Get User Notifications endpoint
  notifications = [
    { 
      id: 1, 
      title: 'Filing Deadline Approaching', 
      desc: 'Your Q1 2026 tax filing is due in 5 days. Please submit your documents to avoid penalties.', 
      time: '2 hours ago', 
      type: 'warning', 
      icon: '⚠', 
      read: false 
    },
    { 
      id: 2, 
      title: 'Payment Confirmation', 
      desc: 'We have successfully received your payment of $4,250.00 for Filing ID FIL-003.', 
      time: '1 day ago', 
      type: 'success', 
      icon: '✓', 
      read: true 
    },
    { 
      id: 3, 
      title: 'Compliance Audit Update', 
      desc: 'Your recent filing has been selected for a routine compliance check. No action required at this time.', 
      time: '3 days ago', 
      type: 'info', 
      icon: 'ℹ', 
      read: true 
    },
    { 
      id: 4, 
      title: 'System Maintenance', 
      desc: 'TaxEase will be down for scheduled maintenance on Sunday from 2:00 AM to 4:00 AM EST.', 
      time: '1 week ago', 
      type: 'system', 
      icon: '🔔', 
      read: true 
    },
    { 
      id: 5, 
      title: 'Document Verified', 
      desc: 'Your ID Proof (DOC-001) has been successfully verified by our compliance team.', 
      time: '2 weeks ago', 
      type: 'verified', 
      icon: '★', 
      read: true 
    }
  ];

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    // Here you would call: PUT /Mark Notification as Read
  }

  markAsRead(notif: any) {
    notif.read = true;
  }
}