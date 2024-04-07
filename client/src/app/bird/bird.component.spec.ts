import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirdComponent } from './bird.component';

describe('HotelComponent', () => {
  let component: BirdComponent;
  let fixture: ComponentFixture<BirdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
