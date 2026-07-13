import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RoomsLayoutComponent } from './rooms/rooms-layout.component';
import { AuthGuard } from './core/auth/services/auth-guard.service';

export const routes: Routes = [
  {
    path: "",
    component: HomepageComponent,
    title: "Home"
  },
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
    component: RoomsLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        loadComponent: () => import("@/app/rooms/rooms-listing/listing.component").then(m => m.ListingComponent),
        title: "Rooms",

      },
      {
        path: ":id",
        loadComponent: () => import("@/app/rooms/room/room.component").then(m => m.RoomComponent),
        title: "Room",
      }
    ]
  },
  {
    path: "**",
    title: "Not Found",
    loadComponent: () => import("./not-found/not-found.component").then(m => m.NotFoundComponent),
  }
];
