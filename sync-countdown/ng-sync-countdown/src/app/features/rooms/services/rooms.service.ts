import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room } from '../components/room/room';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(private readonly http: HttpClient) { }

  findAll() {
    return this.http.get<Room[]>("/rooms");
  }

  findById(roomId: string) {
    return this.http.get<Room | null>("/rooms/" + roomId);
  }

  saveRoom(roomName: string) {
    return this.http.post<Room>("/rooms",  roomName  );

  }
}
