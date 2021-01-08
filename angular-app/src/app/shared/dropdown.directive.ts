import { Directive, ElementRef, Renderer2, OnInit, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit{

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit(){

  }
  
  @HostBinding('class.open') toggleOpen: boolean = false;
  @HostListener('document:click',['$event']) toggle(event: Event){
    this.toggleOpen = this.elRef.nativeElement.contains(event.target) ? !this.toggleOpen : false;
  }
  
  
  

}
