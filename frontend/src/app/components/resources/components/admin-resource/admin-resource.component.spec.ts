import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResourceComponent } from './admin-resource.component';

describe('AdminResourceComponent', () => {
  let component: AdminResourceComponent;
  let fixture: ComponentFixture<AdminResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminResourceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
