import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsQueueComponent } from './details-queue.component';

describe('DetailsQueueComponent', () => {
  let component: DetailsQueueComponent;
  let fixture: ComponentFixture<DetailsQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsQueueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
