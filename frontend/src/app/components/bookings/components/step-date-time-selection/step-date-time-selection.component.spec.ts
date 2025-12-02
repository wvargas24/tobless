import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepDateTimeSelectionComponent } from './step-date-time-selection.component';

describe('StepDateTimeSelectionComponent', () => {
  let component: StepDateTimeSelectionComponent;
  let fixture: ComponentFixture<StepDateTimeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepDateTimeSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepDateTimeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
