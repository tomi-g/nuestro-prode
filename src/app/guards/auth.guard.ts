import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const navigation = this.router.getCurrentNavigation();
    const authenticated = navigation?.extras?.state?.['authenticated'];

    if (authenticated) {
      return true;
    }

    this.authService.redirectToLogin();
    return false;
  }
}
