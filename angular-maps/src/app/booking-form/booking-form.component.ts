import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  elRef: ElementRef;

  constructor(elRef: ElementRef) {
    this.elRef = elRef;
  }  
  ngOnInit(): void {
  }

  getHtmlContent() {
    return this.elRef.nativeElement.innerHTML;
  }
}
