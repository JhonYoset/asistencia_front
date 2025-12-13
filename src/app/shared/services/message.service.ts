import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messageSource : Subject<string> = new Subject<string>()
  message$ = this.messageSource.asObservable()

  constructor() { }

  sendMessage(message : string){
    this.messageSource.next(message);
  }
}
