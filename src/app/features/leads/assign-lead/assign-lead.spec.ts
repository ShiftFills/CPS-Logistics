import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignLead } from './assign-lead';

describe('AssignLead', () => {
  let component: AssignLead;
  let fixture: ComponentFixture<AssignLead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignLead],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignLead);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
