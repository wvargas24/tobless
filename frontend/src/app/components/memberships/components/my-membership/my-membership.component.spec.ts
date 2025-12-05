import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MyMembershipComponent } from './my-membership.component';
import { MembershipService } from '../../services/membership.service';

describe('MyMembershipComponent', () => {
    let component: MyMembershipComponent;
    let fixture: ComponentFixture<MyMembershipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MyMembershipComponent],
            imports: [HttpClientTestingModule],
            providers: [MembershipService]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MyMembershipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

