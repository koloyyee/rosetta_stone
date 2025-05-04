import { JwtService } from '@/app/core/auth/services/jwt.service';
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private sessions: Map<String, WebSocketSubject<unknown>> = new Map();
  constructor(private readonly jwtService: JwtService) {}

  connectToRoom(roomId : String) {
    if ( !this.sessions.has(roomId)) {
      const token = this.jwtService.get();
      const subject = webSocket(`ws://localhost:8080/ws/timer/${roomId}?token=${token}`);
      this.sessions.set(roomId, subject);
    }
    return this.sessions.get(roomId);
  }

  disconnectFromRoom(roomId: String) {
    const subject = this.sessions.get(roomId);
    if (subject) {
      subject.complete();
      this.sessions.delete(roomId);
    }
  }
}
