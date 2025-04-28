import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { SignupComponent } from './core/auth/signup/signup.component';
import { AuthGuard } from './core/auth/services/auth-guard.service';

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    title: "Login"
  },
  {
    path: "signup",
    component: SignupComponent,
    title: "Sign Up"
  },
  {
    path: "rooms",
    loadComponent: () => import("@/app/features/rooms/listing/listing.component").then(m => m.ListingComponent),
    title: "Rooms",
    canActivate: [AuthGuard]
  }
];
