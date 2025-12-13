import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LifecycleLoggerService {

  constructor() { }

  log(component : string, hook : string, details ?: any) : void{
    console.log(`[${component}] ${hook}`, details || '')
  }
}
