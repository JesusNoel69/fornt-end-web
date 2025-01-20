import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintsPrincipalComponent } from './sprints-principal.component';

describe('SprintsPrincipalComponent', () => {
  let component: SprintsPrincipalComponent;
  let fixture: ComponentFixture<SprintsPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintsPrincipalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SprintsPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
