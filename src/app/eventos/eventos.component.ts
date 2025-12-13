import { Component } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent {
  contador : number = 0

  incrementarContador(){
    this.contador ++
  }
  decrementarContador(){
    this.contador --
  }
}
