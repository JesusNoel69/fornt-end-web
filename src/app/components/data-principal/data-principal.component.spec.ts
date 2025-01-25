import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPrincipalComponent } from './data-principal.component';

describe('DataPrincipalComponent', () => {
  let component: DataPrincipalComponent;
  let fixture: ComponentFixture<DataPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataPrincipalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
