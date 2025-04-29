import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilComponentComponent } from './perfil-component.component';

describe('PerfilComponentComponent', () => {
  let component: PerfilComponentComponent;
  let fixture: ComponentFixture<PerfilComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
