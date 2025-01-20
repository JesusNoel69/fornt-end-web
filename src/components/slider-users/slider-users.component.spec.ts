import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderUsersComponent } from './slider-users.component';

describe('SliderUsersComponent', () => {
  let component: SliderUsersComponent;
  let fixture: ComponentFixture<SliderUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SliderUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
