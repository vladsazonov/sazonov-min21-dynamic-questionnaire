import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { io, Socket } from 'socket.io-client';

const SOCKET_ENDPOINT = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket: Socket;

  constructor() {
    this.socket = io(SOCKET_ENDPOINT);
  }

  public listen(event: string) {
    return new Observable(subscriber => {
      this.socket.on(event, data => {
        subscriber.next(data);
      });
    });
  }

  public emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
}
