import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Using Angular Signals for reactive UI updates
  errorMessage = signal<string | null>(null);

  showError(message: string) {
    this.errorMessage.set(message);
    
    // Automatically hide the toast after 5 seconds
    setTimeout(() => {
      this.clear();
    }, 5000);
  }

  clear() {
    this.errorMessage.set(null);
  }
}