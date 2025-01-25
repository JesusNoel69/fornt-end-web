import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintBoardComponent } from './sprint-board.component';

describe('SprintBoardComponent', () => {
  let component: SprintBoardComponent;
  let fixture: ComponentFixture<SprintBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SprintBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
