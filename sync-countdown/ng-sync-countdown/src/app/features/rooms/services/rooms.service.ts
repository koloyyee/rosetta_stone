import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room } from '../models/room';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(private readonly http: HttpClient) { }

  findAll() {
    return this.http.get<Room[]>("/rooms");
  }

  findByName(roomName: string ) {
    return this.http.get<Room | null >("/rooms/" + roomName);
  }
}
