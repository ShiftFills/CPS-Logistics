import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OriginBranchForm } from './origin-branch-form';

describe('OriginBranchForm', () => {
  let component: OriginBranchForm;
  let fixture: ComponentFixture<OriginBranchForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OriginBranchForm],
    }).compileComponents();

    fixture = TestBed.createComponent(OriginBranchForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
