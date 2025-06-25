import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMembershipComponent } from './admin-membership.component';

describe('AdminMembershipComponent', () => {
  let component: AdminMembershipComponent;
  let fixture: ComponentFixture<AdminMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMembershipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
