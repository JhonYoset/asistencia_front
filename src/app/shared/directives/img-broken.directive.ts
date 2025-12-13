import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[appImgBroken]'
})
export class ImgBrokenDirective {
  @Input() srcFallback : string = '../../../assets/images/error-icon-25254.png'

  constructor(private elementRef : ElementRef) { }

  @HostListener('error') handleError(){
    const nativeElement : HTMLImageElement = this.elementRef.nativeElement
    nativeElement.src = this.srcFallback
  }

  

}
