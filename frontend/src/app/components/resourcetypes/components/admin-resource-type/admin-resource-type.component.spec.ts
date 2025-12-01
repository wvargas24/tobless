import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResourceTypeComponent } from './admin-resource-type.component';

describe('AdminResourceTypeComponent', () => {
  let component: AdminResourceTypeComponent;
  let fixture: ComponentFixture<AdminResourceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminResourceTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminResourceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
