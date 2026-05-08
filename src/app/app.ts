import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from './stores/authStore/auth.action'; // Adjust path to your actions

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit {
  title = 'TaxEase';
  
  // Using inject() to match your LayoutComponent style
  private store = inject(Store);

  ngOnInit() {
    // 1. Check if a session exists in the browser storage
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('user_email');

    // 2. If we have a token but the Store is empty (e.g., after F5 refresh),
    // fetch the profile immediately to restore the user's session.
    if (token && email) {
      this.store.dispatch(AuthActions.getProfile({ email }));
    }
  }
}