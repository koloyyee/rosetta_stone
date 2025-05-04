import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { AuthGuard } from './core/auth/services/auth-guard.service';
import { SignupComponent } from './core/auth/signup/signup.component';

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
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        loadComponent: () => import("@/app/features/rooms/components/listing/listing.component").then(m => m.ListingComponent),
        title: "Rooms",

        canActivate: [AuthGuard],
      },
      {

        path: ":id",
        loadComponent: () => import("@/app/features/rooms/components/room/room.component").then(m => m.RoomComponent),
        title: "Room",
        canActivate: [AuthGuard],
      }
    ]
  }
];
