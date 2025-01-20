import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralConfigurationProductOwnerComponent } from './general-configuration-product-owner.component';

describe('GeneralConfigurationProductOwnerComponent', () => {
  let component: GeneralConfigurationProductOwnerComponent;
  let fixture: ComponentFixture<GeneralConfigurationProductOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralConfigurationProductOwnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneralConfigurationProductOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
