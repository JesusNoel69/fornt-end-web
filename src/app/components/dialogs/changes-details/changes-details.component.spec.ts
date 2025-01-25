import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangesDetailsComponent } from './changes-details.component';

describe('ChangesDetailsComponent', () => {
  let component: ChangesDetailsComponent;
  let fixture: ComponentFixture<ChangesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangesDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
