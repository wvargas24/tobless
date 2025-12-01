import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepResourceSelectionComponent } from './step-resource-selection.component';

describe('StepResourceSelectionComponent', () => {
  let component: StepResourceSelectionComponent;
  let fixture: ComponentFixture<StepResourceSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepResourceSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepResourceSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
