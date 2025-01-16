import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private adminPassword = 'admin123'; // En un caso real, esto debería estar en el backend

  constructor(private router: Router) {}

  login(password: string): boolean {
    return password === this.adminPassword;
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
