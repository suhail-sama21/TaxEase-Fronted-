import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignupComponent } from './signup-component/signup-component';
import { LoginComponent } from './login-component/login-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SignupComponent,LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('taxeasefrontend');
}
