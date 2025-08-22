import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "rooms",
    pathMatch: "full"
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
  }
];
